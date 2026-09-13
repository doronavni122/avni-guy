***READ ONLY FILE***
task: Project onboarding checklist for agents (avni-guy / avniguy.co.il).

Follow the steps:

- [ ] Read and confirm understanding of project rules under `.cursor/rules/` (start with `META-RULES.txt`, `ssot-repo-structure.mdc`, `enforcement/atomic-change-loging.mdc`).
- [ ] Read `AGENTS.md` and `workspace.config.json` (repoName `avni-guy`, appRoot `.`, prodUrl `https://avniguy.co.il`, previewUrl `https://avni-guy.vercel.app`, packageManager `pnpm`, productSsotDoc `SSOT.md`).
- [ ] Read and internalize: `enforcement/atomic-change-loging.mdc` (`task_graph.log` + immediate atomic commits; one commit = one new log line; no commits to default `main`).
- [ ] Read product context (skip a path if the file is absent):
  - `SSOT.md` (authoritative product SSOT; `END-GOAL-PROJECT.md` is not used)
  - `notes/implementations/implementaion_progress_checklist.md`
  - `PROJECT_USER_JOURNEY_STEPS.md` (configured in `workspace.config.json`; create only when the owner asks)
  - `content-pipeline.profile.json` (Content SEO Kit v1.3.1: Hebrew `he-IL`, brand גיא אבני, `contentRoot` `src/content/blog/`, `publishPrefix` `/blog/`)
- [ ] Read last 10–20 lines of `task_graph.log` for recent intent.
- [ ] Read latest plan-tied brief under `notes/implementations/*_brief.txt` if any.
- [ ] Confirm this product: Hebrew-first Next.js 15+ App Router MDX site (SSG, `force-static`); published articles in `src/content/blog/`; schema `src/lib/content/schema.ts`; unique images per `unique-site-images.mdc`; deploy Vercel; local `pnpm run dev` → http://localhost:3001/; CMS `pnpm run cms:dev`.
- [ ] When the task is research / draft / publish: `.cursor/skills/content-seo-pipeline/SKILL.md` and `.commends/TODO_article_reserch.md`.
- [ ] Confirm branch / sync policy with repo owner (`feature/` `bugfix/` `hotfix/` `release/`; no direct commits to `main`).
