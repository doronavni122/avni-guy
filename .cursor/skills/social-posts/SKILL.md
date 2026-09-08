---
name: social-posts
description: >-
  Creates Hebrew SEO-derived media and copy and publishes unattended to this
  site's live social profiles (X, Instagram, YouTube, LinkedIn, Facebook). Use
  when the user says do social posts, post to social, publish social, share on
  social, social media posts, or close variants.
---

# Unattended social posts (avniguy.co.il)

Code SSOT: `scripts/tools/social-posts.mjs` + `scripts/social-posts/`. Do not paste bash from this file. Do not add app dependencies. Do not commit secrets. Do not write files under `public/images/`.

## Triggers

`do social posts` · `post to social` · `publish social` · `share on social` · `social media posts` · close variants.

## Run (no human approve in the happy path)

```bash
pnpm social:posts --dry-run
pnpm social:posts --slug tenant-rights-israel
pnpm social:posts --homepage
pnpm social:posts --url https://avniguy.co.il/blog/tenant-rights-israel/
```

Default (no flags): newest `src/content/blog/*.mdx` by `pubDate`. Live post when tokens exist and `SOCIAL_POSTS_DRY_RUN` is not `1`. One-time OAuth bootstrap: skill `social-oauth-bootstrap` / `pnpm social:oauth` (headed persistent Chrome; owner Gmail login).

Env keys: `.env.example` (local `.env.local`). Not in `src/env.ts`.

## Agent steps

1. `pnpm social:posts` with the user slug/URL if given, else default.
2. Read stdout summary table + `$RUN_DIR/run.jsonl`.
3. Missing creds or Facebook personal-profile skip: already logged; continue. Do not ask for Approve clicks.
4. If the CLI fails to start: `pnpm test` then fix tests/code; do not rewrite this skill as a second implementation.

## Networks

Footer SSOT `src/lib/nav/site-social.ts` plus live `sameAs` (LinkedIn, Facebook). Facebook Graph needs a Page token; the live URL is a profile — CLI skips Graph without `FACEBOOK_PAGE_ID` / `FACEBOOK_PAGE_ACCESS_TOKEN` or `PLAYWRIGHT_STATE_FACEBOOK`.
