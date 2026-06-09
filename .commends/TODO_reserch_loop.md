# Research loop — domain studies (`reserch/`)

**Purpose:** Run **Phase 0 (research setup)** and **Phases 1–1b** only: full domain research studies, **≥2000 words**, NOT SERP/SEO keyword reports.  
**Not SEO keyword research:** subjects are **domain/topic ideas** only (methods, science, market, health, economics, product domains).  
**Prerequisite for:** `.commends/TODO_articles_loop.md` (requires completed `reserch/NNNN_*.md` files).  
**Agent rule:** Treat this file as explicit user instructions (`.commends/` = execute every step). Do not skip delegations where marked.

---

## INPUTS (substitute before starting)

| Placeholder | Meaning |
|-------------|---------|
| `<SUBJECT_1>` … `<SUBJECT_N>` | N research subjects (language per project SSOT) |
| `<N>` | Count of subjects |
| `<PROJECT_LANGUAGE>` | Primary reader language (from SSOT or user) |
| `<ARTICLE_SLUG_i>` | URL slug for subject *i* — keyword-based, **no** `0001`-style prefix (set in Phase 0 for manifest) |
| `<CONTENT_TYPE>` | Published page kind per project (e.g. guide, blog, doc, article) — naming only |
| `<PUBLISH_PATH_PREFIX>` | Live URL prefix (e.g. `/blog/`, `/guide/`) — **no** numeric draft prefix in live URLs |

**Numbering convention (draft files only):**
- Research: `reserch/NNNN_<subject_label>.md`
- **Live URLs (later):** `<PUBLISH_PATH_PREFIX><ARTICLE_SLUG_i>` — never `0001`, `0002`, etc.

**Research checklist (read-only):** map applicable sections from repo-root `TODO_reserch.md` into each study document.

---

## PHASE 0 — Coordinator setup (parent agent)

- [ ] Read project structure SSOT (e.g. `.cursor/rules/ssot-repo-structure.mdc`, `SSOT.md`, `AGENTS.md`) — discover `<CONTENT_ROOT>`, publish route pattern, content registry
- [ ] Read product law / ADRs only if changing behavior beyond content publish
- [ ] Resolve from user + SSOT: `<CONTENT_TYPE>`, `<PUBLISH_PATH_PREFIX>`, `<PROJECT_LANGUAGE>`
- [ ] Create `reserch/` if missing (do **not** create `reserch-based-articles/` yet — articles loop)
- [ ] Assign fixed `NNNN` prefix per subject (`0001`…`000N`) — one prefix per agent to avoid collisions
- [ ] Build **research manifest**: for each *i*, record `<SUBJECT_i>`, `NNNN`, `<ARTICLE_SLUG_i>`, `<subject_label>` (filename-safe)
- [ ] Plan **N parallel subagents** for Phase 1 (one subject per agent)

---

## PHASE 1 — Full research studies (`reserch/`)

**Intent:** domain research studies, **≥2000 words**, NOT SERP/SEO keyword reports.

### Per subject `<SUBJECT_i>` — delegate **one subagent** (parallel batch of N)

Agent steps **in order:**

- [ ] Read repo-root `TODO_reserch.md` (read-only) — map applicable checklist sections into document
- [ ] Online research via available tools (web search, academic/industry sources — use project-approved tools; fallback if primary fails)
- [ ] Write **overwrite** `reserch/NNNN_<subject_label>.md`:
  - [ ] `<PROJECT_LANGUAGE>`, academic/domain tone
  - [ ] ≥2000 words
  - [ ] Research question, SMART objectives, hypotheses, methodology, findings, limitations, sources (20+ citations)
  - [ ] **No** SERP ranking / competitor SEO / keyword volume focus
- [ ] Read `.commends/TODO_confidance_full_95.md` and refine until confidence **>0.95**
- [ ] Do **not** commit unless user asks

### Parent after Phase 1

- [ ] Verify all N files exist under `reserch/`
- [ ] Spot-check word count ≥2000 per file
- [ ] If any file is SEO-style not domain-study → re-delegate rewrite (Phase 1b)

---

## PHASE 1b — Research rewrite correction (if first pass was wrong type)

**Trigger:** user clarifies research must be full study, not keyword SEO.

### Per subject — delegate **one subagent** (parallel N)

- [ ] Read repo-root `TODO_reserch.md` (read-only)
- [ ] **Overwrite** `reserch/NNNN_<subject_label>.md` as full domain study (≥2000 words, checklist coverage, 20+ sources)
- [ ] Apply `.commends/TODO_confidance_full_95.md`
- [ ] No commit unless asked

---

## DELEGATION MAP (research loop)

| Phase | Parallel agents | Typical subagent type |
|-------|-----------------|------------------------|
| 0 Setup | 1 | parent agent |
| 1 Research | N | web-researcher / generalPurpose |
| 1b Rewrite | N (if needed) | generalPurpose |

---

## INVOCATION PROMPT TEMPLATE

```
Subjects (N=<N>):
Content type: <CONTENT_TYPE>
Publish prefix: <PUBLISH_PATH_PREFIX>
Language: <PROJECT_LANGUAGE>
1. <SUBJECT_1> → slug: <ARTICLE_SLUG_1>
2. <SUBJECT_2> → slug: <ARTICLE_SLUG_2>
…

Execute @.commends/TODO_reserch_loop.md end-to-end.
Subjects are domain topics only — not SEO SERP research.
Delegate one subagent per subject for Phase 1.
When done, hand off manifest to @.commends/TODO_articles_loop.md.
```

---

## DONE CRITERIA (research loop)

- [ ] N files in `reserch/` (≥2000 words, domain studies, 20+ sources)
- [ ] Research manifest complete: `NNNN`, `<SUBJECT_i>`, `<ARTICLE_SLUG_i>`, `<subject_label>` per subject
- [ ] `reserch/` originals untouched by articles-loop edits
- [ ] No commit unless user asked
