/* NovaShop demo data. All products, prices, ratings and reviews are fictional sample content. */
(function () {
  var photo = function (id) {
    return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=800&h=800&q=80';
  };
  var gallery = function (id) {
    return [
      photo(id),
      'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=800&h=800&q=80&crop=top',
      'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=800&h=800&q=80&crop=bottom'
    ];
  };

  window.CATEGORIES = [
    { id: 'Headphones', blurb: 'Studio sound, anywhere', image: photo('1505740420928-5e560c06d30e') },
    { id: 'Smartwatches', blurb: 'Track more, tap less', image: photo('1546868871-7041f2a55e12') },
    { id: 'Electronics', blurb: 'Desk and travel tech', image: photo('1608043152269-423dbba4e7e8') },
    { id: 'Clothing', blurb: 'Everyday essentials', image: photo('1556821840-3a63f95609a7') },
    { id: 'Shoes', blurb: 'Built for every mile', image: photo('1542291026-7eec264c27ff') },
    { id: 'Bags', blurb: 'Carry it your way', image: photo('1553062407-98eeb64c6a62') },
    { id: 'Accessories', blurb: 'The finishing touch', image: photo('1572635196237-14b3f281503f') }
  ];

  var C = {
    clothing: ['S', 'M', 'L', 'XL'],
    shoes: ['39', '40', '41', '42', '43', '44']
  };

  window.PRODUCTS = [
    { id: 1, name: 'Nova Pro Wireless Headphones', category: 'Headphones', price: 129, originalPrice: 179, rating: 4.7, reviews: 842, stock: 'in', dateAdded: '2026-08-20', colors: ['Midnight', 'Silver', 'Ocean'], sizes: [], images: gallery('1505740420928-5e560c06d30e'), description: 'Active noise cancelling, 40-hour battery life and plush memory-foam ear cushions. Fold flat, pair with two devices at once, and stay focused wherever you work.', details: ['Bluetooth 5.3', '40h battery, 10 min fast charge = 5h', 'Hybrid active noise cancelling', 'USB-C and 3.5mm cable included'] },
    { id: 2, name: 'Pulse True Wireless Earbuds', category: 'Headphones', price: 59, originalPrice: null, rating: 4.4, reviews: 513, stock: 'in', dateAdded: '2026-09-18', colors: ['White', 'Black'], sizes: [], images: gallery('1590658268037-6bf12165a8df'), description: 'Pocket-sized earbuds with punchy bass, clear calls and a charging case that keeps going for 24 hours.', details: ['IPX5 sweat resistance', '6h playtime, 24h with case', 'Touch controls', 'Three ear-tip sizes'] },
    { id: 3, name: 'Studio Monitor Headphones', category: 'Headphones', price: 199, originalPrice: 249, rating: 4.8, reviews: 267, stock: 'low', dateAdded: '2026-07-02', colors: ['Graphite'], sizes: [], images: gallery('1583394838336-acd977736f90'), description: 'Closed-back reference headphones tuned for accurate, balanced sound. Detachable cables and replaceable pads make them built for daily use.', details: ['40mm neodymium drivers', 'Detachable 3m coiled cable', 'Replaceable ear pads', 'Carry pouch included'] },
    { id: 4, name: 'Aero Smartwatch S2', category: 'Smartwatches', price: 149, originalPrice: 199, rating: 4.6, reviews: 698, stock: 'in', dateAdded: '2026-09-25', colors: ['Black', 'Rose', 'Navy'], sizes: [], images: gallery('1546868871-7041f2a55e12'), description: 'A bright AMOLED display, built-in GPS and 7-day battery life. Track workouts, sleep and heart rate, and read notifications at a glance.', details: ['1.4" AMOLED display', 'Built-in GPS', '5 ATM water resistance', '7-day battery life'] },
    { id: 5, name: 'Chrono Classic Watch', category: 'Smartwatches', price: 179, originalPrice: null, rating: 4.5, reviews: 190, stock: 'in', dateAdded: '2026-06-11', colors: ['Steel', 'Gold'], sizes: [], images: gallery('1523275335684-37898b6baf30'), description: 'A hybrid smartwatch that keeps the look of a classic analog dial while counting steps and forwarding alerts.', details: ['Sapphire-coated glass', 'Stainless steel case', '30-day battery', 'Step and sleep tracking'] },
    { id: 6, name: 'FitBand Active 3', category: 'Smartwatches', price: 49, originalPrice: 69, rating: 4.2, reviews: 1204, stock: 'in', dateAdded: '2026-05-30', colors: ['Black', 'Teal', 'Coral'], sizes: [], images: gallery('1575311373937-040b8e1fd5b6'), description: 'A lightweight fitness tracker with 14 sport modes, heart-rate monitoring and a two-week battery.', details: ['14 sport modes', 'Heart-rate and SpO2', '14-day battery', 'Swim-proof'] },
    { id: 7, name: 'Aurora Bluetooth Speaker', category: 'Electronics', price: 89, originalPrice: 119, rating: 4.6, reviews: 455, stock: 'in', dateAdded: '2026-08-05', colors: ['Charcoal', 'Sand'], sizes: [], images: gallery('1608043152269-423dbba4e7e8'), description: 'Room-filling 360-degree sound in a rugged, waterproof body. Pair two speakers for stereo.', details: ['20W output', 'IP67 waterproof', '18h playtime', 'Stereo pairing'] },
    { id: 8, name: 'Lumen Mechanical Keyboard', category: 'Electronics', price: 109, originalPrice: null, rating: 4.7, reviews: 321, stock: 'in', dateAdded: '2026-09-10', colors: ['Slate', 'Ivory'], sizes: [], images: gallery('1587829741301-dc798b83add3'), description: 'A compact hot-swappable keyboard with tactile switches, per-key lighting and a solid aluminium frame.', details: ['75% layout', 'Hot-swappable switches', 'USB-C and Bluetooth', 'PBT keycaps'] },
    { id: 9, name: 'Glide Wireless Mouse', category: 'Electronics', price: 39, originalPrice: 49, rating: 4.3, reviews: 389, stock: 'in', dateAdded: '2026-04-15', colors: ['Black', 'White'], sizes: [], images: gallery('1527864550417-7fd91fc51a46'), description: 'An ergonomic silent-click mouse that connects to three devices and runs for months on a single charge.', details: ['Silent clicks', '3-device pairing', '4000 DPI sensor', '90-day battery'] },
    { id: 10, name: 'Vista Mirrorless Camera', category: 'Electronics', price: 649, originalPrice: 749, rating: 4.9, reviews: 112, stock: 'out', dateAdded: '2026-03-01', colors: ['Black'], sizes: [], images: gallery('1526170375885-4d8ecf77b99f'), description: 'A 24MP mirrorless camera with fast autofocus and 4K video, ideal for creators stepping up from a phone.', details: ['24MP APS-C sensor', '4K 30fps video', 'Wi-Fi transfer', 'Kit lens included'] },
    { id: 11, name: 'Essential Cotton Tee', category: 'Clothing', price: 24, originalPrice: null, rating: 4.5, reviews: 976, stock: 'in', dateAdded: '2026-09-28', colors: ['White', 'Black', 'Sage'], sizes: C.clothing, images: gallery('1521572163474-6864f9cf17ab'), description: 'A heavyweight organic cotton tee with a relaxed fit that keeps its shape wash after wash.', details: ['100% organic cotton', '220gsm fabric', 'Relaxed fit', 'Machine washable'] },
    { id: 12, name: 'Urban Fleece Hoodie', category: 'Clothing', price: 59, originalPrice: 79, rating: 4.6, reviews: 604, stock: 'in', dateAdded: '2026-10-01', colors: ['Heather', 'Navy', 'Plum'], sizes: C.clothing, images: gallery('1556821840-3a63f95609a7'), description: 'A brushed-fleece hoodie with a roomy hood, kangaroo pocket and ribbed cuffs for cold-weather comfort.', details: ['Brushed fleece lining', 'Kangaroo pocket', 'Ribbed cuffs and hem', 'Unisex fit'] },
    { id: 13, name: 'Trail Windbreaker Jacket', category: 'Clothing', price: 89, originalPrice: null, rating: 4.4, reviews: 233, stock: 'low', dateAdded: '2026-10-05', colors: ['Olive', 'Black'], sizes: C.clothing, images: gallery('1551028719-00167b16eac5'), description: 'A packable, water-repellent shell that blocks wind and folds into its own pocket.', details: ['Water-repellent finish', 'Packs into pocket', 'Adjustable hood', 'Reflective details'] },
    { id: 14, name: 'Stride Runner Sneakers', category: 'Shoes', price: 99, originalPrice: 130, rating: 4.7, reviews: 1120, stock: 'in', dateAdded: '2026-07-22', colors: ['Red', 'Grey', 'Blue'], sizes: C.shoes, images: gallery('1542291026-7eec264c27ff'), description: 'Responsive cushioning, a breathable knit upper and a grippy outsole make these an easy daily runner.', details: ['Breathable knit upper', 'Responsive foam midsole', 'Rubber outsole', '8mm drop'] },
    { id: 15, name: 'Court Classic Trainers', category: 'Shoes', price: 85, originalPrice: null, rating: 4.3, reviews: 418, stock: 'in', dateAdded: '2026-10-08', colors: ['White', 'Cream'], sizes: C.shoes, images: gallery('1595950653106-6c9ebd614d3a'), description: 'Minimal leather trainers with a clean profile that pair with almost anything.', details: ['Full-grain leather upper', 'Cushioned insole', 'Vulcanised sole', 'Clean-wipe finish'] },
    { id: 16, name: 'Metro Leather Backpack', category: 'Bags', price: 119, originalPrice: 149, rating: 4.8, reviews: 287, stock: 'in', dateAdded: '2026-08-14', colors: ['Tan', 'Black'], sizes: [], images: gallery('1553062407-98eeb64c6a62'), description: 'A structured backpack with a padded 15" laptop sleeve, quick-access pockets and soft leather straps.', details: ['Fits 15" laptop', '22L capacity', 'Water-resistant lining', 'Magnetic front pocket'] },
    { id: 17, name: 'Atelier Everyday Tote', category: 'Bags', price: 74, originalPrice: 95, rating: 4.5, reviews: 176, stock: 'in', dateAdded: '2026-09-02', colors: ['Camel', 'Ink'], sizes: [], images: gallery('1548036328-c9fa89d128fa'), description: 'A roomy tote with a zip-top closure and an inner organiser, sized for work days and weekends.', details: ['Zip-top closure', 'Inner zip pocket', 'Shoulder drop 25cm', 'Vegan leather'] },
    { id: 18, name: 'Aviator Polarized Sunglasses', category: 'Accessories', price: 49, originalPrice: null, rating: 4.4, reviews: 342, stock: 'in', dateAdded: '2026-06-28', colors: ['Gold', 'Gunmetal'], sizes: [], images: gallery('1572635196237-14b3f281503f'), description: 'Lightweight metal-frame aviators with polarized lenses and full UV400 protection.', details: ['Polarized lenses', 'UV400 protection', 'Spring hinges', 'Hard case included'] },
    { id: 19, name: 'Slim Leather Wallet', category: 'Accessories', price: 35, originalPrice: 45, rating: 4.6, reviews: 521, stock: 'in', dateAdded: '2026-10-10', colors: ['Brown', 'Black'], sizes: [], images: gallery('1627123424574-724758594e93'), description: 'A slim bifold that holds up to eight cards and cash without the bulk, with RFID-blocking lining.', details: ['Holds 8 cards', 'RFID-blocking lining', 'Full-grain leather', 'Gift box included'] }
  ];

  /* Illustrative sample testimonials (fictional). */
  window.TESTIMONIALS = [
    { name: 'Sample Customer A', role: 'Demo review', rating: 5, text: 'Sample review: the checkout flow was quick and the product pages made it easy to compare options.' },
    { name: 'Sample Customer B', role: 'Demo review', rating: 5, text: 'Sample review: I loved how clearly the sizes and colours were laid out. Great browsing experience.' },
    { name: 'Sample Customer C', role: 'Demo review', rating: 4, text: 'Sample review: filters and sorting helped me find what I needed in seconds.' }
  ];
})();
