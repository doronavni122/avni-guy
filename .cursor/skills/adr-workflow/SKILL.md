---
name: adr-workflow
description: Create and update Architectural Decision Records in ADR/ (root) with deterministic format, ontology, and index. Use when adding or changing ADRs, regenerating adr_index.md, or validating ADR consistency.
---

# ADR Workflow

## Quick reference

- **Dir**: `ADR/` at repo root. **Index**: `ADR/adr_index.md` (generated only). Regenerate index on every new or changed file in ADR/ except when the only change is adr_index.md.
- **Naming**: `NNNN-PILLAR-DESCRIPTIVE-KEBAB.md` (4-digit zero-padded NNNN; pillar from ontology; 2–5 kebab words).
- **Pillars**: auth, database, messaging, deployment, frontend, backend, monitoring, security, storage, caching, api, eventing, observability. Use `pillar-subfeature` only when >3 ADRs on same pillar.

## Workflow (mandatory order)

1. **Read** `ADR/adr_index.md`. If missing, list `ADR/*.md` and infer next NNNN.
2. **Identify pillar** for the current decision.
3. **If** an active ADR exists for that pillar (Status=Accepted, SupersededBy=None):
   - Create a **new** ADR file with next NNNN.
   - Update **only** the old ADR: set `Status: Superseded`, `SupersededBy: <new-NNNN>`.
4. **Else**: Create new ADR with next NNNN; set `Status: Accepted`, `Supersedes: None`, `SupersededBy: None`.
5. **Regenerate** `adr_index.md` (see Index format below).
6. **Commit** all changed ADR files + `adr_index.md` together.

## New ADR template

```markdown
# ADR NNNN – PILLAR Short Title Here

## Status
Accepted

## Date
YYYY-MM-DD

## Context
One-paragraph factual problem. No fluff.

## Decision
Single declarative sentence. Bullet points for justification.

## Consequences
- fact
- fact

## Supersedes
None

## SupersededBy
None
```

## Index format (adr_index.md)

- Scan `ADR/*.md` (exclude `adr_index.md`).
- Parse each file for: ID (from filename NNNN), Pillar, Title (from H1), Status, Date, Supersedes, SupersededBy.
- Output UTF-8 Markdown table, no extra text:

| ID   | Pillar | Title                          | Status     | Date       | Supersedes | SupersededBy |
|------|--------|--------------------------------|------------|------------|------------|--------------|
| 0001 | auth   | Use Keycloak as OIDC Provider  | Superseded | 2026-03-05 | None       | 0005         |
| 0005 | auth   | Migrate to Auth0 OIDC          | Accepted   | 2026-03-12 | 0001       | None         |

- Sort by ID ascending. Index script MUST be idempotent.

## Violation checks (fail if any)

1. Multiple ADRs with Status=Accepted and SupersededBy=None for same pillar.
2. Supersedes or SupersededBy references non-existing ID.
3. In-place edits to Decision, Context, or Consequences (only Status/Supersedes/SupersededBy may change).
4. NNNN duplicate or sequence gap (optional to enforce gap; duplicate is always error).

## Superseding an ADR

- Create new ADR with next NNNN.
- In **old** file: set `Status: Superseded`, `SupersededBy: <new-NNNN>` (no other edits).
- In **new** file: set `Status: Accepted`, `Supersedes: <old-NNNN>`.
- Regenerate index; commit old + new + index together.
