/* Cart page: quantities, removal, coupon, totals. Data lives in localStorage. */
(function () {
  'use strict';
  var NS = window.NovaShop;
  var root = NS.$('#cart-root');
  if (!root) return;
  var couponMsg = '';
  var couponType = '';

  function itemRow(i) {
    var p = NS.getProduct(i.id);
    var key = NS.cartKey(i);
    var opts = [i.color, i.size ? 'Size ' + i.size : ''].filter(Boolean).join(' · ');
    return '<li class="cart-item" data-key="' + NS.esc(key) + '">' +
      '<a class="ci-img" href="product.html?id=' + p.id + '"><img src="' + NS.esc(p.images[0]) + '" alt="' + NS.esc(p.name) + '" width="120" height="120" loading="lazy"></a>' +
      '<div class="ci-main"><h2 class="ci-title"><a href="product.html?id=' + p.id + '">' + NS.esc(p.name) + '</a></h2>' +
      (opts ? '<p class="ci-opts">' + NS.esc(opts) + '</p>' : '') +
      '<p class="ci-unit">' + NS.money(p.price) + ' each</p>' +
      '<button class="link-btn" type="button" data-remove aria-label="Remove ' + NS.esc(p.name) + ' from cart">' + NS.icon('trash') + 'Remove</button></div>' +
      '<div class="qty" role="group" aria-label="Quantity for ' + NS.esc(p.name) + '"><button type="button" data-step="-1" aria-label="Decrease quantity"' + (i.qty <= 1 ? ' disabled' : '') + '>' + NS.icon('minus') + '</button><output>' + i.qty + '</output><button type="button" data-step="1" aria-label="Increase quantity"' + (i.qty >= NS.MAX_QTY ? ' disabled' : '') + '>' + NS.icon('plus') + '</button></div>' +
      '<p class="ci-total">' + NS.money(p.price * i.qty) + '</p></li>';
  }

  function render() {
    var cart = NS.getCart();
    if (!cart.length) {
      root.innerHTML = '<div class="state-card"><img src="assets/images/empty-cart.svg" alt="" width="220" height="183"><h2>Your cart is empty</h2><p>Add a few things you like and they will show up here. Your cart is saved in this browser.</p><a class="btn btn-primary" href="shop.html">Start shopping</a></div>';
      return;
    }
    var t = NS.totals(cart, NS.getCoupon());
    var toFree = Math.max(0, NS.FREE_SHIPPING_FROM - (t.subtotal - t.discount));
    var progress = Math.min(100, Math.round((t.subtotal - t.discount) / NS.FREE_SHIPPING_FROM * 100));
    root.innerHTML =
      '<div class="cart-layout"><section aria-labelledby="items-title"><h2 class="sr-only" id="items-title">Items in your cart</h2><ul class="cart-list">' + cart.map(itemRow).join('') + '</ul>' +
      '<div class="cart-actions"><a class="btn btn-outline" href="shop.html">Continue shopping</a><button class="btn btn-ghost" type="button" id="clear-cart">Clear cart</button></div></section>' +
      '<aside class="summary" aria-labelledby="summary-title"><h2 id="summary-title">Order summary</h2>' +
      '<div class="ship-progress"><p>' + (toFree > 0 ? 'Add <strong>' + NS.money(toFree) + '</strong> more for free shipping' : 'You have unlocked <strong>free shipping</strong>') + '</p><div class="bar"><span style="width:' + progress + '%"></span></div></div>' +
      '<form id="coupon-form" class="coupon" novalidate><label for="coupon-input">Discount code</label><div class="coupon-row"><input id="coupon-input" type="text" placeholder="Try NOVA10" autocomplete="off" maxlength="20" value="' + NS.esc(t.coupon || '') + '"' + (t.coupon ? ' readonly' : '') + '>' +
      (t.coupon ? '<button class="btn btn-outline" type="button" id="remove-coupon">Remove</button>' : '<button class="btn btn-dark" type="submit">Apply</button>') + '</div><p class="coupon-msg ' + couponType + '" id="coupon-msg" role="status">' + NS.esc(t.coupon ? 'Code ' + t.coupon + ' applied: ' + t.couponLabel + '.' : couponMsg) + '</p></form>' +
      '<dl class="totals"><div><dt>Subtotal (' + t.count + (t.count === 1 ? ' item' : ' items') + ')</dt><dd>' + NS.money(t.subtotal) + '</dd></div>' +
      (t.discount ? '<div class="discount"><dt>Discount</dt><dd>-' + NS.money(t.discount) + '</dd></div>' : '') +
      '<div><dt>Shipping (simulated)</dt><dd>' + (t.shipping ? NS.money(t.shipping) : 'Free') + '</dd></div>' +
      '<div class="grand"><dt>Total</dt><dd>' + NS.money(t.total) + '</dd></div></dl>' +
      '<a class="btn btn-primary btn-lg btn-block" href="checkout.html">Proceed to checkout</a>' +
      '<p class="demo-note">' + NS.icon('info') + 'Demo store: no payment is taken and no order is placed.</p></aside></div>';
  }

  root.addEventListener('click', function (e) {
    var row = e.target.closest('.cart-item');
    if (row) {
      var key = row.dataset.key;
      var item = NS.getCart().filter(function (i) { return NS.cartKey(i) === key; })[0];
      if (e.target.closest('[data-remove]')) {
        NS.removeFromCart(key);
        NS.toast('Item removed from your cart');
      } else if (e.target.closest('[data-step]') && item) {
        NS.setCartQty(key, item.qty + Number(e.target.closest('[data-step]').dataset.step));
      }
      return;
    }
    if (e.target.closest('#clear-cart')) { NS.clearCart(); NS.toast('Cart cleared'); }
    if (e.target.closest('#remove-coupon')) { couponMsg = ''; couponType = ''; NS.setCoupon(null); NS.toast('Discount code removed'); }
  });

  root.addEventListener('submit', function (e) {
    if (e.target.id !== 'coupon-form') return;
    e.preventDefault();
    var code = NS.$('#coupon-input').value.trim().toUpperCase();
    if (!code) { couponMsg = 'Enter a discount code to apply it.'; couponType = 'error'; render(); return; }
    if (NS.COUPONS[code]) {
      couponMsg = ''; couponType = 'success';
      NS.setCoupon(code);
      NS.toast('Code ' + code + ' applied');
    } else {
      couponMsg = '"' + code + '" is not a valid demo code. Try NOVA10 or WELCOME20.'; couponType = 'error';
      render();
      NS.$('#coupon-input').focus();
    }
  });

  document.addEventListener('novashop:change', render);
  render();
})();
