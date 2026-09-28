# ShadowTm Cloudflare Core API

Free-tier backend for the GitHub Pages frontend. It covers authentication, wallet configuration, payment submission, duplicate-hash protection, Admin orders/users/audit logs, manual payment review, system health, and a server-side TRON Grid proxy.

## Free-tier fit

Cloudflare Workers Free currently allows 100,000 requests/day. D1 Free provides ample capacity for a low-traffic core API. Quotas are hard limits, not an uptime SLA.

## Deploy

```bash
cd cloudflare
npm install
npx wrangler login
npx wrangler d1 create shadowtm-core
cp wrangler.jsonc.example wrangler.jsonc
# Put the returned database_id in wrangler.jsonc
npm run db:remote
npx wrangler secret put ADMIN_API_KEY
# Optional higher TRON Grid quota:
npx wrangler secret put TRONGRID_API_KEY
npm run deploy
```

Copy the resulting `https://...workers.dev` URL. In the website open **Admin → Integrations → Cloudflare Workers + D1**, enter the Worker URL and the same Admin API key, then select **Connect & verify**.

The API URL is stored in browser localStorage. The admin key is stored only in sessionStorage and disappears when the browser session closes.

## Scope

This first free API deployment intentionally covers the selected Core scope. SMTP, private PDFs, and the due-delivery worker remain in the existing Express service and are not falsely reported as available by this Worker.
