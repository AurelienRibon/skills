---
name: seo
description: >
  Analyze and fix SEO issues in web projects. Reads source code directly and applies fixes.
  Use when the user asks to audit SEO, check/fix meta tags, add structured data, generate
  JSON-LD, optimize images for SEO, create robots.txt or sitemap.xml, check Core Web Vitals,
  improve E-E-A-T, optimize for AI search, add llms.txt, check alt text, fix heading hierarchy,
  or mentions SEO, structured data, schema.org, rich results, GEO, or AI Overviews.
---

# SEO Skill

Source-code-level SEO analysis and fixes for front-end web projects, especially static,
pre-rendered, and SSR-capable sites.
Unlike browser audit tools, this skill reads and modifies source files directly.

## Subcommands

| Command | Scope | Reference to read |
|---|---|---|
| `/seo audit` | Full audit across all categories | All 4 reference files |
| `/seo meta` | Title, description, OG, Twitter Cards, canonical | `quality-gates.md` |
| `/seo schema` | Detect, validate, generate JSON-LD | `schema-types.md` |
| `/seo images` | Alt text, lazy loading, formats, CLS prevention | `quality-gates.md` |
| `/seo technical` | robots.txt, sitemap, canonical, security headers | `static-site-patterns.md` |
| `/seo content` | Heading hierarchy, word count, E-E-A-T signals | `quality-gates.md` |
| `/seo geo` | AI search optimization, llms.txt, citability | `geo-checklist.md` |

Default (no subcommand): run `/seo audit`.

## Workflow

For every subcommand, follow these steps:

### Step 1: Load references

Read the relevant reference file(s) from `~/.claude/skills/seo/references/`.
For `/seo audit`, read ALL four reference files.

### Step 2: Discover project files

Use Glob and Grep to find relevant files:
- `package.json` -- framework, scripts, project name, site context
- Entry points and layouts: `**/index.html`, `app/**/*.tsx`, `pages/**/*`, `src/routes/**/*`, `src/app.html`, `app.vue`, `src/app/**/*`
- Metadata and head definitions: `app/layout.*`, `app/head.*`, `pages/_app.*`, `pages/_document.*`, `pages/**/*.astro`, route-level SEO helpers, head components
- Static assets: `**/public/robots.txt`, `**/public/sitemap.xml`, `**/public/llms.txt`, `public/**/*favicon*`, `public/**/*og*`
- Build and deployment config: `vite.config.*`, `vercel.json`, `next.config.*`, `astro.config.*`, `nuxt.config.*`, `svelte.config.*`
- Use Grep to scan for: `<meta`, `application/ld+json`, `<img`, `<Image`, `<picture`, `<h1`-`<h6>`, `loading=`, `generateMetadata`, `Head`, `Helmet`
- Prefer framework-native metadata patterns over editing generated output

### Step 2b: Resolve production URL

Before generating canonical URLs, sitemap entries, Open Graph URLs, or `llms.txt` links:
- Look for an explicit production domain in config, environment examples, site settings, or existing metadata
- Reuse the established canonical domain when present
- If no production domain is discoverable, report the gap and do not invent one

### Step 3: Analyze against checklist

Check each item from the reference file against the source code.
Categorize each finding as:
- **PASS** -- meets or exceeds the standard
- **WARN** -- heuristic improvement opportunity, or partially meets the standard
- **FAIL** -- objectively missing, broken, invalid, or clearly harmful

### Step 4: Report

Use the output format defined below.

### Step 5: Fix

For each FAIL and WARN:
- Propose a specific code change
- Group fixes by file to minimize edits
- Ask the user before applying: "Apply these fixes? (all / pick numbers / skip)"

### Step 6: Verify

After applying edits:
- Re-scan the modified files to confirm the issue is actually fixed
- Check for internal consistency across title/meta/canonical/OG/schema/sitemap values
- Recommend external validation when relevant: Rich Results Test or Schema Markup Validator for JSON-LD, URL Inspection or live fetch for indexing issues, and PageSpeed Insights for CWV questions

## Output Format

```
## SEO Report: [Subcommand Name]

**Project**: [name from package.json]
**Score**: [X/Y checks passed] ([percentage]%)

### Findings

| # | Status | Check | Details |
|---|--------|-------|---------|
| 1 | PASS   | ...   | ...     |
| 2 | WARN   | ...   | ...     |
| 3 | FAIL   | ...   | ...     |

### Fixes Available

1. **[file path]** -- [description of change]
2. **[file path]** -- [description of change]
```

For `/seo audit`, show a category summary first:

```
## SEO Audit Summary

| Category | Score | Weight |
|----------|-------|--------|
| Technical | X/Y | 25% |
| Content | X/Y | 25% |
| Meta (On-Page) | X/Y | 20% |
| Schema | X/Y | 10% |
| Performance | X/Y | 10% |
| Images | X/Y | 5% |
| AI Search (GEO) | X/Y | 5% |
| **Overall** | **[weighted %]** | |
```

Then expand each category with its findings table.
Prioritize fixes: Critical (blocks indexing) > High (ranking impact) > Medium (optimization) > Low (nice-to-have).
Present the top 5 highest-impact fixes first.

--------------------------------------------------------------------------------

## Subcommand: meta

Checks (thresholds in `quality-gates.md`):

1. `<title>` exists, is specific to the page, and is not obviously too short, too long, or duplicated across pages
2. `<meta name="description">` exists, describes the page clearly, and is not obviously too short, too long, or duplicated
3. `<meta name="viewport">` present with `width=device-width, initial-scale=1.0`
4. `<link rel="canonical">` present with absolute URL
5. `<html lang="xx">` attribute present
6. OG tags complete: `og:type`, `og:url`, `og:title`, `og:description`, `og:image`
7. `og:image` dimensions: 1200x630px minimum
8. Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
9. No duplicate meta tags
10. `<meta name="theme-color">` present
11. Favicon: `<link rel="icon">` present
12. `<meta name="author">` or author attribution present

