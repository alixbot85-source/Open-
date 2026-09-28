# ShadowTm Clone

Independent React/Vite implementation of the ShadowTm digital marketplace. This project does **not** connect to banks, SWIFT, SEPA, Fedwire, ACH, TARGET2, payment gateways, settlement systems, or real fund transfers.

## Run the UI
```bash
npm install
npm run dev
npm run build
```

## Real delivery backend
The `server/` package implements the requested delivery flow with PostgreSQL/Prisma, private PDF storage, Nodemailer SMTP, a database-backed worker (no `setTimeout`), idempotent `EmailDelivery` rows, retry state, and audit logs. SMTP is intentionally disabled until real credentials are supplied in `.env`; the service never claims delivery when SMTP is not configured.

```bash
cp .env.example .env
npm install
npm run api:install
npm --prefix server exec prisma generate -- --schema ../prisma/schema.prisma
npm --prefix server exec prisma migrate deploy -- --schema ../prisma/schema.prisma
npm run api:dev       # API
npm run worker        # separate persistent worker
```

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, and `SMTP_FROM_NAME`. Telegram support and order delivery require `TELEGRAM_BOT_TOKEN`, `TELEGRAM_SUPPORT_CHAT_ID`, `TELEGRAM_BOT_USERNAME`, `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_LINK_SECRET`, and an HTTPS `PUBLIC_API_URL`; all secrets remain server-side. Configure the webhook through the authenticated admin endpoint after deployment. `TRONGRID_API_KEY` is optional and raises the free lookup quota without exposing the key to browsers. `DELIVERY_DELAY_HOURS` defaults to 2. Keep `PRIVATE_STORAGE_PATH` outside the public web root. The PDF endpoint accepts only `application/pdf`, `.pdf`, and enforces `MAX_PDF_BYTES`.

### Approval flow
`POST /api/admin/orders/:id/approve-payment` creates exactly one delivery row, snapshots the user's email and template, and calculates `scheduledFor` from UTC `paymentApprovedAt`. The worker reclaims due `PENDING`/`RETRY` rows after restarts, atomically claims rows to prevent duplicates, verifies approval and file existence, attaches the PDF, and marks `DELIVERED` only after SMTP confirms success. Repeated approval and worker restarts are idempotent. Four attempts are allowed; a final failure becomes `FAILED` and is visible to admins. Rejecting payment creates no delivery.

Relevant API endpoints:
- `POST /api/support/telegram` (provider-confirmed support delivery)
- `GET /api/blockchain/tron/transaction/:hash` (read-only public-chain lookup)
- `POST /api/telegram/webhook` (signed Telegram updates and first-channel-wins delivery)
- `POST /api/admin/telegram/configure-webhook`
- `GET /api/admin/orders/:id/telegram-link` (seven-day signed deep link)
- `GET /api/orders/:id/telegram-link` (authenticated order owner only)
- `GET|PUT /api/admin/delivery-templates/:type` (`fund`, `server`, or `license`)
- `POST /api/admin/delivery-templates/:type/pdf` (private resource attachment)
- `POST /api/admin/orders/:id/approve-payment`
- `POST /api/admin/orders/:id/reject-payment`
- `GET /api/orders/:id/delivery`
- `GET /api/admin/deliveries`
- `POST /api/admin/deliveries/:id/retry`
- `POST /api/admin/products/:id/pdf` (multipart `pdf`, `emailSubject`, `emailBody`)
- `DELETE /api/admin/products/:id/pdf`

Admin routes require the configured `x-admin-email` header as a minimal integration guard; connect this to the application's real HTTP-only admin session middleware before production exposure.

## Schema / migration
`prisma/schema.prisma` and `prisma/migrations/20260927_delivery/migration.sql` include `EmailDelivery`, `AuditLog`, delivery snapshots, product templates, PDF paths, approval timestamps, and unique order delivery constraint. No PDF binary or admin credential is stored in source control.

Information not available from the specification—bank connections, licenses, settlement, exchange rates, payment gateway, real availability and offledger mechanisms—is not invented here.

## Routes
`/`, `/server.php`, `/offledger.php`, `/about.php`, `/contact.php`, `/login.php`, `/register.php`, `/checkout.php?id=1&type=server`, `/dashboard`, `/admin`.
