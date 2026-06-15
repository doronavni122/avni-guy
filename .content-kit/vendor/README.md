# content-seo-kit

Private **Content & SEO Kit** — same research, article, SEO, and linking quality for every project and subject. Stack-specific wiring lives in `content-pipeline.profile.json` only.

## What this is

| Layer | Location | Updated by |
|-------|----------|------------|
| Quality law | `standards/`, `commends/`, `validators/` | Kit repo |
| Sync policy | `MANIFEST.json` | Kit repo |
| Project wiring | `content-pipeline.profile.json` | You (template-once) |
| Live content & app code | `content/`, `lib/`, `app/` | You — **never** kit |

## Install into a project

```bash
git clone git@github.com:doronavni122/content-seo-kit.git /tmp/content-seo-kit
/tmp/content-seo-kit/scripts/install.sh /path/to/your-project next-guide --approve
```

Creates:

- `.content-kit/vendor/` — pinned kit copy (git repo)
- `.content-kit/kit.lock.json` — checksums + policies
- `.commends/TODO_*` — managed pipeline files
- `scripts/content-kit-sync.mjs` — update wrapper
- `content-pipeline.profile.json` — only if missing

Dry-run first: omit `--approve` on install.

## Update kit (safe)

```bash
cd /path/to/your-project
node scripts/content-kit-sync.mjs check    # drift?
node scripts/content-kit-sync.mjs diff     # preview changes
node scripts/content-kit-sync.mjs update --approve
```

Or refresh vendor from GitHub:

```bash
.content-kit/vendor/scripts/pull-kit.sh . --approve
```

### Policies (`MANIFEST.json`)

- **managed** — kit-owned; `update --approve` overwrites unless you edited locally (then blocked)
- **template-once** — copied on init if missing; kit changes need `--accept-template <id>`
- **optional** — copy if missing only (e.g. adapter snippets)

### Local edits to managed files

If you changed a managed file, sync blocks overwrite. Options:

1. Move customization to profile / project code (preferred)
2. `--force-managed <manifest-id>` after reviewing diff

## Profiles

- `default` — neutral en-US `/blog/` template
- `next-guide` — Next.js App Router `/guide/*`
- `astro-blog` — Astro content collection
- `wordpress` — theme content + generic registry
- `static-docs` — mkdocs-style docs (no registry adapter)
- `research-only` — drafts only, no Phase 7

## Validators (v1.3.1)

| Script | Purpose |
|--------|---------|
| `check-research.mjs` | Gate R1 — word count, citations, domain-study sections |
| `check-article.mjs` | Gate A6 — nested `seo:` frontmatter, links, FAQ, manifest |
| `check-batch.mjs` | Phase 6 — all manifest subjects (`articleDraftDir`) |
| `check-publish.mjs` | Gate P — paths, registry, sitemap slugs, optional `buildCommand` |
| `run-gate.mjs` | `R1` \| `A6` \| `P` wrapper |

**Profile fields (v1.3.1):** `researchDir`, `articleDraftDir`, `buildCommand`, heading aliases (`tldrHeadingAliases`, `faqHeadingAliases`, `linksSectionHeadingAliases`).

**Frontmatter:** nested `seo:` block required (see `templates/article-frontmatter.md`).

```bash
node .content-kit/validators/check-batch.mjs
node .content-kit/validators/run-gate.mjs P --post-publish
```

## Version

See `VERSION` (semver). Projects lock version in `.content-kit/kit.lock.json`.

## New project from template

Use the companion starter (GitHub template):

**https://github.com/doronavni122/content-seo-starter**

```bash
gh repo create my-site --template doronavni122/content-seo-starter --private
cd my-site && ./scripts/bootstrap.sh next-guide --approve
```

Or install into an existing repo — see **Install into a project** above.
