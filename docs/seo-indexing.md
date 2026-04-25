# SEO And Indexing

## Canonical Policy

Canonical domain: `https://tryeyeglasses.com`.

Redirect to canonical:

- `http://tryeyeglasses.com/*`
- `https://www.tryeyeglasses.com/*`
- `http://www.tryeyeglasses.com/*`
- `https://useeyeglasses.com/*`
- `https://www.useeyeglasses.com/*`

The middleware preserves the path and only preserves useful attribution parameters.

## Technical SEO

Implemented:

- per-route metadata
- canonical tags
- sitemap at `/sitemap.xml`
- robots at `/robots.txt`
- JSON-LD on homepage
- noindex checkout
- crawlable content pages for core search intent

## Launch Indexing Checklist

1. Verify `tryeyeglasses.com` in Google Search Console.
2. Verify `tryeyeglasses.com` in Bing Webmaster Tools.
3. Submit `https://tryeyeglasses.com/sitemap.xml`.
4. Configure `INDEXNOW_KEY`.
5. Confirm `/indexnow-key.txt` returns the key.
6. POST changed public URLs to `/api/indexnow`.
7. Validate rich data with Google's Rich Results test.
8. Use Search Console URL inspection for `/`, `/try-on-glasses`, `/virtual-glasses-try-on`, and `/ai-eyeglasses-try-on`.

## Next SEO Work

- Add real before/after examples once we have user-approved or self-created images.
- Publish useful comparison pages only when they have original content, for example `/ray-ban-virtual-try-on` or `/round-glasses-try-on`, and avoid thin duplicate pages.
- Add an FAQ block below the studio that answers cost, privacy, API key safety, photo quality, and whether product prices are estimates.
- Build backlinks from the GitHub repo, Product Hunt/Indie Hackers launch post, and a short technical write-up about using one image generation for a multi-frame try-on board.
- Connect Cloudflare Web Analytics or Plausible and track impressions, generation starts, successful generations, API-key mode usage, and checkout clicks.
