# NEXORA - e-commerce storefront

Next.js 16 (App Router, Cache Components) + Tailwind v4.

```bash
npm run dev     # http://localhost:3000
npm run build && npm start
```

## What's inside
- Home, shop (search, category/brand/price/rating filters, sorting), deals, product pages (colors, sizes, reviews), wishlist
- Cart drawer + cart page, promo codes (`WELCOME10`, `SAVE20`, `FREESHIP`), free-shipping progress, tax + shipping math
- Checkout with validation (Luhn card check), delivery options, order confirmation + demo tracking
- Accounts (sign up/in, profile, order history, buy again)

## Demo-mode limits
There is no backend: cart, wishlist, accounts, orders and reviews live in `localStorage`
(see `lib/store.ts`). No payments are processed and no emails are sent. Products live in
`lib/products.ts`; set `images: ["https://..."]` on a product to replace its generated art with a photo.

## Going to production
Swap `lib/store.ts` actions for API calls, add a database (products/orders/users), real auth
(e.g. Auth.js), and Stripe for payments.
