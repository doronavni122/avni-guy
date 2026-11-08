# Plan: home-h2-destuff (+ misui framing)

ADR: none , (home content SEO; unique-site-images.mdc if new image — reuse existing home slot)

## Goal

Rewrite home H2s to topical/people-first without forcing `גיא אבני` into every H2. Keep brand in H1/title/body. Add one `מיסוי מקרקעין` / מס שבח–רכישה framing section linking tax category + sheelot.

## Changes

1. Destuff H2 titles in HomePage, HomeSeoContentSections, FeaturedArticlesGrid, LatestInsightsStrip, FaqAccordion
2. Soften toc authority label in loadHomeData
3. Soften first HOME_SEO_SECTION_DEFS title (H3) brand string
4. Add `#misui-framing` section on home with natural tax language + links

## Verify

- Not all H2s contain brand string
- Misui framing present with links to `/categories/tax/` and `/sheelot/`
- Build + dev

## VALIDATE_TRUE

| Claim | Evidence | Conf |
|-------|----------|------|
| 11/11 H2 brand | 007 | 0.99 |
| home misui exact 0 | 007 | 0.99 |

**Outcome:** PASS conf>0.95
