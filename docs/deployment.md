# Deployment

## VPS

The app is configured for Docker Compose and a persistent SQLite volume.

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose logs -f web
```

The container exposes Next.js on `127.0.0.1:3000`.

## Secrets

Do not commit production secrets and do not pass them inline in shell commands.

Use a root-owned env file outside the repository:

```bash
sudo mkdir -p /etc/tryeyeglasses
sudo touch /etc/tryeyeglasses/app.env
sudo chmod 600 /etc/tryeyeglasses/app.env
sudo chown root:root /etc/tryeyeglasses/app.env
sudo nano /etc/tryeyeglasses/app.env
```

Required production values:

```bash
DATABASE_URL=file:./data/tryeyeglasses.sqlite
AUTH_SECRET=<fresh random secret>
OPENAI_API_KEY=<rotated OpenAI key>
IMAGE_MODEL=gpt-image-2
IMAGE_MODEL_SNAPSHOT=gpt-image-2-2026-04-21
IMAGE_OUTPUT_COUNT=1
IMAGE_SIZE=1536x1024
IMAGE_QUALITY=medium
R2_ACCOUNT_ID=<cloudflare account id>
R2_ACCESS_KEY_ID=<r2 token>
R2_SECRET_ACCESS_KEY=<r2 secret>
R2_BUCKET=tryeyeglasses-results
R2_PUBLIC_BASE_URL=https://assets.tryeyeglasses.com
PAYPAL_ENV=live
PAYPAL_CLIENT_ID=<paypal live client id>
PAYPAL_CLIENT_SECRET=<paypal live secret>
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<paypal live client id>
INDEXNOW_KEY=<random indexnow key>
```

After editing secrets:

```bash
cd /opt/tryeyeglasses/app
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
```

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
