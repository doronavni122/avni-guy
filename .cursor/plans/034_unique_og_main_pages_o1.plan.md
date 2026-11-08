# Plan: unique-og-main-pages

ADR: none , (unique-site-images.mdc)

## Goal

Unique OG image per remaining main hub; stop shared `og-law-fallback-photo-1.jpg` on hubs. Optimize WebP/AVIF siblings.

## Assets

`public/images/og/og-<hub>-*-macro.jpg` (unique filenames; not reused on homepage slots).

## Wiring

SSOT map `src/lib/seo/main-page-og.ts` → each hub `buildPageMetadata({ image })`.

Hubs: services, contact, categories, tags, sheelot, media, editorial-policy, guy-avni, blog archive.

Keep home/about existing unique OGs. Fallback remains for unknown paths only.

## VALIDATE_TRUE

| Claim | Evidence | Conf |
|-------|----------|------|
| Fallback used on hubs | 006 P1.4 + code PAGE_OG_IMAGE | 0.99 |
| Unique files after | public/images/og/* distinct | 0.99 |

**Outcome:** PASS conf>0.95
