**read only file**

# Confidence gate — lock phase end-to-end (>0.95)

Confirm nothing is missing to fully lock the current phase before proceeding. Adjust / add until every critical item below is **true** with confidence **> 0.95**.

Do **not** edit this file to tick boxes; perform the work and report pass/fail in the agent response.

---

## When to run

| Checkpoint | Before |
|------------|--------|
| **Gate R1** | Phase 2 (article copy) |
| **Gate A6** | Phase 7 (publish) |
| **Gate P** | Pipeline / plan close-out |

---

## Gate R1 — Research study (`reserch/NNNN_*.md`)

- [ ] File exists; **≥ 2000 words** (run `node .content-kit/validators/check-research.mjs <file>`)
- [ ] **≥ 20** unique source URLs/references
- [ ] Document is a **domain study** (methods, evidence, limitations) — **not** a SERP/keyword-volume report
- [ ] Required sections present per `.commends/TODO_reserch.md` mapping used for this subject
- [ ] Research question, SMART objectives, hypotheses, methodology, findings, limitations, sources
- [ ] No fabricated citations; every URL cited was fetched or search-verified in this session
- [ ] Subject label and `NNNN` match subject manifest (if manifest exists)
- [ ] Language matches `content-pipeline.profile.json` → `language`
- [ ] `.commends/TODO_suggest.md` applied if user requested 2026 best-practice suggestions

**Fail if:** any item above is false or unverified.

---

## Gate A6 — Article draft (`reserch-based-articles/NNNN_*.md`)

- [ ] Validator pass: `node .content-kit/validators/check-article.mjs <file> [--manifest subject-manifest.json --subject-nnnn NNNN]`
- [ ] YAML `seo` block complete per `schemas/article-frontmatter.schema.json`
- [ ] TL;DR (3–6 bullets + CTA to profile `primaryCta`)
- [ ] FAQ section (`faqHeading`) with **5–6** Q&As sourced from body content
- [ ] **0** guillemets `«` `»` in live-bound text
- [ ] **0** bottom link-list sections; links embedded in **≥ 4** H2 body sections
- [ ] Exactly **1** homepage link; all `internalLinkManifest` paths present in body
- [ ] **0** URLs matching profile `linkDenylist`
- [ ] `reserch/` original untouched; article is superset-minus-meta only
- [ ] Phase 6 embed-all-links audit completed for this file

**Fail if:** validator fails or Phase 5–6 rules in `standards/internal-linking.md` not met.

---

## Gate P — Publish & code (Phase 7) — line-by-line SSOT validation

Run: `node .content-kit/validators/check-publish.mjs [--manifest subject-manifest.json] [--pre-publish|--post-publish]`

`--post-publish` runs optional `profile.buildCommand` (e.g. `pnpm build`) when set.

Or: `node .content-kit/validators/run-gate.mjs P [--manifest subject-manifest.json] [--post-publish]`

Adapted from workspace code confidence gate: when the pipeline cites **code or paths** as truth, validate each claim against the **current tree**.

- [ ] Read `content-pipeline.profile.json` — every path exists:
  - `contentRoot`, `contentRegistry`, `markdownLoader`, `publishRoute`, `sitemapBuilder` (if set)
- [ ] Slug in manifest matches registry entry: `publishPrefix` + `slug` — **no** `0001` in live URL
- [ ] Copy target `contentRoot/<contentFile>` does not exist yet OR user explicitly approved overwrite
- [ ] Registry lists: slug, contentFile, title, description, navLabel, breadcrumbLabel, dates
- [ ] Sitemap builder includes new publish paths
- [ ] Nav includes `navSectionLabel` entries if site exposes this content type
- [ ] `pnpm build` (or `profile.buildCommand`) succeeds when `--post-publish` and buildCommand set
- [ ] No plan/pipeline close-out while factual path or behavior claims contradict the repo

**Fail if:** any cited file path missing, slug not registered, or build fails.

---

## Gate P — Pipeline close-out (all N subjects)

- [ ] N files in `reserch/` passed Gate R1
- [ ] N files in `reserch-based-articles/` passed Gate A6
- [ ] N files in `contentRoot` (if Phase 7 run)
- [ ] `node scripts/content-kit-sync.mjs check` — kit not drifted (or documented exception)
- [ ] Done criteria in `.commends/TODO_article_reserch.md` satisfied

---

## Reporting (required)

In agent response, include:

```
CONFIDENCE_GATE: PASS|FAIL
gate: R1|A6|P
confidence: 0.00-1.00
gaps: [list or none]
```

Do not proceed to the next phase on **FAIL**. Fix gaps, re-run gate, then continue.
