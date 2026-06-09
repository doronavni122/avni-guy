# Research subjects → published articles — full pipeline (orchestrator)

**Purpose:** Run end-to-end from a **subject list** to published on-site article pages by chaining two loops.  
**Not SEO keyword research:** subjects are **domain/topic ideas** only (methods, science, market, health, economics, product domains).  
**Project shape:** URL prefix, content folder, nav label, and page type (guide, blog, docs, landing article, etc.) come from **project keywords and repo SSOT** — not from this file.  
**Agent rule:** Treat this file as explicit user instructions (`.commends/` = execute every step). Do not skip delegations where marked.

**Loop files (execute in order):**
1. `.commends/TODO_reserch_loop.md` — Phases 0 (research setup), 1, 1b → `reserch/`
2. `.commends/TODO_articles_loop.md` — Phases 0 (articles setup), 2–8 → `reserch-based-articles/` → live

**Read-only research checklist:** repo-root `TODO_reserch.md` (mapped into each study; do not edit).

---

## INPUTS (substitute before starting)

| Placeholder | Meaning |
|-------------|---------|
| `<SUBJECT_1>` … `<SUBJECT_N>` | N research/article subjects (language per project SSOT) |
| `<N>` | Count of subjects |
| `<DATE>` | ISO date for frontmatter (`YYYY-MM-DD`) |
| `<SITE_BRAND>` | Brand name in titles |
| `<SITE_DOMAIN>` | Production origin (e.g. `https://www.example.com`) |
| `<PRIMARY_CTA_PATH>` | Primary conversion path (e.g. `/`, `/#quote`, `/contact/`) |
| `<PRIMARY_SERVICE_ANCHOR>` | Homepage or primary CTA link anchor text |
| `<CONTENT_TYPE>` | Published page kind per project (e.g. guide, blog, doc, article) — drives naming only |
| `<PUBLISH_PATH_PREFIX>` | Live URL prefix (e.g. `/blog/`, `/guide/`, `/docs/`) — **no** numeric draft prefix in live URLs |
| `<CONTENT_ROOT>` | Published markdown root (e.g. `src/content/blog/`) — discover from repo SSOT |
| `<ARTICLE_SLUG_i>` | URL slug for subject *i* — keyword-based, **no** `0001`-style prefix |
| `<CONTENT_FILE_i>` | Filename under `<CONTENT_ROOT>` — typically `<ARTICLE_SLUG_i>.md` or `.mdx` |
| `<PROJECT_LANGUAGE>` | Primary reader language (from SSOT or user) |
| `<FAQ_HEADING>` | FAQ section title in `<PROJECT_LANGUAGE>` |
| `<LINKS_SECTION_HEADING>` | Temporary bottom links section title (removed in articles Phase 5) |
| `<NAV_SECTION_LABEL>` | Nav/menu label for this content type (if site has section nav) |
| `<LINK_DENYLIST>` | Outbound link patterns to strip (TLD, domains, competitors) — from project rules |
| `<INTERNAL_LINK_MANIFEST_i>` | Per-article required internal paths (homepage, CTA, siblings, related pages) |

**Numbering convention (draft files only):**
- Research: `reserch/NNNN_<subject_label>.md`
- Articles: `reserch-based-articles/NNNN_<subject_label>.md` (same `NNNN` as research)
- **Live URLs:** `<PUBLISH_PATH_PREFIX><ARTICLE_SLUG_i>` — from subject keyword or agreed slug; **never** `0001`, `0002`, etc.

**Slug rules:**
- Derive from primary subject keyword or project-agreed slug convention
- Lowercase, hyphen-separated, no digits-only segments (unless project SSOT says otherwise)
- Set in YAML `seo.slug` and `seo.canonical` as `<PUBLISH_PATH_PREFIX><ARTICLE_SLUG_i>`
- Register slug in project content registry / sitemap SSOT

**Optional pre-step (outside this pipeline):** if user asks for SEO inventory, list keywords from project SSOT — do not confuse with domain research subjects.

---

## EXECUTION ORDER

### Step 1 — Research loop

Execute **all** steps in `.commends/TODO_reserch_loop.md`:
- Phase 0 (research coordinator setup)
- Phase 1 (full domain studies)
- Phase 1b (rewrite if needed)

**Handoff:** research manifest with `NNNN`, `<SUBJECT_i>`, `<ARTICLE_SLUG_i>`, `<subject_label>` for each subject.

### Step 2 — Articles loop

Execute **all** steps in `.commends/TODO_articles_loop.md`:
- Phase 0 (articles coordinator setup — requires completed `reserch/`)
- Phases 2–8 (reader copy → SEO → links → audit → publish → deploy if asked)

---

## DELEGATION MAP (full pipeline)

| Phase | Loop file | Parallel agents | Typical subagent type |
|-------|-----------|-----------------|------------------------|
| 0 Research setup | reserch_loop | 1 | parent agent |
| 1 Research | reserch_loop | N | web-researcher / generalPurpose |
| 1b Rewrite | reserch_loop | N (if needed) | generalPurpose |
| 0 Articles setup | articles_loop | 1 | parent agent |
| 2 Articles | articles_loop | N | generalPurpose |
| 3 SEO blocks | articles_loop | N | generalPurpose |
| 4 Titles/dash | articles_loop | N | generalPurpose |
| 5 Links/sources | articles_loop | N | generalPurpose |
| 6 Embed audit | articles_loop | 1 | generalPurpose |
| 7 Publish | articles_loop | 1 | parent agent |
| 8 Deploy | articles_loop | 1 | parent agent |

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

Execute @.commends/TODO_article_reserch.md end-to-end.
Subjects are domain topics only — not SEO SERP research.
Delegate one subagent per subject for research (Phase 1) and articles (Phases 2–5).
Run embed audit and publish; commit/deploy only if I ask.
```

---

## DONE CRITERIA (full pipeline)

- [ ] N files in `reserch/` (≥2000 words, domain studies)
- [ ] N files in `reserch-based-articles/` (SEO blocks, inline links, denylist clean)
- [ ] N files in `<CONTENT_ROOT>/<CONTENT_FILE_i>`
- [ ] All slugs registered in project content registry, sitemap, and nav (if applicable)
- [ ] Production URLs at `<SITE_DOMAIN><PUBLISH_PATH_PREFIX><ARTICLE_SLUG_i>` return 200 after deploy
