# Style Of Life — Etsy-powered luxury storefront

This version changes the product architecture so the website does not need manual product-photo uploads. Active Etsy listings are imported into Supabase, while the storefront renders product data and image URLs from the database.

## What it does
- Etsy OAuth connection with `listings_r listings_w shops_r`.
- Imports all active Etsy listings in pages of 100.
- Imports Etsy listing images using Etsy-hosted `url_fullxfull` / `url_570xN` URLs.
- Stores the Etsy listing ID on every product so future updates can target the correct listing.
- Luxury editorial storefront styling remains the primary visual direction.
- No Supabase Auth is used.
- Supabase Table Editor remains the place where you can edit product rows.
- A Supabase Database Webhook can send product price updates to Etsy immediately.

## Important
Etsy requires an API key + shared secret and OAuth 2.0 for private/read/write shop endpoints. Keep those credentials only in Supabase Edge Function secrets; never put them in `config.js` or browser JavaScript.

## Setup
1. Run `supabase/schema.sql` in the Supabase SQL Editor.
2. Deploy the four Edge Functions under `supabase/functions/`.
3. Add these Supabase secrets:
   - `ETSY_KEYSTRING`
   - `ETSY_SHARED_SECRET`
   - `ETSY_REDIRECT_URI` = `https://YOUR-PROJECT.supabase.co/functions/v1/etsy-oauth-callback`
   - `SITE_URL` = your website URL
   - `SYNC_SECRET` = a long random secret
4. In the Etsy developer app, add the exact callback URL above.
5. Put your Supabase anon key in `config.js`.
6. Open `admin.html`, connect Etsy, then click **Import all Etsy products**.
7. Configure a Supabase Database Webhook on `public.products` for UPDATE events, calling:
   `https://YOUR-PROJECT.supabase.co/functions/v1/etsy-price-sync`
   with header `x-sync-secret: YOUR_SYNC_SECRET` and the webhook JSON payload.

## Price-sync note
For simple listings with one price, `etsy-price-sync` uses Etsy's listing update endpoint. Listings with price-affecting variations (for example different metal options with different prices) should be synced through Etsy's inventory endpoint instead. The imported raw listing is retained so this can be extended safely.
