/* Shop page: search, category + price filters, sorting, mobile drawer. */
(function () {
  'use strict';
  var NS = window.NovaShop;
  var grid = NS.$('#product-grid');
  if (!grid) return;

  var els = {
    search: NS.$('#filter-search'),
    cats: NS.$('#category-filters'),
    min: NS.$('#price-min'),
    max: NS.$('#price-max'),
    priceError: NS.$('#price-error'),
    stock: NS.$('#in-stock-only'),
    sort: NS.$('#sort-select'),
    count: NS.$('#result-count'),
    empty: NS.$('#empty-state'),
    clear: NS.$$('[data-clear-filters]'),
    panel: NS.$('#filters'),
    overlay: NS.$('#filters-overlay'),
    open: NS.$('#open-filters'),
    close: NS.$('#close-filters'),
    chips: NS.$('#active-filters')
  };

  /* Category radios, with product counts. */
  var allCats = [{ id: '', name: 'All products', n: window.PRODUCTS.length }].concat(window.CATEGORIES.map(function (c) {
    return { id: c.id, name: c.id, n: window.PRODUCTS.filter(function (p) { return p.category === c.id; }).length };
  }));
  els.cats.innerHTML = allCats.map(function (c, i) {
    return '<label class="radio-row"><input type="radio" name="category" value="' + NS.esc(c.id) + '"' + (i === 0 ? ' checked' : '') + '><span>' + NS.esc(c.name) + '</span><small>' + c.n + '</small></label>';
  }).join('');

  /* Initial state from the URL (?q=&category=&min=&max=&sort=). */
  var params = new URLSearchParams(location.search);
  var validCats = window.CATEGORIES.map(function (c) { return c.id; });
  var validSorts = ['featured', 'price-asc', 'price-desc', 'newest', 'rating'];
  els.search.value = (params.get('q') || '').slice(0, 80);
  if (validCats.indexOf(params.get('category')) !== -1) {
    NS.$('input[name="category"][value="' + params.get('category') + '"]').checked = true;
  }
  if (params.get('min') && Number(params.get('min')) >= 0) els.min.value = params.get('min');
  if (params.get('max') && Number(params.get('max')) >= 0) els.max.value = params.get('max');
  if (validSorts.indexOf(params.get('sort')) !== -1) els.sort.value = params.get('sort');

  function state() {
    var checked = NS.$('input[name="category"]:checked');
    return {
      q: els.search.value.trim(),
      category: checked ? checked.value : '',
      min: els.min.value === '' ? null : Number(els.min.value),
      max: els.max.value === '' ? null : Number(els.max.value),
      inStock: els.stock.checked,
      sort: els.sort.value
    };
  }

  function apply() {
    var s = state();
    var badRange = s.min !== null && s.max !== null && s.min > s.max;
    els.priceError.textContent = badRange ? 'Minimum price cannot be higher than maximum price.' : '';
    var term = s.q.toLowerCase();
    var list = window.PRODUCTS.filter(function (p) {
      if (term && (p.name + ' ' + p.category + ' ' + p.description).toLowerCase().indexOf(term) === -1) return false;
      if (s.category && p.category !== s.category) return false;
      if (!badRange && s.min !== null && p.price < s.min) return false;
      if (!badRange && s.max !== null && p.price > s.max) return false;
      if (s.inStock && p.stock === 'out') return false;
      return true;
    });
    var sorters = {
      'price-asc': function (a, b) { return a.price - b.price; },
      'price-desc': function (a, b) { return b.price - a.price; },
      newest: function (a, b) { return b.dateAdded.localeCompare(a.dateAdded); },
      rating: function (a, b) { return b.rating - a.rating; }
    };
    if (sorters[s.sort]) list.sort(sorters[s.sort]);

    grid.innerHTML = list.map(NS.productCard).join('');
    grid.hidden = list.length === 0;
    els.empty.hidden = list.length !== 0;
    els.count.textContent = list.length + (list.length === 1 ? ' product' : ' products');

    var chips = [];
    if (s.q) chips.push('Search: ' + s.q);
    if (s.category) chips.push(s.category);
    if (s.min !== null && !badRange) chips.push('From ' + NS.money(s.min));
    if (s.max !== null && !badRange) chips.push('Up to ' + NS.money(s.max));
    if (s.inStock) chips.push('In stock');
    els.chips.innerHTML = chips.map(function (c) { return '<li>' + NS.esc(c) + '</li>'; }).join('');

    /* Keep the URL shareable without adding history entries. */
    var next = new URLSearchParams();
    if (s.q) next.set('q', s.q);
    if (s.category) next.set('category', s.category);
    if (s.min !== null) next.set('min', s.min);
    if (s.max !== null) next.set('max', s.max);
    if (s.sort !== 'featured') next.set('sort', s.sort);
    try { history.replaceState(null, '', location.pathname + (next.toString() ? '?' + next : '')); } catch (e) { /* file:// may block */ }
    var headerSearch = NS.$('#site-search');
    if (headerSearch) headerSearch.value = s.q;
  }

  ['input', 'change'].forEach(function (evt) {
    els.panel.addEventListener(evt, apply);
  });
  els.sort.addEventListener('change', apply);
  els.search.addEventListener('keydown', function (e) { if (e.key === 'Enter') e.preventDefault(); });

  els.clear.forEach(function (btn) {
    btn.addEventListener('click', function () {
      els.search.value = ''; els.min.value = ''; els.max.value = ''; els.stock.checked = false; els.sort.value = 'featured';
      NS.$('input[name="category"][value=""]').checked = true;
      apply();
    });
  });

  /* Mobile filter drawer */
  function setDrawer(open) {
    els.panel.classList.toggle('is-open', open);
    els.overlay.hidden = !open;
    els.open.setAttribute('aria-expanded', open);
    document.body.classList.toggle('no-scroll', open);
    if (open) els.close.focus(); else els.open.focus();
  }
  els.open.addEventListener('click', function () { setDrawer(true); });
  els.close.addEventListener('click', function () { setDrawer(false); });
  els.overlay.addEventListener('click', function () { setDrawer(false); });
  NS.$('#apply-filters').addEventListener('click', function () { setDrawer(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && els.panel.classList.contains('is-open')) setDrawer(false); });

  apply();
})();
