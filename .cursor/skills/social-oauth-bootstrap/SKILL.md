---
name: social-oauth-bootstrap
description: >-
  Headed Playwright OAuth bootstrap: owner logs into Gmail in a persistent
  Chrome window, then the CLI registers developer apps where needed and writes
  social posting keys to .env.local. Use when the user says get social tokens,
  oauth bootstrap, register social apps, playwright oauth, login gmail social
  keys, or close variants.
---

# Social OAuth bootstrap (local only)

Code SSOT: `scripts/tools/social-oauth.mjs` + `scripts/social-oauth/`. Do not paste bash from this file. Do not add app dependencies. Do not commit `.env.local` or `.playwright/`. Do not use the Cursor IDE browser for this flow (isolated profile; Gmail session will not carry). Do not scrape tokens from dashboards — official token endpoints only.

## Triggers

`get social tokens` · `oauth bootstrap` · `register social apps` · `playwright oauth` · `login gmail social keys` · close variants.

## Run

```bash
pnpm social:oauth --login
pnpm social:oauth
pnpm social:oauth --network youtube
pnpm social:oauth --network x,linkedin,meta
pnpm social:oauth --dry-run
```

Default: headed persistent Chrome at `.playwright/social-oauth-profile`, wait for Gmail inbox, then YouTube → X → LinkedIn → Meta (Facebook Page + Instagram).

Redirect URI to register on every developer portal: `http://127.0.0.1:8788/callback`

Client JSON drop (if the portal wizard cannot finish unattended): `.playwright/oauth-clients/{youtube,x,linkedin,meta}.json` as `{"client_id","client_secret"}`. YouTube also accepts a Google Cloud `client_secret_*.json` in `~/Downloads`.

## Agent steps

1. Tell the owner a headed Chrome window will open. They sign into the site-owner Gmail (and stay in that window for Google/CAPTCHA/Allow).
2. `pnpm social:oauth --login` if they are not signed in yet.
3. `pnpm social:oauth` (or `--network` as given).
4. On portal wait: keep the window in front; if asked, create the app named `avniguy-social`, paste the loopback redirect, then drop the client JSON as above. Do not ask for a separate Approve click in chat.
5. Read stdout `{runDir,table,creds}`. `creds` is present/missing only — never print secret values.
6. When table is ok: `pnpm social:posts --dry-run`. Live `pnpm social:posts` only after the owner confirms keys.

## Networks

| Connector | Writes |
|---|---|
| youtube | `YOUTUBE_CLIENT_ID` `YOUTUBE_CLIENT_SECRET` `YOUTUBE_REFRESH_TOKEN` |
| x | `X_CLIENT_ID` `X_CLIENT_SECRET` `X_USER_ACCESS_TOKEN` `X_REFRESH_TOKEN` |
| linkedin | `LINKEDIN_CLIENT_ID` `LINKEDIN_CLIENT_SECRET` `LINKEDIN_ACCESS_TOKEN` `LINKEDIN_AUTHOR_URN` |
| meta | `FACEBOOK_APP_ID` `FACEBOOK_APP_SECRET` `FACEBOOK_PAGE_ID` `FACEBOOK_PAGE_ACCESS_TOKEN` `IG_USER_ID` `IG_ACCESS_TOKEN` `PLAYWRIGHT_STATE_FACEBOOK` |

Facebook Graph cannot post to a personal profile. Meta connector expects a Page; it opens Page-create if none. Instagram must be Professional and linked to that Page.

X user tokens expire in ~2 hours; `publish/x.mjs` refreshes with `X_REFRESH_TOKEN` when present.
