/* Checkout page (demo only): validates the form, shows a confirmation, clears the cart. No data leaves the browser. */
(function () {
  'use strict';
  var NS = window.NovaShop;
  var root = NS.$('#checkout-root');
  if (!root) return;
  var ORDER_KEY = 'novashop_last_order_summary';
  var justPlaced = false;

  function summaryHTML(items, t) {
    return '<ul class="mini-list">' + items.map(function (i) {
      var p = NS.getProduct(i.id);
      var opts = [i.color, i.size ? 'Size ' + i.size : ''].filter(Boolean).join(' · ');
      return '<li><span class="mini-img"><img src="' + NS.esc(p.images[0]) + '" alt="" width="64" height="64" loading="lazy"><b>' + i.qty + '</b></span><span class="mini-name">' + NS.esc(p.name) + (opts ? '<small>' + NS.esc(opts) + '</small>' : '') + '</span><span>' + NS.money(p.price * i.qty) + '</span></li>';
    }).join('') + '</ul>' +
      '<dl class="totals"><div><dt>Subtotal</dt><dd>' + NS.money(t.subtotal) + '</dd></div>' +
      '<div class="discount"><dt>Discount' + (t.coupon ? ' (' + NS.esc(t.coupon) + ')' : '') + '</dt><dd>' + (t.discount ? '-' + NS.money(t.discount) : NS.money(0)) + '</dd></div>' +
      '<div><dt>Shipping</dt><dd>' + (t.shipping ? NS.money(t.shipping) : 'Free') + '</dd></div>' +
      '<div class="grand"><dt>Total</dt><dd>' + NS.money(t.total) + '</dd></div></dl>';
  }

  function field(id, label, type, validate, extra) {
    return '<div class="field' + ((extra && extra.wide) ? ' field-wide' : '') + '"><label for="' + id + '">' + label + '</label>' +
      '<input id="' + id + '" name="' + id + '" type="' + type + '" data-validate="' + validate + '" data-label="' + label + '" autocomplete="' + ((extra && extra.auto) || 'off') + '"' + ((extra && extra.mode) ? ' inputmode="' + extra.mode + '"' : '') + ' aria-describedby="' + id + '-error" aria-invalid="false" required>' +
      '<p class="field-error" id="' + id + '-error" role="alert"></p></div>';
  }

  function renderForm() {
    var cart = NS.getCart();
    var t = NS.totals(cart, NS.getCoupon());
    root.innerHTML =
      '<div class="demo-banner" role="note">' + NS.icon('info') + '<p><strong>Demo checkout.</strong> Nothing here is sent to a server and no real payment details are collected.</p></div>' +
      '<div class="checkout-layout"><form id="checkout-form" novalidate aria-label="Checkout form">' +
      '<fieldset class="panel"><legend>Contact and shipping</legend><div class="form-grid">' +
      field('fullName', 'Full name', 'text', 'required min:2', { auto: 'name', wide: true }) +
      field('email', 'Email address', 'email', 'required email', { auto: 'email' }) +
      field('phone', 'Phone number', 'tel', 'required phone', { auto: 'tel', mode: 'tel' }) +
      field('address', 'Shipping address', 'text', 'required min:5', { auto: 'street-address', wide: true }) +
      field('city', 'City', 'text', 'required min:2', { auto: 'address-level2' }) +
      field('postal', 'Postal code', 'text', 'required postal', { auto: 'postal-code' }) +
      '</div></fieldset>' +
      '<fieldset class="panel"><legend>Payment method</legend><div class="pay-options">' +
      payOption('card', 'Credit or debit card', 'card', true) +
      payOption('wallet', 'Digital wallet', 'shield', false) +
      payOption('cod', 'Cash on delivery', 'truck', false) + '</div>' +
      '<p class="demo-note">' + NS.icon('info') + 'Demo only. Choosing a method does not collect card numbers or process a payment.</p></fieldset>' +
      '<button class="btn btn-primary btn-lg btn-block" type="submit">Place demo order · ' + NS.money(t.total) + '</button><p class="form-msg" id="checkout-status" role="status" hidden></p></form>' +
      '<aside class="summary" aria-labelledby="co-summary"><h2 id="co-summary">Order summary</h2>' + summaryHTML(cart, t) + '<a class="link-arrow" href="cart.html">Edit cart</a></aside></div>';

    var form = NS.$('#checkout-form');
    NS.liveValidate(form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = NS.$('#checkout-status');
      if (!NS.validateForm(form)) {
        NS.formMessage(status, 'Please fix the highlighted fields to place your demo order.', 'error');
        return;
      }
      var name = form.fullName.value.trim();
      var method = NS.$('input[name="payment"]:checked').nextElementSibling.textContent;
      var ref = 'NS-' + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).slice(2, 5).toUpperCase();
      var order = { ref: ref, items: cart, totals: t, method: method, placed: new Date().toISOString() };
      try { sessionStorage.setItem(ORDER_KEY, JSON.stringify(order)); } catch (err) { /* ignore */ }
      justPlaced = true;
      NS.clearCart();
      renderConfirmation(order, name);
      window.scrollTo({ top: 0 });
    });
  }

  function payOption(value, label, ic, checked) {
    return '<label class="pay-option"><input type="radio" name="payment" value="' + value + '"' + (checked ? ' checked' : '') + '><span>' + NS.icon(ic) + label + '</span></label>';
  }

  function renderConfirmation(order, name) {
    var date = new Date(order.placed).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    root.innerHTML = '<div class="confirmation"><div class="check-badge">' + NS.icon('check') + '</div>' +
      '<h2>' + (name ? 'Thank you, ' + NS.esc(name.split(' ')[0]) + '!' : 'Thank you!') + ' Your demo order is confirmed</h2>' +
      '<p class="muted">Order reference <strong class="ref">' + NS.esc(order.ref) + '</strong> &middot; ' + NS.esc(date) + ' &middot; ' + NS.esc(order.method) + '</p>' +
      '<div class="demo-banner" role="note">' + NS.icon('info') + '<p>This is a frontend demonstration. No order was submitted to a server, no payment was taken and nothing will be shipped.</p></div>' +
      '<div class="panel">' + summaryHTML(order.items, order.totals) + '</div>' +
      '<div class="cart-actions"><a class="btn btn-primary" href="shop.html">Continue shopping</a><a class="btn btn-outline" href="index.html">Back to home</a></div></div>';
  }

  function renderEmpty() {
    root.innerHTML = '<div class="state-card"><img src="assets/images/empty-cart.svg" alt="" width="220" height="183"><h2>Nothing to check out yet</h2><p>Your cart is empty. Add something first and come back here.</p><a class="btn btn-primary" href="shop.html">Browse products</a></div>';
  }

  /* Initial view */
  if (NS.getCart().length) {
    renderForm();
  } else {
    var saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(ORDER_KEY)); } catch (e) { /* ignore */ }
    if (saved && saved.ref && Array.isArray(saved.items) && saved.totals) renderConfirmation(saved, '');
    else renderEmpty();
  }

  /* If the cart is emptied in another tab, avoid a stale form. */
  document.addEventListener('novashop:change', function () {
    if (!justPlaced && !NS.getCart().length && NS.$('#checkout-form')) renderEmpty();
  });
})();
