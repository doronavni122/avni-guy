# SEO metadata standard (kit law)

## Frontmatter (`seo` block)

| Field | Rule |
|-------|------|
| `title` | `{primary keyword}: {benefit} \| {brand}` — brand from profile |
| `description` | 120–165 chars; primary keyword once; soft CTA |
| `slug` | `{publishPrefix}{slug}` — lowercase, hyphens, **no** `0001` numeric prefix |
| `canonical` | Same as `slug` (absolute URL at render if app requires) |
| `keywords` | 5–12 terms from subject manifest |
| `dateModified` | ISO `YYYY-MM-DD` on every publish pass |

## Registry (Phase 7)

Every live slug must exist in project content registry SSOT with: `slug`, `contentFile`, `title`, `description`, `navLabel`, `breadcrumbLabel`, `datePublished`, `dateModified`.

## Sitemap & nav

- Sitemap includes all `publishPrefix + slug` paths
- Nav lists content type if site exposes it (`navSectionLabel` from profile)

## Live render

Metadata for HTML `<title>`, Open Graph, Twitter, JSON-LD must match registry/frontmatter after any strip/normalize helpers (e.g. guillemets).
