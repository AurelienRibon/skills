# Schema.org Type Registry

Reference for JSON-LD structured data validation and generation.

## Active Types (Google Rich Results)

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

## Deprecated Types -- NEVER implement

| Type | Deprecated Since |
|---|---|
| HowTo | September 2023 |
| SpecialAnnouncement | July 2025 |
| CourseInfo | 2024 |
| EstimatedSalary | 2024 |
| LearningVideo | 2024 |
| ClaimReview | 2025 |
| VehicleListing | 2025 |
| Practice Problem | 2024 |
| Dataset | 2025 |

## Recent Additions (2024-2026)

- ProductGroup, ProfilePage, DiscussionForumPosting
- Product Certification markup
- LoyaltyProgram
- ConferenceEvent, PerformingArtsEvent

## Validation Rules

### Required checks

1. `@context` must be exactly `"https://schema.org"` (HTTPS, no trailing slash)
2. `@type` must match an active type (case-sensitive)
3. All required properties for the type must be present
4. No placeholder text: scan for "Lorem", "TODO", "CHANGE", "example.com", "xxx"
5. All URLs must be absolute (start with `https://`)
6. All dates must be ISO 8601: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SS+00:00`
7. Image URLs must be absolute and valid
8. `price` must be a string number (e.g., `"9.99"` not `9.99`), always paired with `priceCurrency`
9. Nested `@type` objects must also be valid active types
10. `applicationCategory` for WebApplication/SoftwareApplication should use Google's values:
    - BusinessApplication, DesignApplication, DeveloperApplication, EducationApplication,
      EntertainmentApplication, FinanceApplication, GameApplication, HealthApplication,
      LifestyleApplication, MultimediaApplication, SecurityApplication, UtilitiesApplication

### Common mistakes

- Using `http://schema.org` instead of `https://schema.org`
- Using deprecated types (especially HowTo -- very common)
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
