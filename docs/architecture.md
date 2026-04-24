# Architecture

## Stack

- Next.js 16 App Router
- React 19
- Tailwind v4
- shadcn/ui
- SQLite with Drizzle
- Cloudflare R2 through S3-compatible API
- PayPal Checkout REST endpoints

## Server Boundaries

All secrets stay server-side. SDKs and database clients are lazily initialized to keep `next build` safe when production environment variables are absent.

## Database

Core tables:

- `users`
- `sessions`
- `anonymous_generation_claims`
- `glasses_styles`
- `user_uploaded_styles`
- `generations`
- `credit_ledger`
- `paypal_orders`

Migrations live in `drizzle/`. Seed catalog data with `npm run db:seed`.
