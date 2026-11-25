# 073 org logo unique raster (F03 reopen)

ADR: seo , kit-structured-data

## goal
Reopen org-logo-raster-jsonld: Organization.logo must use a **unique** raster URL (not OG fallback / credential photo), with width+height.

## todos
- [x] Rasterize brand SVG → unique shared JPEG path
- [x] Point BRAND_ORG_LOGO_RASTER_PATH + IMAGE_OBJECT_DIMENSIONS at new asset
- [ ] optimize-images WebP/AVIF siblings
- [ ] verify build/dev + JSON-LD logo URL

## DoD
logo ImageObject URL is unique placement; width+height present; SVG UI unchanged.
