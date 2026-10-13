/* Wishlist page: view, remove, move to cart. */
(function () {
  'use strict';
  var NS = window.NovaShop;
  var root = NS.$('#wishlist-root');
  if (!root) return;

  function render() {
    var ids = NS.getWishlist();
    if (!ids.length) {
      root.innerHTML = '<div class="state-card"><img src="assets/images/empty-wishlist.svg" alt="" width="220" height="183"><h2>Your wishlist is empty</h2><p>Tap the heart on any product to save it here for later.</p><a class="btn btn-primary" href="shop.html">Discover products</a></div>';
      return;
    }
    root.innerHTML = '<p class="muted" aria-live="polite">' + ids.length + (ids.length === 1 ? ' saved item' : ' saved items') + '</p><ul class="wish-grid">' + ids.map(function (id) {
      var p = NS.getProduct(id);
      var out = p.stock === 'out';
      var needsSize = p.sizes.length > 0;
      var move = out ? '<button class="btn btn-ghost btn-block" type="button" disabled>Out of stock</button>'
        : needsSize ? '<a class="btn btn-outline btn-block" href="product.html?id=' + p.id + '">Choose size</a>'
        : '<button class="btn btn-primary btn-block" type="button" data-move="' + p.id + '">' + NS.icon('cart') + 'Move to cart</button>';
      return '<li class="wish-card"><a class="wc-img" href="product.html?id=' + p.id + '"><img src="' + NS.esc(p.images[0]) + '" alt="' + NS.esc(p.name) + '" width="300" height="300" loading="lazy"></a>' +
        '<div class="pc-body"><p class="pc-cat">' + NS.esc(p.category) + '</p><h2 class="pc-title"><a href="product.html?id=' + p.id + '">' + NS.esc(p.name) + '</a></h2>' +
        '<div class="pc-price">' + NS.priceHTML(p) + '</div><p class="stock stock-' + NS.STOCK[p.stock].cls + '">' + NS.STOCK[p.stock].label + '</p>' +
        move + '<button class="link-btn" type="button" data-remove="' + p.id + '" aria-label="Remove ' + NS.esc(p.name) + ' from wishlist">' + NS.icon('trash') + 'Remove</button></div></li>';
    }).join('') + '</ul>';
  }

  root.addEventListener('click', function (e) {
    var mv = e.target.closest('[data-move]');
    var rm = e.target.closest('[data-remove]');
    if (mv) {
      var p = NS.getProduct(mv.dataset.move);
      if (p && NS.addToCart(p.id, 1, { color: p.colors[0] || '' })) {
        NS.removeFromWishlist(p.id);
        NS.toast(p.name + ' moved to your cart');
      }
    } else if (rm) {
      NS.removeFromWishlist(rm.dataset.remove);
      NS.toast('Removed from your wishlist');
    }
  });

  document.addEventListener('novashop:change', render);
  render();
})();
