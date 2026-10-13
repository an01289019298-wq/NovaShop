# NovaShop

A frontend-only demo e-commerce store built with HTML5, CSS3 and vanilla JavaScript. No backend, database, build step or framework.

## Run it
Open `index.html` in a modern browser (or serve the folder with any static server, e.g. `python3 -m http.server`).

## Features
- Home, Shop, Product, Cart, Checkout, Wishlist, About and Contact pages
- Search, category filter, price range, availability filter and sorting (all client-side)
- Cart and wishlist saved in `localStorage`, with live counters on every page
- Demo coupons: `NOVA10` (10% off) and `WELCOME20` (20% off); free shipping over $100, otherwise a simulated $9.99
- Demo checkout with validation, sample order reference and confirmation (no data is sent anywhere)
- Light/dark theme, mobile filter drawer, toasts, back-to-top, accessible tabs and FAQ
- Responsive from 375px to 1440px+, keyboard accessible, respects reduced motion

## Structure
- `css/` style.css (design system) + page CSS + responsive.css
- `js/` products.js (sample data), main.js (shared logic) + one script per page
- `assets/images/` favicon and empty-state illustrations

## Notes
- All products, prices, ratings and reviews are fictional demo data.
- Product photos load from Unsplash and need an internet connection. If one fails, a branded placeholder is shown instead.
- Fonts (Sora, DM Sans) load from Google Fonts with system-font fallbacks.
