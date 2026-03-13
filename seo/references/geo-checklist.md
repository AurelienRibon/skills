# AI Search Optimization (GEO)

Generative Engine Optimization: making content citable by AI search platforms.

## AI Crawlers

| Crawler | Platform | robots.txt Token | Purpose |
|---|---|---|---|
| GPTBot | OpenAI | GPTBot | Training data (blocking does NOT prevent ChatGPT search citations) |
| OAI-SearchBot | ChatGPT Search | OAI-SearchBot | Controls ChatGPT search results |
| ClaudeBot | Anthropic | ClaudeBot | Training + search |
| PerplexityBot | Perplexity | PerplexityBot | Search results |
| Google-Extended | Google AI | Google-Extended | AI training (blocking does NOT affect Google Search) |
| CCBot | Common Crawl | CCBot | General training data |

### Recommended robots.txt for AI visibility

```
# Allow AI search crawlers
User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

# Optional: block training-only crawlers
User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Google-Extended
Disallow: /
```

## llms.txt Standard

Location: `/public/llms.txt` (served at site root).
Purpose: help LLMs understand site structure and key content.

### Format

```
# [Site Name]

> [One-sentence description of the site/product]

## Main Pages

- [Page Title](https://example.com/page): Brief description of the page

## Key Facts

- [Specific fact about the product/service]
- [Another specific fact]
- [Pricing, availability, or key differentiator]
```

### Guidelines

- Keep under 500 lines
- Use absolute URLs
- Lead with the most important pages
- Include specific, quotable facts (numbers, dates, features)
- Update when content changes significantly

## Citability Criteria

Content with these characteristics is more likely to be cited by AI:

### 1. Self-contained answer blocks (134-167 words)

A paragraph that fully answers a question without needing external context.
Structure: definition/answer first, then supporting details, then specific example.

### 2. Quotable opening (first 40-60 words)

The first 2-3 sentences of a section should contain:
- Specific numbers, percentages, or dates
- Clear definitions
- Direct answers to the section's implied question
- No hedging ("might", "could", "possibly")

### 3. Question-phrased headings

Use `<h2>` and `<h3>` that match natural language queries:
- "What is [product]?" instead of "About"
- "How does [feature] work?" instead of "Features"
- "How much does [product] cost?" instead of "Pricing"

### 4. Structured data presence

Content with proper JSON-LD schema has ~2.5x higher chance of appearing in AI answers.
Prioritize: Organization, WebApplication/Product, Article schemas.

### 5. Data tables and comparison lists

- Use `<table>` for comparisons (features, pricing tiers)
- Use `<dl>` for definitions
- Use ordered/unordered lists for features, steps, benefits
- AI models extract structured information more reliably from these elements

### 6. Source attribution

- Back claims with dates, sources, or methodology
- Include `datePublished` and `dateModified` in schema
- Link author profiles via `sameAs` to social/professional profiles

## E-E-A-T Framework (December 2025 Update)

Now applies to ALL competitive queries, not just YMYL (Your Money Your Life).
Sites without E-E-A-T signals have seen 40-70% traffic drops post-update.

| Factor | Weight | Source code signals to check |
|---|---|---|
| Trustworthiness | 30% | HTTPS everywhere, contact info visible, privacy policy link, clear attribution, no deceptive patterns |
| Expertise | 25% | Author credentials displayed, technical accuracy, proper terminology, depth of content |
| Authoritativeness | 25% | `sameAs` links in schema (LinkedIn, GitHub, etc.), external citations, industry recognition |
| Experience | 20% | Original images/screenshots, case studies, specific anecdotes, unique first-party data |

### Code-level E-E-A-T checks

1. Author schema: `Person` type with `name`, `jobTitle`, `sameAs` (social links)
2. `datePublished` and `dateModified` in Article/BlogPosting schema
3. Contact page link in footer or navigation
4. Privacy policy link in footer
5. About page with team/company credentials
6. HTTPS on all internal and external links

## Key Statistics

- Brand mentions correlate 3x more with AI visibility than backlinks
- Only 11% of domains get citations across both ChatGPT and Google AI Overviews for the same query
- 92% of AI Overview citations come from top-10 ranking pages
- Multi-modal content (images, video, tables) increases AI selection by 156%
- Content with schema markup has ~2.5x higher AI citation probability
