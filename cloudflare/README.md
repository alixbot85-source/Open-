# ShadowTm shared database API

The complete database and API source lives in this repository. Cloudflare Workers executes the API and D1 stores shared records for the GitHub Pages frontend.

## Shared data

- customer accounts and sessions
- resource and server catalog, prices, status, and metadata
- public site settings and payment wallets
- orders, immutable product snapshots, transaction hashes, and review state
- delivery queue and frozen recipient email
- administrator audit history
- message records (sending remains disabled until a real email provider is configured)

Admin approval is the only operation that creates a delivery row. Approval schedules the row in D1 and does not falsely mark an email delivered.

## Verification performed

```bash
npm install
npm run typecheck
npx wrangler deploy --dry-run
```

## One-time deployment

Cloudflare requires the repository owner to authorize the account that owns the permanent database:

```bash
cd cloudflare
npx wrangler login
npx wrangler d1 create shadowtm-core
cp wrangler.jsonc.example wrangler.jsonc
# insert the returned database_id in wrangler.jsonc
npm run db:remote
npx wrangler secret put ADMIN_API_KEY
npm run deploy
```

Set `VITE_API_BASE_URL` to the resulting `https://...workers.dev` URL and rebuild `docs/`. The Admin key is entered at **Admin → Settings** and remains in session storage only; it is never committed.

## Local database

After copying the Wrangler config:

```bash
npm run db:local
npm run dev
```

The public Worker allows requests from `https://alixbot85-source.github.io` by default. Update `ALLOWED_ORIGINS` only when the public site URL changes.
