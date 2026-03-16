# Schema.org Type Registry

Reference for JSON-LD structured data validation and generation.

## Contents

- Common types for this skill
- Restricted types
- Search feature changes vs Schema.org validity
- Recent additions
- Validation rules
- Common mistakes
- Type selection guide

## Common Types This Skill Can Validate or Generate

This is a working registry for common website SEO use cases. It is not a complete
Schema.org catalog, and absence from this list does not make a type invalid.

| Type | Required Properties | Recommended Properties |
|---|---|---|
| Organization | name, url | logo, sameAs, contactPoint, description |
| WebSite | name, url | potentialAction (SearchAction) |
| WebApplication | name, url, applicationCategory | offers, operatingSystem, browserRequirements, featureList, screenshot |
| SoftwareApplication | name, applicationCategory | offers, operatingSystem, aggregateRating |
| Product | name | offers, image, description, aggregateRating, brand, sku |
| Article | headline, datePublished, author | dateModified, image, publisher, description |
| BlogPosting | headline, datePublished, author | dateModified, image, publisher, description |
| NewsArticle | headline, datePublished, author | dateModified, image, publisher |
| BreadcrumbList | itemListElement | -- |
| LocalBusiness | name, address | telephone, openingHours, geo, priceRange, image |
| Event | name, startDate, location | endDate, description, offers, performer, image |
| VideoObject | name, thumbnailUrl, uploadDate | description, duration, contentUrl, embedUrl |
| Review | itemReviewed, author | reviewRating, datePublished |
| Service | name, provider | serviceType, areaServed, offers, description |
| Person | name | url, sameAs, jobTitle, image, worksFor |
| JobPosting | title, datePosted, description, hiringOrganization | validThrough, employmentType, baseSalary |
| Course | name, provider | description, offers |
| ProfilePage | mainEntity | -- |
| ProductGroup | name, variesBy, hasVariant | -- |
| ImageObject | contentUrl | caption, creator, datePublished |
| ContactPage | -- | -- |
| WebPage | name | -- |
| AggregateRating | ratingValue, reviewCount | bestRating, worstRating |
| ItemList | itemListElement | name, description |

## Restricted Types

| Type | Restriction | Since |
|---|---|---|
| FAQPage | Government and healthcare authority sites only. Still provides AI search value on other sites but no Google rich results. | August 2023 |

## Search Feature Changes -- Do Not Treat As Schema.org Deprecations

These types still exist in Schema.org. Changes here refer to Google Search feature support,
eligibility, or presentation changes, not removal from Schema.org itself.

| Type | Status |
|---|---|
| HowTo | Valid Schema.org type. Google reduced HowTo rich result visibility in 2023. |
| FAQPage | Valid Schema.org type. Google restricts FAQ rich results to limited site classes. |
| ClaimReview | Valid Schema.org type. Use when the content genuinely supports fact-check markup requirements. |
| Dataset | Valid Schema.org type. Google still documents dataset structured data. |
| SpecialAnnouncement | Valid Schema.org type. Only use when it matches the page content and supported consumers. |

Avoid calling a type "deprecated" unless Schema.org itself marks it deprecated.

## Recent Additions (2024-2026)

- ProductGroup, ProfilePage, DiscussionForumPosting
- Product Certification markup
- LoyaltyProgram
- ConferenceEvent, PerformingArtsEvent

## Validation Rules

### Required checks

1. `@context` should use the Schema.org HTTPS context. Accept both
   `"https://schema.org"` and `"https://schema.org/"`
2. `@type` must be a valid Schema.org type. If the type is not in this file, check
   whether it is valid before flagging it
3. All required properties for the type must be present
4. No placeholder text: scan for "Lorem", "TODO", "CHANGE", "example.com", "xxx"
5. All URLs must be absolute (start with `https://`)
6. All dates must be ISO 8601: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SS+00:00`
7. Image URLs must be absolute and valid
8. `price` may be a number or text, but keep the representation consistent and pair it
   with `priceCurrency` when used in offers
9. Nested `@type` objects must also be valid types
10. `applicationCategory` for WebApplication/SoftwareApplication should use Google's values:
    - BusinessApplication, DesignApplication, DeveloperApplication, EducationApplication,
      EntertainmentApplication, FinanceApplication, GameApplication, HealthApplication,
      LifestyleApplication, MultimediaApplication, SecurityApplication, UtilitiesApplication

### Common mistakes

- Using `http://schema.org` instead of `https://schema.org`
- Treating Google Search feature changes as Schema.org deprecations
- Relative URLs in `url`, `image`, `logo` fields
- Missing `@type` on nested objects (e.g., an `author` without `"@type": "Person"`)
- Using `FAQPage` on a non-government/healthcare site expecting rich results
- Numbers instead of strings for `price`
- Missing `priceCurrency` when `price` is present

### Type selection guide

| Page content | Recommended type(s) |
|---|---|
| Web tool / online app | WebApplication |
| Desktop/mobile software | SoftwareApplication |
| Company homepage | WebSite + Organization |
| Blog post | Article or BlogPosting |
| Product for sale | Product with Offer |
| Service business | Service + Organization |
| Multi-page site navigation | BreadcrumbList |
| Person / team member | Person |
| Event listing | Event |
| Job listing | JobPosting |
| FAQ section | FAQPage (gov/health only for rich results) |
