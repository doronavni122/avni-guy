# mcp-citation-bait — agent surface (not Google SEO)

ADR: none , (agents/MCP discovery only; no SEO ADR)

##todos
- [x] Validate `public/llms.txt` documents POST/GET `/api/search/` + POST `/api/mcp/`
- [x] Document stdio MCP: `scripts/site-mcp-server.mjs` + `pnpm mcp:site` + `SITE_URL`
- [x] Ship who-is agent card at `public/agent-card.json` (not `/.well-known/` — owned by well-known-person-json)
- [x] Link agent card from `llms.txt`; state surface is for AI/MCP agents, not Google ranking

## closed
Verified 2026-11-23 against live `public/llms.txt` + `public/agent-card.json` (plan 053 AEO pass).

## Goal
Make site MCP/search discoverable for agents; ship static who-is card for "גיא אבני". Explicitly not Google SEO theater.

## Exclusive files
- `public/llms.txt`
- `public/agent-card.json`

## Out of scope
- External MCP registry publish (ops)
- Heroes/nav/rss routes
- `public/.well-known/` (other scope)

## Verify
Static public files only — skip `pnpm build` unless wiring required.
Validate JSON parses; llms.txt lines match live API paths.
