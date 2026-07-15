# podcast-newsletter-archive — ops runbook (no fake publishes)

ADR: none , cite SSOT.md

##todos
- [x] Ship dense ops runbook for owned podcast feeds + newsletter public archive
- [x] Encode HE name in show title → `/about/` + on-site enriched RSS endpoints
- [x] Mark agentic complete via runbook; leave live Apple/Spotify/Google + newsletter publishes unchecked

## Goal
Close maps-005 items `podcast-owned-feeds` and `newsletter-public-archive` as **agentic/ops-runbook** work. Depends on **richer-rss** (DONE on main: `GET /rss.xml` with author, `content:encoded`, `media:content`). Do **not** invent or fake live podcast/newsletter publishes or platform URLs.

## Exclusive files
- `notes/implementations/podcast-newsletter-archive_ops_runbook.txt`
- this plan + matching brief under `notes/implementations/`

## Out of scope
- Editing `src/app/rss.xml/route.ts` (richer-rss already shipped)
- Building on-site podcast hosting / newsletter CMS in this scope
- Fake Apple Podcasts / Spotify / Google Podcasts / Beehiiv / Substack “already live” URLs

## Verify
Ops artifact only — skip `pnpm build` / `pnpm dev`. Gate = runbook present, machine-parseable, HE show title + `/about/` + RSS endpoint contract exact; live publish checklists unchecked.
