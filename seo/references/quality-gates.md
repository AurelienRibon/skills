# Quality Gates

Recommended heuristics for source-code SEO audits.

## Contents

- Meta tag thresholds
- Required meta tags
- Content word count heuristics
- Image optimization
- Core Web Vitals
- Heading hierarchy
- Readability targets
- Internal linking

Treat these values as review guidance, not as hard Google requirements. When evaluating a page,
separate objective failures (missing tags, broken canonicals, invalid markup, render-blocking
mistakes) from editorial heuristics (copy length, phrasing, word count, readability).

## Meta Tag Thresholds

| Element | Min | Max | Notes |
|---|---|---|---|
| `<title>` | 30 chars | 60 chars | Common display-oriented target, not a fixed Google limit. |
| `meta description` | 120 chars | 160 chars | Common snippet-writing target, not a fixed Google limit. |
| `og:title` | 30 chars | 60 chars | Can differ from `<title>` for social optimization. |
| `og:description` | 100 chars | 160 chars | Compelling for social sharing. |
| OG image | 1200x630px | -- | Minimum 600x315. Ratio 1.91:1. |
| `alt` text | 10 chars | 125 chars | Common accessibility heuristic. Prioritize accuracy over length targets. |
| `<h1>` text | 20 chars | 70 chars | Editorial heuristic only. Prioritize clarity over exact length. |

## Required Meta Tags Checklist

- `<title>` -- page title
- `<meta name="description">` -- page description
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` -- mobile
- `<link rel="canonical" href="...">` -- absolute canonical URL
- `<html lang="xx">` -- language attribute (ISO 639-1)
- `<link rel="icon" href="...">` -- favicon
- `<meta property="og:type">` -- typically "website"
- `<meta property="og:url">` -- canonical URL
- `<meta property="og:title">` -- social title
- `<meta property="og:description">` -- social description
- `<meta property="og:image">` -- social image (absolute URL)
- `<meta name="twitter:card" content="summary_large_image">` -- Twitter card type
- `<meta name="twitter:title">` -- Twitter title
- `<meta name="twitter:description">` -- Twitter description

## Content Word Count Minimums

These are content-planning heuristics, not ranking guarantees.

| Page Type | Minimum Words | Uniqueness Required |
|---|---|---|
| Homepage | 500 | 100% |
| Service / Feature page | 800 | 100% |
| Blog post | 1,500 | 100% |
| Product page | 400 | 80%+ |
| Location page (primary) | 600 | 60%+ |
| About / Landing page | 400 | 100% |

## Image Optimization

### File Size Thresholds

| Category | Good | Warning | Critical |
|---|---|---|---|
| Thumbnails | <50KB | >100KB | >200KB |
| Content images | <100KB | >200KB | >500KB |
| Hero / banner | <200KB | >400KB | >700KB |
| OG image | <200KB | >300KB | >500KB |

### Image Attributes Checklist

| Attribute | When to use | When NOT to use |
|---|---|---|
| `loading="lazy"` | Below-fold images | Hero image, LCP image, above-fold |
| `fetchpriority="high"` | Hero image, LCP candidate | Any other image |
| `decoding="async"` | Non-critical images | LCP image |
| `width` + `height` | All images (CLS prevention) | Never skip these |

### Preferred Formats (priority order)

1. AVIF -- best compression, growing support
2. WebP -- good compression, wide support
3. JPEG -- fallback for photos
4. PNG -- fallback for graphics/transparency
5. SVG -- icons and simple graphics (not photos)

Use `<picture>` element with format fallbacks for critical images.

## Core Web Vitals (measured at 75th percentile, mobile)

| Metric | Good | Needs Work | Poor |
|---|---|---|---|
| LCP (Largest Contentful Paint) | <=2.5s | 2.5-4.0s | >4.0s |
| INP (Interaction to Next Paint) | <=200ms | 200-500ms | >500ms |
| CLS (Cumulative Layout Shift) | <=0.1 | 0.1-0.25 | >0.25 |

**Note**: INP replaced FID in March 2024. Never reference FID.

### LCP Code-Level Fixes

- Preload LCP image: `<link rel="preload" as="image" href="...">`
- Add `fetchpriority="high"` to LCP element
- Remove `loading="lazy"` from LCP element
- Inline critical CSS, defer non-critical with `media="print" onload="this.media='all'"`
- Use `font-display: swap` for web fonts
- Preconnect to font origins: `<link rel="preconnect" href="...">`
- Avoid render-blocking JS before LCP element

### INP Code-Level Fixes

- Break long tasks into chunks <50ms using `requestIdleCallback` or `scheduler.yield()`
- Debounce/throttle event handlers (scroll, resize, input)
- Avoid synchronous `localStorage` reads in hot paths
- Avoid layout thrashing (batch DOM reads, then DOM writes)
- Keep total DOM element count under 1,500
- Use CSS `contain` property for complex components
- Prefer `requestAnimationFrame` over `setTimeout` for visual updates

### CLS Code-Level Fixes

- Always set `width` and `height` on `<img>` and `<iframe>` elements
- Use CSS `aspect-ratio` for responsive images instead of padding hacks
- Reserve space for late-loading content (ads, embeds, dynamic content)
- Use `font-display: swap` with font preloading to prevent text shift
- Never insert content above existing visible content after page load
- Use CSS `contain-intrinsic-size` for lazy-loaded content

## Heading Hierarchy

- Exactly one `<h1>` per page
- `<h2>` must be children of `<h1>` (no H2 before H1)
- `<h3>` must be children of `<h2>` (no level skipping: H1 -> H3)
- Headings should be descriptive (not "Section 1", "Part A")
- Primary keyword in `<h1>`, secondary keywords in `<h2>`s

## Readability Targets

Use these as editorial prompts. Do not fail a page solely for missing a numeric readability target.

| Metric | Target |
|---|---|
| Average sentence length | 15-20 words |
| Paragraph length | 2-4 sentences |
| Flesch Reading Ease | 60-70 (general audience) |

## Internal Linking

- 3-5 internal links per 1,000 words
- Use descriptive anchor text (not "click here", "read more", "learn more")
- Vary anchor text -- don't repeat the exact same phrase
- Link to related content, not just homepage
