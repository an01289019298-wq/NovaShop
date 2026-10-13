/* Product details page: loads a product by ?id= and wires gallery, options, tabs, related items. */
(function () {
  'use strict';
  var NS = window.NovaShop;
  var root = NS.$('#product-root');
  if (!root) return;

  var id = new URLSearchParams(location.search).get('id');
  var p = NS.getProduct(id);

  if (!p) {
    document.title = 'Product not found | NovaShop';
    root.innerHTML = '<div class="state-card"><h1>We couldn\'t find that product</h1><p>The link may be outdated or the product ID is invalid. Browse the full collection instead.</p><a class="btn btn-primary" href="shop.html">Browse all products</a></div>';
    return;
  }

  document.title = p.name + ' | NovaShop';
  var meta = NS.$('meta[name="description"]');
  if (meta) meta.setAttribute('content', p.description.slice(0, 155));

  var out = p.stock === 'out';
  var sel = { color: p.colors[0] || '', size: '', qty: 1 };
  var wished = NS.isWished(p.id);

  var thumbs = p.images.map(function (src, i) {
    return '<button class="thumb' + (i === 0 ? ' is-active' : '') + '" type="button" data-index="' + i + '" aria-label="Show image ' + (i + 1) + ' of ' + p.images.length + '" aria-pressed="' + (i === 0) + '"><img src="' + NS.esc(src) + '" alt="" width="96" height="96" loading="lazy"></button>';
  }).join('');

  var colors = p.colors.length > 1 ? '<fieldset class="option-group"><legend>Color: <strong id="color-label">' + NS.esc(sel.color) + '</strong></legend><div class="chips">' +
    p.colors.map(function (c, i) {
      return '<label class="chip"><input type="radio" name="color" value="' + NS.esc(c) + '"' + (i === 0 ? ' checked' : '') + '><span>' + NS.esc(c) + '</span></label>';
    }).join('') + '</div></fieldset>' : '';

  var sizes = p.sizes.length ? '<fieldset class="option-group"><legend>Size</legend><div class="chips">' +
    p.sizes.map(function (s) {
      return '<label class="chip"><input type="radio" name="size" value="' + NS.esc(s) + '"><span>' + NS.esc(s) + '</span></label>';
    }).join('') + '</div><p class="field-error" id="size-error" role="alert"></p></fieldset>' : '';

  var rating = p.rating;
  var bars = [5, 4, 3, 2, 1].map(function (n) {
    var share = Math.max(2, Math.round(100 - Math.abs(rating - n) * 38));
    return '<li><span>' + n + ' star</span><span class="bar"><span style="width:' + share + '%"></span></span></li>';
  }).join('');

  root.innerHTML =
    '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><a href="shop.html">Shop</a><span aria-hidden="true">/</span><a href="shop.html?category=' + encodeURIComponent(p.category) + '">' + NS.esc(p.category) + '</a></nav>' +
    '<div class="product-layout">' +
    '<div class="gallery"><div class="gallery-main"><img id="main-image" src="' + NS.esc(p.images[0]) + '" alt="' + NS.esc(p.name) + '" width="800" height="800">' + (NS.discountPct(p) ? '<span class="badge badge-sale">-' + NS.discountPct(p) + '%</span>' : '') + '</div><div class="thumbs" role="group" aria-label="Product images">' + thumbs + '</div></div>' +
    '<div class="product-info">' +
    '<p class="pc-cat">' + NS.esc(p.category) + '</p><h1>' + NS.esc(p.name) + '</h1>' +
    '<div class="pc-rating">' + NS.starsHTML(p.rating) + '<span>' + p.rating.toFixed(1) + ' &middot; ' + p.reviews + ' sample reviews</span></div>' +
    '<div class="pd-price">' + NS.priceHTML(p) + '</div>' +
    '<p class="stock stock-' + NS.STOCK[p.stock].cls + '">' + NS.STOCK[p.stock].label + '</p>' +
    '<p class="pd-desc">' + NS.esc(p.description) + '</p>' +
    '<form id="buy-form" novalidate>' + colors + sizes +
    '<div class="buy-row"><div class="qty" role="group" aria-label="Quantity"><button type="button" data-qty="-1" aria-label="Decrease quantity">' + NS.icon('minus') + '</button><output id="qty-value" aria-live="polite">1</output><button type="button" data-qty="1" aria-label="Increase quantity">' + NS.icon('plus') + '</button></div>' +
    '<button class="btn btn-primary btn-lg" type="submit"' + (out ? ' disabled' : '') + '>' + NS.icon('cart') + (out ? 'Out of stock' : 'Add to cart') + '</button>' +
    '<button class="btn btn-outline btn-lg wish-btn' + (wished ? ' is-active' : '') + '" type="button" data-action="wishlist" data-id="' + p.id + '" aria-pressed="' + wished + '">' + NS.icon('heart') + '<span data-wish-label>' + (wished ? 'Saved to wishlist' : 'Add to wishlist') + '</span></button></div></form>' +
    '<ul class="perks"><li>' + NS.icon('truck') + 'Free shipping on orders over $100</li><li>' + NS.icon('refresh') + '30-day returns (demo policy)</li><li>' + NS.icon('shield') + '2-year warranty (demo policy)</li></ul>' +
    '<p class="demo-note">' + NS.icon('info') + 'Demo product: price, rating and reviews are sample data.</p></div></div>' +
    '<section class="tabs" aria-label="Product information"><div class="tablist" role="tablist">' +
    '<button role="tab" id="tab-desc" aria-controls="panel-desc" aria-selected="true" type="button">Description</button>' +
    '<button role="tab" id="tab-details" aria-controls="panel-details" aria-selected="false" tabindex="-1" type="button">Details</button>' +
    '<button role="tab" id="tab-reviews" aria-controls="panel-reviews" aria-selected="false" tabindex="-1" type="button">Reviews</button></div>' +
    '<div role="tabpanel" id="panel-desc" aria-labelledby="tab-desc" class="tabpanel"><p>' + NS.esc(p.description) + '</p><p>Every NovaShop demo product ships with free standard returns in this fictional store policy, so you can browse with confidence.</p></div>' +
    '<div role="tabpanel" id="panel-details" aria-labelledby="tab-details" class="tabpanel" hidden><ul class="spec-list">' + p.details.map(function (d) { return '<li>' + NS.icon('check') + NS.esc(d) + '</li>'; }).join('') + '</ul></div>' +
    '<div role="tabpanel" id="panel-reviews" aria-labelledby="tab-reviews" class="tabpanel" hidden><div class="review-summary"><div class="review-score"><strong>' + p.rating.toFixed(1) + '</strong>' + NS.starsHTML(p.rating) + '<small>' + p.reviews + ' sample reviews</small></div><ul class="review-bars">' + bars + '</ul></div><p class="demo-note">' + NS.icon('info') + 'Reviews are illustrative sample content for this demo store.</p></div></section>' +
    '<section class="section related" aria-labelledby="related-title"><div class="section-head"><h2 id="related-title">You may also like</h2><a class="link-arrow" href="shop.html">View all</a></div><div class="product-grid" id="related-grid"></div></section>';

  /* Related: same category first, then fill with other products. */
  var related = window.PRODUCTS.filter(function (x) { return x.id !== p.id && x.category === p.category; });
  window.PRODUCTS.filter(function (x) { return x.id !== p.id && x.category !== p.category; })
    .sort(function (a, b) { return b.rating - a.rating; })
    .forEach(function (x) { if (related.length < 4) related.push(x); });
  NS.$('#related-grid').innerHTML = related.slice(0, 4).map(NS.productCard).join('');

  /* Gallery */
  var main = NS.$('#main-image');
  NS.$$('.thumb').forEach(function (btn) {
    btn.addEventListener('click', function () {
      main.src = p.images[Number(btn.dataset.index)];
      main.dataset.fallback = '';
      NS.$$('.thumb').forEach(function (t) { t.classList.toggle('is-active', t === btn); t.setAttribute('aria-pressed', t === btn); });
    });
  });

  /* Options + quantity */
  var form = NS.$('#buy-form');
  form.addEventListener('change', function (e) {
    if (e.target.name === 'color') { sel.color = e.target.value; NS.$('#color-label').textContent = sel.color; }
    if (e.target.name === 'size') { sel.size = e.target.value; NS.$('#size-error').textContent = ''; }
  });
  form.addEventListener('click', function (e) {
    var b = e.target.closest('[data-qty]');
    if (!b) return;
    sel.qty = Math.max(1, Math.min(NS.MAX_QTY, sel.qty + Number(b.dataset.qty)));
    NS.$('#qty-value').textContent = sel.qty;
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (out) return;
    if (p.sizes.length && !sel.size) {
      NS.$('#size-error').textContent = 'Select a size to continue.';
      NS.$('input[name="size"]').focus();
      return;
    }
    NS.addToCart(p.id, sel.qty, { color: sel.color, size: sel.size });
    NS.toast(sel.qty + ' × ' + p.name + ' added to your cart');
  });

  /* Tabs with arrow-key support */
  var tabs = NS.$$('[role="tab"]');
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') selectTab(tabs[(i + 1) % tabs.length]);
      if (e.key === 'ArrowLeft') selectTab(tabs[(i - 1 + tabs.length) % tabs.length]);
    });
  });
})();
