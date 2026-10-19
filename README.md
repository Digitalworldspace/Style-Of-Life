# Style Of Life — Etsy + Manual Product Store

This package combines the existing Style Of Life storefront with:

- Etsy listing import (title, description, price, quantity, URL and full-size listing images)
- Manual product creation with multiple image uploads
- One admin panel for both Etsy and manual products
- Luxury white / modern storefront
- Etsy OAuth 2.0 with `listings_r`, `listings_w`, and `shops_r`
- No Etsy product-by-product manual photo upload is required after connection

## Important architecture

GitHub stores the code, but Etsy OAuth secrets and write operations must run server-side. A static GitHub Pages site must **not** contain the Etsy shared secret or OAuth refresh token.

This repo therefore contains:
- `public/` — GitHub-ready frontend
- `server/server.js` — secure server-side Etsy connector + manual upload API
- `server/data/` — runtime product/token storage (ignored by git)

## Setup

1. Create an Etsy developer app and configure its HTTPS callback URL. Etsy's current Open API uses an API key plus OAuth 2.0 for private/write operations.
2. Copy `.env.example` to `.env` and fill in `ETSY_KEYSTRING`, `ETSY_SHARED_SECRET`, `ETSY_REDIRECT_URI`, and a strong `ADMIN_KEY`.
3. Run `npm install` then `npm start`.
4. Open `/admin.html`, enter the admin key, and click **Connect Etsy**.
5. Approve Etsy once. Then click **Sync Etsy Listings**.
6. Add any non-Etsy products directly from **Add manual product**.

## Deployment

For GitHub Pages only, the frontend can be hosted from `public/`, but the `/api/*` server must be deployed to a serverless/Node host and `API_BASE` in `public/js/config.js` should point to that API. Do not commit `.env` or `server/data/etsy-token.json`.

## Current behavior

Etsy sync is read/import plus a safe foundation for server-side writes. The included admin panel currently imports active Etsy listings and supports manual website products. For direct website-to-Etsy price/title writes, add the corresponding authenticated update endpoint after your Etsy app has write access; never expose the OAuth secret in browser code.
