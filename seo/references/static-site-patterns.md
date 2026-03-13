# Static Site Patterns

Vite + Vercel deployment patterns for SEO files.

## File Locations

| File | Location | Notes |
|---|---|---|
| HTML entry | `index.html` (project root) | Vite convention |
| Public assets | `/public/` | Copied as-is to build output |
| Build output | `/dist/` | Configured in `vite.config.*` |
| Vercel config | `vercel.json` (project root) | Redirects, headers, rewrites |

### Static files that belong in `/public/`

- `robots.txt`
- `sitemap.xml`
- `llms.txt`
- `favicon.ico` or `favicon.png`
- `og.png` (Open Graph image)
- `apple-touch-icon.png` (optional)

## robots.txt Template

```
User-agent: *
Allow: /

# AI search crawlers
User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: https://[DOMAIN]/sitemap.xml
```

Replace `[DOMAIN]` with the actual domain (e.g., `bezels.auline.cc`).

## sitemap.xml Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://[DOMAIN]/</loc>
    <lastmod>[YYYY-MM-DD]</lastmod>
  </url>
</urlset>
```

Notes:
- For single-page apps: typically one `<url>` entry
- For multi-page sites: one entry per public URL
- `lastmod` should reflect actual content change date, not build date
- `<changefreq>` and `<priority>` are deprecated -- omit them
- Max 50,000 URLs per sitemap file (split if needed)

## llms.txt Template

```
# [App Name]

> [One-sentence description of what this app/site does]

## Main Pages

- [Homepage](https://[DOMAIN]/): [What the homepage offers]

## Key Facts

- [Concrete fact about the product: what it does]
- [Who it's for or key use case]
- [Pricing or availability info]
```

## Vercel Security Headers

Add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

Notes:
- HSTS is handled automatically by Vercel for custom domains
- CSP (Content-Security-Policy) is project-specific -- suggest but don't auto-generate
  (depends on inline scripts, external fonts, analytics, etc.)

## SPA SEO Considerations

### Content must be in initial HTML

For static sites without SSR, search engines and AI crawlers see only the initial HTML.
All SEO-critical content must be present in `index.html`, not injected by JavaScript:
- `<title>`, meta tags, JSON-LD -- must be in HTML source
- Heading tags (`<h1>` etc.) -- should be in HTML if they contain key SEO text
- AI crawlers may not execute JavaScript at all

### Strategies for JS-dependent content

1. **`<noscript>` blocks**: provide crawlable text content
   ```html
   <noscript>
     <p>[Key page description and content for crawlers]</p>
   </noscript>
   ```

2. **`sr-only` divs**: screen-reader content that doubles as crawler content
   ```html
   <div class="sr-only">[Supplementary SEO text]</div>
   ```
   Keep it accurate and relevant -- not keyword-stuffed.

3. **Pre-rendered meta**: all meta tags and JSON-LD in static HTML

### Canonical URL Consistency

These must all match (the same absolute URL):
1. `<link rel="canonical" href="...">` in `<head>`
2. `<meta property="og:url" content="...">`
3. `<url><loc>...</loc></url>` in sitemap.xml
4. `url` property in JSON-LD structured data

Mismatches confuse search engines about which URL is authoritative.
Use the production URL (with `https://`), not localhost or staging.
