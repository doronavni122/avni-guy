# Confidence gate standard (kit law)

Operator source: `.commends/TODO_confidance_full_95.md` (read-only in projects; kit-managed).

## Threshold

**> 0.95** — every critical checklist item is verified, not assumed.

## Gates

| ID | Trigger | Blocks |
|----|---------|--------|
| **R1** | End of Phase 1 | Phase 2 |
| **A6** | End of Phase 6 | Phase 7 |
| **P** | Phase 7 + pipeline close-out | Commit/deploy |

## Automation

| Gate | Script |
|------|--------|
| R1 (partial) | `node .content-kit/validators/check-research.mjs` |
| A6 (partial) | `node .content-kit/validators/check-article.mjs` |
| P (partial) | `node scripts/content-kit-sync.mjs check` + project build |

Validators do not replace human/agent gate for citations, link manifest, or registry wiring.

## Code SSOT rule

When a plan or Phase 7 step cites file paths or behaviors, validate **line by line** against the current repo (same bar as workspace code confidence gate). Do not close a phase while factual claims contradict the tree.
