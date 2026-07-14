# Plan: richer-rss — enrich /rss.xml

ADR: none , (cite SSOT.md)

## Goal

Enrich `GET /rss.xml` with per-item author, `content:encoded`, and `media:content` (Media RSS) for Bing/Feedly/AI ingest. Keep existing fields; valid XML; green `pnpm build`.

## SSOT

- `SSOT.md` §A–B (static Next, MDX blog, force-static)
- Existing feed: `src/app/rss.xml/route.ts`
- Post shape: `src/lib/content/schema.ts` (`content`, `images[]`, title/description)
- Author identity aligned with blog pages: `גיא אבני` + `/about/`

## Exclusive files

- `src/app/rss.xml/route.ts` (helpers may live in-file)

## Non-goals

- Do not edit HomePage, about, site-nav, sitemap, main-page-heroes
- No schema field changes
- No new npm dependencies

## Design

1. Channel/root namespaces:
   - `xmlns:content="http://purl.org/rss/1.0/modules/content/"`
   - `xmlns:media="http://search.yahoo.com/mrss/"`
   - `xmlns:dc="http://purl.org/dc/elements/1.1/"`
2. Per item:
   - `<dc:creator>` + RSS `<author>` (email + name when email available)
   - `<content:encoded><![CDATA[...HTML...]]></content:encoded>` from MDX body via lightweight markdown→HTML (headings, paragraphs, lists, links, bold); strip dangerous tags; no script
   - `<media:content url="ABS" medium="image" type="…"/>` from first `post.data.images[0]` absolutized to `SITE_URL`
3. Keep: title, description, link, guid, pubDate
4. Error logging: keep `console.error('[rss.xml] …')` on GET failure; log converter/image URL failures per-item without aborting the feed

## Verify

- `pnpm build` (and `build:ci` smoke if time)
- Spot-check RSS XML well-formed; CDATA closed; namespaces present

## Commits (atomic)

1. add-plan-rss-enrich-feed-r1
2. enrich-rss-author-content-media
3. mark-scope-richer-rss-done (+ brief)