When fixing: preserve existing values that pass. Only modify or add failing elements.

--------------------------------------------------------------------------------

## Subcommand: schema

Read `references/schema-types.md` for the working type registry and validation rules.

### Detection

- Grep for `<script type="application/ld+json">` in all HTML files
- Parse each JSON-LD block

### Validation checklist

1. `@context` uses the HTTPS Schema.org context (`https://schema.org` or `https://schema.org/`)
2. `@type` is a valid Schema.org type. If it is not listed in the reference file, verify it before flagging it
3. All required properties present for the type
4. No placeholder text ("Lorem", "TODO", "CHANGE_ME", "example.com")
5. All URLs are absolute (start with `https://`)
6. All dates in ISO 8601 format
7. Images have valid absolute URLs
8. `price` is represented consistently and paired with `priceCurrency` when used in offers
9. Nested `@type` objects are also valid types

### Generation

When no JSON-LD exists or user asks to add schema:
- Analyze page content to determine the right type(s)
- Web apps: `WebApplication` or `SoftwareApplication`
- Landing pages: `WebSite` + `Organization`
- Blog posts: `Article` or `BlogPosting`
- Products: `Product` with `Offer`
- Generate valid JSON-LD and insert into `<head>` before `</head>`

--------------------------------------------------------------------------------

## Subcommand: images

Checks (thresholds in `quality-gates.md`):

1. Every meaningful `<img>` has an `alt` attribute that is descriptive and not just a filename; decorative images may use empty alt text
2. `width` and `height` attributes present on all images (CLS prevention)
3. Below-fold images: `loading="lazy"` present
4. LCP/hero image: NO `loading="lazy"`, has `fetchpriority="high"`
5. Non-critical images: `decoding="async"`
6. Image format: prefer WebP/AVIF via `<picture>` with fallback
7. File sizes in `/public/`: thumbnails <50KB, content <100KB, hero <200KB
8. OG image exists and is 1200x630px

Identify the LCP image: typically the first large image visible in the viewport
(hero image, main product image). It should NOT have lazy loading.

--------------------------------------------------------------------------------

## Subcommand: technical

Read `references/static-site-patterns.md` for templates.

Checks:

1. `robots.txt` exists in `/public/`, has `User-agent: *`, references sitemap
2. `sitemap.xml` exists in `/public/`, valid XML, contains all public URLs
3. Canonical URL consistent across: `<link rel="canonical">`, `og:url`, sitemap, JSON-LD `url`
4. All URLs use HTTPS (no mixed content)
5. `vercel.json` has security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
6. Favicon present in `/public/`
7. `<noscript>` fallback for JS-dependent content (SPA consideration)
8. Clean URL structure (descriptive slugs, no unnecessary query params)

Generation: create `robots.txt` and `sitemap.xml` from templates when missing.
For single-page apps, sitemap typically has just one `<url>` entry.

--------------------------------------------------------------------------------

## Subcommand: content

Checks (thresholds in `quality-gates.md`):

1. One clear primary `<h1>` per page unless the framework output or component structure justifies an equivalent accessible pattern
2. Heading hierarchy: H2s under H1, H3s under H2 (no level skipping)
3. Word count is sufficient for the page intent; use the reference thresholds as heuristics, not hard requirements
4. Internal links use descriptive anchor text (not "click here")
5. E-E-A-T signals present:
   - Author info / credentials
   - Contact page link in footer or nav
   - Date stamps (published, updated)
   - Privacy policy link
6. `sr-only` content (if used) is accurate and not keyword-stuffed
7. Paragraph structure supports readability; use the reference targets as heuristics, not hard requirements

--------------------------------------------------------------------------------

## Subcommand: geo

Read `references/geo-checklist.md` for full criteria.

Checks:

1. If `llms.txt` exists at `/public/llms.txt`, it is accurate and uses absolute production URLs; if absent, treat it as an optional enhancement rather than a critical failure
2. JSON-LD structured data present where it helps identify the site, page, author, product, or article
3. Key sections include self-contained answer blocks that can be quoted without extra context
4. Openings of key sections contain specific, quotable facts when the content supports them
5. Question-phrased headings: `<h2>How does X work?</h2>`
6. AI crawler access in `robots.txt` is deliberate and consistent with site policy; for search visibility, check `OAI-SearchBot`, `Claude-SearchBot`/`Claude-User`, and `PerplexityBot`
7. Critical content in initial HTML (not JS-only, important for AI crawlers)
8. Data tables and comparison lists present for structured answers
9. Author schema linked to social profiles via `sameAs`

Generation: offer to create `llms.txt` when the site would benefit from it, using the template from `static-site-patterns.md`.

--------------------------------------------------------------------------------

## Subcommand: audit

Run all subcommands in sequence: meta > schema > technical > images > content > geo.

1. Aggregate scores into the summary table (with weights)
2. Merge all findings into a single prioritized list
3. Present top 5 highest-impact fixes first
4. Offer to apply all fixes or let user pick

## Reference Files

Located at `~/.claude/skills/seo/references/`:

- **`schema-types.md`** -- Common types, restricted types, search feature caveats, and validation rules.
- **`quality-gates.md`** -- Meta tag length thresholds. Image size limits. CWV bands. Content word count minimums. Readability targets. CWV code-level fix patterns.
- **`geo-checklist.md`** -- AI crawler table. llms.txt format. Citability criteria. E-E-A-T weights and signals.
- **`static-site-patterns.md`** -- robots.txt template. sitemap.xml template. llms.txt template. Vercel security headers. SPA SEO patterns.
