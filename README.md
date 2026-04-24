# TryEyeglasses

AI glasses try-on for `tryeyeglasses.com`.

The app is a Next.js 16 full-stack MVP with shadcn/ui, SQLite, Cloudflare R2 storage, PayPal credit checkout, Cloudflare canonical routing, and an image-generation provider defaulting to `gpt-image-2`.

## Local Development

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

Without `OPENAI_API_KEY` and R2 credentials, `/api/generations` returns a local demo image so the workflow remains testable.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Deployment Shape

- Canonical domain: `https://tryeyeglasses.com`
- Redirected domains: `useeyeglasses.com`, `www.useeyeglasses.com`, `www.tryeyeglasses.com`
- Hosting: VPS Docker Compose app behind Cloudflare
- Storage: Cloudflare R2
- Payments: PayPal Standard Checkout endpoints
- Database: SQLite persistent Docker volume

See `docs/` for product, architecture, AI, SEO, payment, deployment, and design decisions.
