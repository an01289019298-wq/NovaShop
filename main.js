/* NovaShop shared logic: storage, cart/wishlist API, layout, UI helpers, home page, forms. */
(function () {
  'use strict';

  /* ---------- Config ---------- */
  var KEYS = { cart: 'novashop_cart', wish: 'novashop_wishlist', coupon: 'novashop_coupon', theme: 'novashop_theme', order: 'novashop_last_order' };
  var COUPONS = { NOVA10: { pct: 10, label: '10% off' }, WELCOME20: { pct: 20, label: '20% off' } };
  var FREE_SHIPPING_FROM = 100;
  var SHIPPING_FEE = 9.99;
  var MAX_QTY = 10;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ---------- Utilities ---------- */
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  function money(n) { return currency.format(Number(n) || 0); }
  function round2(n) { return Math.round(n * 100) / 100; }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  var ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
    cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    truck: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    refresh: '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.8-3.4L23 10M1 14l4.7 4.4A9 9 0 0 0 20.5 15"/>',
    headset: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-7h3zM3 19a2 2 0 0 0 2 2h1v-7H3z"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    x: '<path d="M4 4l16 16M20 4 4 20"/>',
    youtube: '<path d="M22.5 7.2a3 3 0 0 0-2.1-2.1C18.5 4.6 12 4.6 12 4.6s-6.5 0-8.4.5A3 3 0 0 0 1.5 7.2 31 31 0 0 0 1 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.4.5 8.4.5s6.5 0 8.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23 12a31 31 0 0 0-.5-4.8z"/><path d="m10 15 5-3-5-3z"/>'
  };
  function icon(name, cls) {
    return '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONS[name] || '') + '</svg>';
  }

  /* ---------- Safe storage ---------- */
  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
  }
  function emitChange() {
    document.dispatchEvent(new CustomEvent('novashop:change'));
  }

  /* ---------- Products ---------- */
  function getProduct(id) {
    var n = Number(id);
    if (!Number.isInteger(n)) return null;
    return (window.PRODUCTS || []).filter(function (p) { return p.id === n; })[0] || null;
  }
  function discountPct(p) {
    return p.originalPrice && p.originalPrice > p.price ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
  }
  var STOCK = {
    in: { label: 'In stock', cls: 'in' },
    low: { label: 'Only a few left', cls: 'low' },
    out: { label: 'Out of stock', cls: 'out' }
  };
  function newestIds() {
    return (window.PRODUCTS || []).slice().sort(function (a, b) { return b.dateAdded.localeCompare(a.dateAdded); }).slice(0, 6).map(function (p) { return p.id; });
  }
  function starsHTML(rating) {
    var pct = Math.max(0, Math.min(5, rating)) / 5 * 100;
    return '<span class="stars" role="img" aria-label="Rated ' + esc(rating) + ' out of 5"><span class="stars-fill" style="width:' + pct + '%" aria-hidden="true">★★★★★</span><span class="stars-base" aria-hidden="true">★★★★★</span></span>';
  }
  function priceHTML(p) {
    var off = discountPct(p);
    return '<span class="price">' + money(p.price) + '</span>' +
      (off ? ' <del class="price-old">' + money(p.originalPrice) + '</del> <span class="price-off">Save ' + off + '%</span>' : '');
  }
  function placeholderImage(label) {
    var text = esc((label || 'NovaShop').slice(0, 24));
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ede9fe"/><stop offset="1" stop-color="#dbeafe"/></linearGradient></defs><rect width="800" height="800" fill="url(#g)"/><g fill="none" stroke="#7c3aed" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"><rect x="300" y="290" width="200" height="170" rx="24"/><path d="M345 290v-30a55 55 0 0 1 110 0v30"/></g><text x="400" y="560" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" fill="#4c1d95">' + text + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  /* Graceful image failures: swap in a branded placeholder once. */
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (img && img.tagName === 'IMG' && !img.dataset.fallback) {
      img.dataset.fallback = '1';
      img.src = placeholderImage(img.alt);
    }
  }, true);

  /* Images that failed before this script ran (static HTML images) never fire a catchable error. */
  function fixBrokenImages() {
    $$('img').forEach(function (img) {
      if (img.complete && img.naturalWidth === 0 && !img.dataset.fallback) {
        img.dataset.fallback = '1';
        img.src = placeholderImage(img.alt);
      }
    });
  }

  function productCard(p, opts) {
    opts = opts || {};
    var out = p.stock === 'out';
    var wished = isWished(p.id);
    var off = discountPct(p);
    var isNew = newestIds().indexOf(p.id) !== -1;
    var badges = '';
    if (off) badges += '<span class="badge badge-sale">-' + off + '%</span>';
    if (isNew) badges += '<span class="badge badge-new">New</span>';
    var needsOptions = p.sizes && p.sizes.length;
    var action = out
      ? '<button class="btn btn-block btn-ghost" type="button" disabled>Out of stock</button>'
      : needsOptions
        ? '<a class="btn btn-block btn-outline" href="product.html?id=' + p.id + '">Choose size</a>'
        : '<button class="btn btn-block btn-primary" type="button" data-action="add-cart" data-id="' + p.id + '">' + icon('cart') + 'Add to cart</button>';
    return '<article class="product-card' + (out ? ' is-out' : '') + '" data-id="' + p.id + '">' +
      '<div class="pc-media"><a href="product.html?id=' + p.id + '" tabindex="-1" aria-hidden="true"><img src="' + esc(p.images[0]) + '" alt="' + esc(p.name) + '" width="400" height="400" loading="lazy"></a>' +
      '<div class="pc-badges">' + badges + '</div>' +
      '<button class="pc-wish' + (wished ? ' is-active' : '') + '" type="button" data-action="wishlist" data-id="' + p.id + '" aria-pressed="' + wished + '" aria-label="' + (wished ? 'Remove ' : 'Add ') + esc(p.name) + (wished ? ' from wishlist' : ' to wishlist') + '">' + icon('heart') + '</button></div>' +
      '<div class="pc-body"><p class="pc-cat">' + esc(p.category) + '</p>' +
      '<h3 class="pc-title"><a href="product.html?id=' + p.id + '">' + esc(p.name) + '</a></h3>' +
      '<div class="pc-rating">' + starsHTML(p.rating) + '<span class="pc-reviews">(' + p.reviews + ')</span></div>' +
      '<div class="pc-price">' + priceHTML(p) + '</div>' +
      '<p class="stock stock-' + STOCK[p.stock].cls + '">' + STOCK[p.stock].label + '</p>' +
      action + '</div></article>';
  }

  /* ---------- Cart ---------- */
  function cartKey(item) { return item.id + '|' + (item.color || '') + '|' + (item.size || ''); }
  function getCart() {
    var raw = readJSON(KEYS.cart, []);
    if (!Array.isArray(raw)) return [];
    return raw.filter(function (i) {
      return i && getProduct(i.id) && Number.isInteger(i.qty) && i.qty > 0;
    }).map(function (i) {
      return { id: Number(i.id), qty: Math.min(i.qty, MAX_QTY), color: String(i.color || ''), size: String(i.size || '') };
    });
  }
  function saveCart(cart) { writeJSON(KEYS.cart, cart); emitChange(); }
  function addToCart(id, qty, opts) {
    var p = getProduct(id);
    if (!p || p.stock === 'out') return false;
    opts = opts || {};
    var item = { id: p.id, qty: Math.max(1, Math.min(MAX_QTY, parseInt(qty, 10) || 1)), color: opts.color || '', size: opts.size || '' };
    var cart = getCart();
    var existing = cart.filter(function (i) { return cartKey(i) === cartKey(item); })[0];
    if (existing) existing.qty = Math.min(MAX_QTY, existing.qty + item.qty); else cart.push(item);
    saveCart(cart);
    return true;
  }
  function setCartQty(key, qty) {
    var cart = getCart();
    cart.forEach(function (i) { if (cartKey(i) === key) i.qty = Math.max(1, Math.min(MAX_QTY, qty)); });
    saveCart(cart);
  }
  function removeFromCart(key) {
    saveCart(getCart().filter(function (i) { return cartKey(i) !== key; }));
  }
  function clearCart() { saveCart([]); setCoupon(null); }

  function getCoupon() {
    var code = readJSON(KEYS.coupon, null);
    return typeof code === 'string' && COUPONS[code] ? code : null;
  }
  function setCoupon(code) {
    try { if (code) localStorage.setItem(KEYS.coupon, JSON.stringify(code)); else localStorage.removeItem(KEYS.coupon); } catch (e) { /* ignore */ }
    emitChange();
  }
  function totals(cart, couponCode) {
    var subtotal = 0, count = 0;
    cart.forEach(function (i) { var p = getProduct(i.id); if (p) { subtotal += p.price * i.qty; count += i.qty; } });
    subtotal = round2(subtotal);
    var c = COUPONS[couponCode];
    var discount = c ? round2(subtotal * c.pct / 100) : 0;
    var after = subtotal - discount;
    var shipping = subtotal === 0 ? 0 : (after >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE);
    return { subtotal: subtotal, discount: discount, shipping: shipping, total: round2(after + shipping), count: count, coupon: c ? couponCode : null, couponLabel: c ? c.label : '' };
  }

  /* ---------- Wishlist ---------- */
  function getWishlist() {
    var raw = readJSON(KEYS.wish, []);
    if (!Array.isArray(raw)) return [];
    var seen = {};
    return raw.map(Number).filter(function (id) {
      if (!getProduct(id) || seen[id]) return false;
      seen[id] = true; return true;
    });
  }
  function isWished(id) { return getWishlist().indexOf(Number(id)) !== -1; }
  function setWishlist(list) { writeJSON(KEYS.wish, list); emitChange(); }
  function toggleWishlist(id) {
    var list = getWishlist(), n = Number(id), i = list.indexOf(n);
    if (i === -1) list.push(n); else list.splice(i, 1);
    setWishlist(list);
    return i === -1;
  }
  function removeFromWishlist(id) {
    setWishlist(getWishlist().filter(function (x) { return x !== Number(id); }));
  }

  /* ---------- Toasts ---------- */
  function toast(message, type) {
    var host = $('#toast-region');
    if (!host) return;
    var el = document.createElement('div');
    el.className = 'toast toast-' + (type || 'success');
    el.innerHTML = icon(type === 'error' ? 'info' : 'check') + '<span>' + esc(message) + '</span>';
    host.appendChild(el);
    while (host.children.length > 3) host.removeChild(host.firstChild);
    setTimeout(function () { el.classList.add('is-leaving'); setTimeout(function () { el.remove(); }, 300); }, 2800);
  }

  /* ---------- Counters & button state ---------- */
  function refreshUI() {
    var cartCount = getCart().reduce(function (s, i) { return s + i.qty; }, 0);
    var wishCount = getWishlist().length;
    $$('[data-cart-count]').forEach(function (el) { el.textContent = cartCount; el.hidden = cartCount === 0; });
    $$('[data-wish-count]').forEach(function (el) { el.textContent = wishCount; el.hidden = wishCount === 0; });
    $$('[data-action="wishlist"]').forEach(function (btn) {
      var on = isWished(btn.dataset.id);
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on);
      var p = getProduct(btn.dataset.id);
      if (p && btn.classList.contains('pc-wish')) btn.setAttribute('aria-label', (on ? 'Remove ' : 'Add ') + p.name + (on ? ' from wishlist' : ' to wishlist'));
      var label = btn.querySelector('[data-wish-label]');
      if (label) label.textContent = on ? 'Saved to wishlist' : 'Add to wishlist';
    });
  }

  /* ---------- Layout (shared header, footer) ---------- */
  var PAGE = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  function navLink(href, label, pages) {
    var active = pages.indexOf(PAGE) !== -1;
    return '<li><a href="' + href + '"' + (active ? ' class="is-active" aria-current="page"' : '') + '>' + label + '</a></li>';
  }
  var LOGO = '<svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#2563eb"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#lg)"/><path d="M20 46V18l24 28V18" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function renderLayout() {
    var header = $('#site-header');
    if (header) {
      var q = new URLSearchParams(location.search).get('q') || '';
      header.innerHTML =
        '<a class="skip-link" href="#main">Skip to main content</a>' +
        '<div class="announcement"><p>Free shipping over $100 &middot; Use code <strong>NOVA10</strong> for 10% off your demo order</p></div>' +
        '<div class="nav-bar"><div class="container nav-inner">' +
        '<a class="logo" href="index.html" aria-label="NovaShop home">' + LOGO + '<span>NovaShop</span></a>' +
        '<nav class="primary-nav" id="primary-nav" aria-label="Primary"><ul>' +
        navLink('index.html', 'Home', ['index.html', '']) +
        navLink('shop.html', 'Shop', ['shop.html', 'product.html']) +
        navLink('index.html#categories', 'Categories', []) +
        navLink('about.html', 'About', ['about.html']) +
        navLink('contact.html', 'Contact', ['contact.html']) +
        '</ul></nav>' +
        '<form class="search" role="search" action="shop.html" method="get">' +
        '<label class="sr-only" for="site-search">Search products</label>' +
        '<input id="site-search" name="q" type="search" placeholder="Search products" autocomplete="off" value="' + esc(q) + '">' +
        '<button type="submit" aria-label="Search">' + icon('search') + '</button></form>' +
        '<div class="nav-actions">' +
        '<button class="icon-btn" type="button" id="theme-toggle" aria-label="Switch to dark mode">' + icon('moon') + '</button>' +
        '<a class="icon-btn" href="wishlist.html" aria-label="Wishlist">' + icon('heart') + '<span class="count" data-wish-count hidden>0</span></a>' +
        '<a class="icon-btn" href="cart.html" aria-label="Shopping cart">' + icon('cart') + '<span class="count" data-cart-count hidden>0</span></a>' +
        '<button class="icon-btn nav-toggle" type="button" id="nav-toggle" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu">' + icon('menu') + '</button>' +
        '</div></div></div>';
    }
    var footer = $('#site-footer');
    if (footer) {
      var cats = (window.CATEGORIES || []).slice(0, 5).map(function (c) {
        return '<li><a href="shop.html?category=' + encodeURIComponent(c.id) + '">' + esc(c.id) + '</a></li>';
      }).join('');
      footer.innerHTML =
        '<div class="container footer-grid">' +
        '<div class="footer-brand"><a class="logo" href="index.html" aria-label="NovaShop home">' + LOGO + '<span>NovaShop</span></a>' +
        '<p>Thoughtfully chosen tech, fashion and everyday gear. NovaShop is a frontend portfolio demo: products, prices and reviews are sample data.</p>' +
        '<ul class="social" aria-label="Social media">' +
        '<li><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram (opens in a new tab)">' + icon('instagram') + '</a></li>' +
        '<li><a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X (opens in a new tab)">' + icon('x') + '</a></li>' +
        '<li><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook (opens in a new tab)">' + icon('facebook') + '</a></li>' +
        '<li><a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube (opens in a new tab)">' + icon('youtube') + '</a></li></ul></div>' +
        '<div><h2 class="footer-title">Shop</h2><ul class="footer-links">' + cats + '<li><a href="shop.html">All products</a></li></ul></div>' +
        '<div><h2 class="footer-title">Company</h2><ul class="footer-links"><li><a href="about.html">About us</a></li><li><a href="contact.html">Contact</a></li><li><a href="wishlist.html">Wishlist</a></li><li><a href="cart.html">Cart</a></li></ul></div>' +
        '<div><h2 class="footer-title">Get in touch</h2><ul class="footer-contact">' +
        '<li>' + icon('mail') + '<a href="mailto:hello@novashop.example">hello@novashop.example</a></li>' +
        '<li>' + icon('phone') + '<a href="tel:+15550100199">+1 (555) 010-0199</a></li>' +
        '<li>' + icon('pin') + '<span>24 Demo Street, Sample City</span></li></ul></div></div>' +
        '<div class="footer-bottom"><div class="container"><p>&copy; 2026 NovaShop. Demo storefront, no real orders are processed.</p></div></div>';
    }
    var host = document.createElement('div');
    host.id = 'toast-region';
    host.className = 'toast-region';
    host.setAttribute('role', 'status');
    host.setAttribute('aria-live', 'polite');
    document.body.appendChild(host);

    var top = document.createElement('button');
    top.className = 'back-to-top';
    top.type = 'button';
    top.setAttribute('aria-label', 'Back to top');
    top.innerHTML = icon('up');
    top.hidden = true;
    document.body.appendChild(top);
    top.addEventListener('click', function () { window.scrollTo({ top: 0 }); });
    window.addEventListener('scroll', function () {
      top.hidden = window.scrollY < 600;
      var bar = $('.nav-bar');
      if (bar) bar.classList.toggle('is-stuck', window.scrollY > 8);
    }, { passive: true });
  }

  function bindNav() {
    var toggle = $('#nav-toggle'), nav = $('#primary-nav');
    if (toggle && nav) {
      var setOpen = function (open) {
        nav.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open);
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        toggle.innerHTML = icon(open ? 'close' : 'menu');
      };
      toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
      nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); } });
    }
    var themeBtn = $('#theme-toggle');
    if (themeBtn) {
      var paint = function () {
        var dark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeBtn.innerHTML = icon(dark ? 'sun' : 'moon');
        themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      };
      paint();
      themeBtn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem(KEYS.theme, next); } catch (e) { /* ignore */ }
        paint();
      });
    }
  }

  /* Delegated product actions (cards on every page). */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var p = getProduct(btn.dataset.id);
    if (btn.dataset.action === 'add-cart' && p) {
      var ok = addToCart(p.id, 1, { color: (p.colors && p.colors[0]) || '' });
      toast(ok ? p.name + ' added to your cart' : p.name + ' is out of stock', ok ? 'success' : 'error');
    } else if (btn.dataset.action === 'wishlist' && p) {
      var added = toggleWishlist(p.id);
      toast(added ? 'Saved ' + p.name + ' to your wishlist' : 'Removed ' + p.name + ' from your wishlist');
    }
  });

  /* ---------- Form validation ---------- */
  function setFieldError(input, msg) {
    var out = document.getElementById(input.id + '-error');
    if (out) out.textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    var wrap = input.closest('.field');
    if (wrap) wrap.classList.toggle('has-error', !!msg);
  }
  function validateField(input) {
    var rules = (input.dataset.validate || '').split(' ').filter(Boolean);
    var v = input.value.trim();
    var label = input.dataset.label || 'This field';
    var msg = '';
    rules.forEach(function (rule) {
      if (msg) return;
      if (rule === 'required' && !v) msg = label + ' is required.';
      else if (v) {
        if (rule === 'email' && !EMAIL_RE.test(v)) msg = 'Enter a valid email address, like name@example.com.';
        else if (rule === 'phone' && !/^\+?[\d\s().-]{7,20}$/.test(v)) msg = 'Enter a valid phone number with 7 to 20 digits.';
        else if (rule === 'postal' && !/^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/.test(v)) msg = 'Enter a valid postal code.';
        else if (rule.indexOf('min:') === 0 && v.length < Number(rule.slice(4))) msg = label + ' needs at least ' + rule.slice(4) + ' characters.';
      }
    });
    setFieldError(input, msg);
    return !msg;
  }
  function validateForm(form) {
    var firstBad = null;
    $$('[data-validate]', form).forEach(function (input) {
      if (!validateField(input) && !firstBad) firstBad = input;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }
  function liveValidate(form) {
    $$('[data-validate]', form).forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () { if (input.getAttribute('aria-invalid') === 'true') validateField(input); });
    });
  }
  function formMessage(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = 'form-msg form-msg-' + type;
    el.hidden = false;
  }

  function initNewsletter() {
    $$('.newsletter-form').forEach(function (form) {
      var input = $('input[type="email"]', form), msg = $('.form-msg', form.parentNode);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = input.value.trim();
        if (!EMAIL_RE.test(v)) {
          input.setAttribute('aria-invalid', 'true');
          formMessage(msg, 'Enter a valid email address, like name@example.com.', 'error');
          input.focus();
          return;
        }
        input.setAttribute('aria-invalid', 'false');
        form.reset();
        formMessage(msg, 'Thanks for subscribing! This is a demo, so your email was not sent or stored anywhere.', 'success');
        toast('Demo subscription confirmed');
      });
    });
  }

  function initContactForm() {
    var form = $('#contact-form');
    if (!form) return;
    var msg = $('#contact-status');
    liveValidate(form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(form)) {
        formMessage(msg, 'Please fix the highlighted fields and try again.', 'error');
        return;
      }
      form.reset();
      $$('[data-validate]', form).forEach(function (i) { setFieldError(i, ''); });
      formMessage(msg, 'Message validated! This is a demo form, so nothing was sent to a server.', 'success');
      toast('Demo message validated');
    });
    $$('.faq-item button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !open);
        panel.hidden = open;
      });
    });
  }

  /* ---------- Home page ---------- */
  function initHome() {
    var cats = $('#category-grid');
    if (cats) {
      cats.innerHTML = window.CATEGORIES.map(function (c) {
        return '<a class="category-card" href="shop.html?category=' + encodeURIComponent(c.id) + '">' +
          '<img src="' + esc(c.image) + '" alt="" width="320" height="320" loading="lazy">' +
          '<span class="cc-text"><strong>' + esc(c.id) + '</strong><small>' + esc(c.blurb) + '</small></span></a>';
      }).join('');
    }
    var best = $('#bestsellers');
    if (best) {
      best.innerHTML = window.PRODUCTS.filter(function (p) { return p.stock !== 'out'; })
        .sort(function (a, b) { return b.reviews - a.reviews; }).slice(0, 4).map(productCard).join('');
    }
    var fresh = $('#new-arrivals');
    if (fresh) {
      fresh.innerHTML = window.PRODUCTS.slice().sort(function (a, b) { return b.dateAdded.localeCompare(a.dateAdded); }).slice(0, 4).map(productCard).join('');
    }
    var tm = $('#testimonials');
    if (tm) {
      tm.innerHTML = window.TESTIMONIALS.map(function (t) {
        return '<figure class="testimonial">' + starsHTML(t.rating) + '<blockquote>' + esc(t.text) + '</blockquote><figcaption><span class="avatar" aria-hidden="true">' + esc(t.name.slice(-1)) + '</span><span><strong>' + esc(t.name) + '</strong><small>' + esc(t.role) + '</small></span></figcaption></figure>';
      }).join('');
    }
  }

  /* ---------- Init ---------- */
  renderLayout();
  bindNav();
  initHome();
  initNewsletter();
  initContactForm();
  refreshUI();
  fixBrokenImages();
  window.addEventListener('load', fixBrokenImages);
  document.addEventListener('novashop:change', refreshUI);
  window.addEventListener('storage', function () { refreshUI(); emitChange(); });

  window.NovaShop = {
    KEYS: KEYS, COUPONS: COUPONS, MAX_QTY: MAX_QTY, FREE_SHIPPING_FROM: FREE_SHIPPING_FROM,
    esc: esc, money: money, $: $, $$: $$, icon: icon, readJSON: readJSON, writeJSON: writeJSON,
    getProduct: getProduct, discountPct: discountPct, STOCK: STOCK, starsHTML: starsHTML, priceHTML: priceHTML,
    productCard: productCard, placeholderImage: placeholderImage,
    getCart: getCart, addToCart: addToCart, setCartQty: setCartQty, removeFromCart: removeFromCart, clearCart: clearCart, cartKey: cartKey,
    getCoupon: getCoupon, setCoupon: setCoupon, totals: totals,
    getWishlist: getWishlist, isWished: isWished, toggleWishlist: toggleWishlist, removeFromWishlist: removeFromWishlist,
    toast: toast, refreshUI: refreshUI, validateForm: validateForm, liveValidate: liveValidate, setFieldError: setFieldError, formMessage: formMessage
  };
})();
