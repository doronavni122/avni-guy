# Research study standard (kit law)

Applies to every subject. Subject changes topics only — not these bars.

## Minimums

- Language: project profile `language`
- Length: **≥ 2000 words**
- Sources: **≥ 20** unique citations (URLs or formal references)
- Type: domain / scientific / market study — **not** SERP keyword ranking reports
- Confidence gate: **Gate R1** in `.commends/TODO_confidance_full_95.md` → **> 0.95** before Phase 2 (see `standards/confidence-gate.md`)

## Required sections

1. Research question (focused, researchable)
2. SMART objectives (primary + secondary)
3. Hypotheses or exploratory aims
4. Background + literature gap
5. Methodology (design, data sources, inclusion/exclusion)
6. Findings (evidence-based)
7. Limitations
8. Sources list (20+)

## Draft location

`reserch/NNNN_<subject_label>.md` — numeric prefix **draft only**, never in live URL.

## Validator

Run: `node .content-kit/validators/check-research.mjs reserch/<file>.md`
