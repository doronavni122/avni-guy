# 057 home BreadcrumbList JSON-LD

ADR: seo , kit-structured-data ssot-repo-structure

## goal
Home `@graph` includes BreadcrumbList consistent with other hubs (F09).

## todos
- [ ] Add `buildBreadcrumbSchema([{ name: 'דף הבית', path: '/' }])` to `src/app/page.tsx` extraJsonLd
- [ ] verify build+dev

## DoD
home JSON-LD @graph includes BreadcrumbList with home ListItem.
