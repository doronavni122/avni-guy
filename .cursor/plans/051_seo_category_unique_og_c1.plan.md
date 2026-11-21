# Plan: category-og

ADR: none , (no ADR index in repo)

## Goal

The four audited category hubs each use a distinct OG image. Source URL and license stay in code, not on the page.

## VALIDATE_TRUE

| Claim | Evidence | Conf |
|-------|----------|------|
| generateMetadata passed no image, so all categories shared FALLBACK_OG_IMAGE | OWNER-REPORTS/009 finding category-og | 0.99 |

## Sources

- real-estate: https://commons.wikimedia.org/wiki/File:Key_hole.jpg CC BY-SA 4.0
- tax: https://commons.wikimedia.org/wiki/File:Aurora_electronic_calculator_DT210_05.jpg CC BY-SA 3.0
- litigation: https://commons.wikimedia.org/wiki/File:Minneapolis_City_Council_Chambers_gavel_close_up.jpg CC0
- contracts: https://commons.wikimedia.org/wiki/File:Macro_Biro_writing2.jpg CC BY-SA 2.5

**Outcome:** PASS
