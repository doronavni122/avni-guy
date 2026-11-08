# Plan: www-apex-301 edge redirect

ADR: none , (edge host canonicalization; SSOT.md deploy surface)

## Goal

Canonicalize host: `www.avniguy.co.il` → apex `avniguy.co.il` with permanent redirect (301/308). Apex remains 200.

## Root cause (pre-impl)

- `vercel.json` already had host-conditioned permanent redirect for `www.avniguy.co.il`.
- Live still returned **200** on both hosts — project domain `www.avniguy.co.il` had `redirect: null` (both hosts were production aliases).
- Fix: Vercel project-domain redirect + in-repo middleware belt.

## Changes

1. **Platform (immediate DoD):** PATCH project domain `www.avniguy.co.il` → `redirect=avniguy.co.il`, `redirectStatusCode=308`.
2. **In-repo:** Extend `src/middleware.ts` to 308 www→apex (preserve path/query); broaden matcher so host check runs sitewide (keep legacy blog slug redirects).
3. Keep existing `vercel.json` www redirect as third layer.

## Non-goals

- Changing apex content
- Removing www DNS record (must remain for redirect source)
- Touching guyavni.co.il

## Verify

- `curl -sI https://www.avniguy.co.il/` → 301/308 Location apex
- `curl -sI https://avniguy.co.il/` → 200
- `pnpm build` + `pnpm run dev` :3001

## VALIDATE_TRUE

| Claim | Evidence | Conf |
|-------|----------|------|
| Dual 200 was live finding | 006 P0.1 + pre-fix curl 200/200 | 0.99 |
| Domain redirect null | list_project_domains www.redirect=null | 0.99 |
| Post-fix www 308 | curl Location https://avniguy.co.il/ | 0.99 |
| Apex still 200 | curl apex | 0.99 |

**Outcome:** PASS conf>0.95
