# AI Search Optimization (GEO)

Generative Engine Optimization: making content citable by AI search platforms.

## Contents

- AI crawlers
- Recommended `robots.txt`
- `llms.txt` proposal
- Citability criteria
- E-E-A-T review framework
- Evidence handling

## AI Crawlers

| Crawler | Platform | robots.txt Token | Purpose |
|---|---|---|---|
| GPTBot | OpenAI | GPTBot | Training crawl. Blocking it does not by itself remove ChatGPT search citations. |
| OAI-SearchBot | OpenAI | OAI-SearchBot | Search crawler for ChatGPT search results. |
| ClaudeBot | Anthropic | ClaudeBot | Training crawl for model improvement. |
| Claude-SearchBot | Anthropic | Claude-SearchBot | Search crawler for Claude web search features. |
| Claude-User | Anthropic | Claude-User | User-triggered fetches from Claude sessions. |
| PerplexityBot | Perplexity | PerplexityBot | Search and retrieval crawler. |
| Google-Extended | Google | Google-Extended | Controls use by certain Google Gemini and Vertex AI features, not Google Search ranking. |
| CCBot | Common Crawl | CCBot | General training data |

### Recommended robots.txt for AI visibility

```
# Allow AI search crawlers
User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
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

## llms.txt Proposal

Location: `/public/llms.txt` (served at site root).
Purpose: an optional, emerging convention to summarize site structure and key content for LLMs.

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
- Do not treat absence of `llms.txt` as a critical SEO failure by itself

## Citability Criteria

Content with these characteristics is often easier for AI systems to extract, quote, and summarize:

### 1. Self-contained answer blocks

A paragraph that fully answers a question without needing external context.
Structure: definition/answer first, then supporting details, then specific example.

### 2. Quotable opening

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

Structured data can make entities, authors, products, and page purpose easier to interpret.
Prioritize types that match the actual content: Organization, WebApplication/Product, Article, Person.

### 5. Data tables and comparison lists

- Use `<table>` for comparisons (features, pricing tiers)
- Use `<dl>` for definitions
- Use ordered/unordered lists for features, steps, benefits
- AI models extract structured information more reliably from these elements

### 6. Source attribution

- Back claims with dates, sources, or methodology
- Include `datePublished` and `dateModified` in schema
- Link author profiles via `sameAs` to social/professional profiles

## E-E-A-T Review Framework

Use E-E-A-T as a qualitative review framework, not a scoring formula.

| Factor | Weight | Source code signals to check |
|---|---|---|
| Trustworthiness | Qualitative | HTTPS everywhere, contact info visible, privacy policy link, clear attribution, no deceptive patterns |
| Expertise | Qualitative | Author credentials displayed, technical accuracy, proper terminology, depth of content |
| Authoritativeness | Qualitative | `sameAs` links in schema (LinkedIn, GitHub, etc.), external citations, industry recognition |
| Experience | Qualitative | Original images/screenshots, case studies, specific anecdotes, unique first-party data |

### Code-level E-E-A-T checks

1. Author schema: `Person` type with `name`, `jobTitle`, `sameAs` (social links)
2. `datePublished` and `dateModified` in Article/BlogPosting schema
3. Contact page link in footer or navigation
4. Privacy policy link in footer
5. About page with team/company credentials
6. HTTPS on all internal and external links

## Evidence Handling

Do not present precise GEO uplift percentages, citation multipliers, or universal weighting models
unless the current task includes a verifiable source for them.
