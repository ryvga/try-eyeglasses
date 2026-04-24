# Deployment

## VPS

The app is configured for Docker Compose and a persistent SQLite volume.

```bash
docker compose up -d --build
docker compose logs -f web
```

The container exposes Next.js on `127.0.0.1:3000`.

## Dokku Cleanup Plan

Before removing Dokku on the VPS:

1. SSH with `ssh vps`.
2. List running services and apps.
3. Confirm no data needs to be preserved.
4. Stop Dokku apps.
5. Remove Dokku apps/containers/volumes.
6. Remove Dokku packages.
7. Install Docker Compose if missing.
8. Deploy this app.

## Cloudflare

Configure:

- proxied A/AAAA/CNAME records for both domains
- canonical redirects to `https://tryeyeglasses.com`
- WAF/rate limiting for `/api/generations`, `/api/paypal/*`, auth, uploads
- R2 bucket and public asset domain
- cache bypass for API routes
