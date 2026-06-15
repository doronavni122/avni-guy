# Structured data standard (kit law)

## Minimum JSON-LD per published article

- `@type`: `Article` or `TechArticle`
- `headline`: matches stripped `seo.title`
- `description`: matches stripped `seo.description`
- `datePublished`, `dateModified`: from registry
- `inLanguage`: from profile `language` (BCP 47, e.g. `he-IL`, `en-US`)
- `author` / `publisher`: Organization from profile `brand`
- `mainEntityOfPage`: canonical page URL

## BreadcrumbList

- Home → content index (if exists) → article title

## FAQ

If FAQ section is visible on page, prefer `FAQPage` schema when the stack supports it.

Implementation path is stack-specific (see `profiles/*.profile.json` → `structuredDataModule`).
