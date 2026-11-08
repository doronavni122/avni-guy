# Plan: sameas-dual-domain-clarity

ADR: none , (Person.sameAs entity graph; SSOT.md SEO lib)

## Decision

Keep `https://guyavni.co.il/` in Person.sameAs — same legal person/office conversion property (env default `PERSON_OFFICE_SITE_URL` unset → office sameAs). Clarify visible footer: avniguy = content authority; guyavni = office conversion for same attorney. Remove duplicate footer Properties block.

## Changes

1. `Footer.tsx` — single Properties block; unambiguous Hebrew copy (same person; roles differ)
2. Confirm `schema-person.ts` DEFAULT_OFFICE_SAMEAS retained; opt-out via empty `PERSON_OFFICE_SITE_URL` still works
3. No invented Bar/Wikidata URLs

## Verify

- Footer renders one dual-domain explanation
- Build + destuff
- validate_true: same person keep sameAs = PASS

## VALIDATE_TRUE

| Claim | Evidence | Conf |
|-------|----------|------|
| sameAs guyavni in code | schema-person DEFAULT_OFFICE_SAMEAS | 0.99 |
| Footer dual messaging + duplicate | Footer.tsx lines 74–93 duplicate | 0.99 |
| Same legal person | site product: office conversion for גיא אבני | 0.96 |

**Outcome:** PASS conf>0.95
