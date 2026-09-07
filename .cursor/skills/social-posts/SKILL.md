---
name: social-posts
description: >-
  Creates Hebrew SEO-derived media and copy and publishes unattended to this
  site's live social profiles (X, Instagram, YouTube, LinkedIn, Facebook). Use
  when the user says do social posts, post to social, publish social, share on
  social, social media posts, or close variants.
---

# Unattended social posts (avniguy.co.il)

Run end-to-end with **no human approve/click in the happy path**. One-time credential bootstrap (developer apps, OAuth consent, Playwright `storageState`) is off-run. After creds exist: create assets → post → log → continue on failure.

Do not add npm/app dependencies. Do not write reports. Do not commit secrets. Do not copy social rasters into `public/images/` (unique-site-images law). Work only under `$RUN_DIR`.

## Triggers

`do social posts` · `post to social` · `publish social` · `share on social` · `social media posts` · close variants.

## 0. Run envelope (every step)

```bash
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"
if [ -f .env.local ]; then set -a; . ./.env.local; set +a; fi
if [ -f .env ]; then set -a; . ./.env; set +a; fi
RUN_ID="$(date -u +%Y%m%dT%H%M%SZ)"
RUN_DIR="/tmp/avni-social-posts/${RUN_ID}"
mkdir -p "$RUN_DIR"
LOG="$RUN_DIR/run.jsonl"
DRY="${SOCIAL_POSTS_DRY_RUN:-0}"
GRAPH_API_VERSION="${GRAPH_API_VERSION:-v22.0}"
LINKEDIN_VERSION="${LINKEDIN_VERSION:-202607}"
SITE_URL="https://avniguy.co.il"

log_step() {
  local level="$1" step="$2" network="${3:-}" msg="$4"
  python3 -c 'import json,sys,datetime; print(json.dumps({"ts":datetime.datetime.utcnow().isoformat()+"Z","level":sys.argv[1],"step":sys.argv[2],"network":sys.argv[3] or None,"msg":sys.argv[4]},ensure_ascii=False))' "$level" "$step" "$network" "$msg" | tee -a "$LOG" >&2
}
fail_net() { log_step error "$1" "$2" "$3"; return 0; }
```

- Default is **live post** when creds exist (`SOCIAL_POSTS_DRY_RUN=0`).
- `SOCIAL_POSTS_DRY_RUN=1` → write copy/media/payloads under `$RUN_DIR`, skip HTTP publish, still log each skip as `dry-run`.
- Missing creds for one network: `log_step error` + continue. Never silent-skip.
- Do not ask the user to click Approve. Do not set Ayrshare `requiresApproval`.

## 1. Resolve profiles from the live site (do not guess)

Footer SSOT in repo: `src/lib/nav/site-social.ts` (clickable footer). Production JSON-LD `sameAs` also lists LinkedIn + Facebook.

Re-fetch live HTML and extract. Expected (verify; if a URL disappeared, drop that network this run):

| Network | Live URL | On-page |
|---|---|---|
| X | `https://x.com/AvniGuy11492` | footer + `sameAs` |
| Instagram | `https://www.instagram.com/guy_avni_lawyer/` | footer + `sameAs` |
| YouTube | `https://www.youtube.com/@guyavni` | footer + `sameAs` |
| LinkedIn | `https://www.linkedin.com/in/guy-avni-35b3292b1/` | `sameAs` only |
| Facebook | `https://www.facebook.com/profile.php?id=61591485283276` | `sameAs` only |

**Do not post to:** Wikidata, `https://guyavni.co.il/` (office site), WhatsApp, TikTok, Threads — not social-post profiles linked here.

```bash
python3 - <<'PY' | tee "$RUN_DIR/live-profiles.json"
import json,re,urllib.request
html=urllib.request.urlopen("https://avniguy.co.il/", timeout=30).read().decode("utf-8","replace")
hrefs=set(re.findall(r'https?://[^"\']+', html))
want=("x.com/","twitter.com/","instagram.com/","youtube.com/","linkedin.com/","facebook.com/")
found=sorted({h.split("\\")[0].rstrip("\\") for h in hrefs if any(w in h.lower() for w in want) and "globes" not in h.lower()})
print(json.dumps({"found":found}, ensure_ascii=False, indent=2))
PY
log_step info resolve-profiles "" "wrote $RUN_DIR/live-profiles.json"
```

Post only networks whose URL is in `found`.

## 2. Resolve source content (deterministic default)

**If user names a URL or slug** → that item.  
**If user says homepage / דף הבית** → `https://avniguy.co.il/` + `src/lib/home/loadHomeData.ts` (`primarySiteKeyword`) + `src/consts.ts` `SITE_KEYWORDS_BRAND`.  
**Else default** → newest `pubDate` among `src/content/blog/*.mdx`.

```bash
python3 - <<'PY' | tee "$RUN_DIR/source.json"
import json,re,pathlib
root=pathlib.Path("src/content/blog")
best=None
for p in root.glob("*.mdx"):
    t=p.read_text(encoding="utf-8")
    fm=t.split("---",2)
    if len(fm)<3: continue
    block=fm[1]
    def gv(k):
        m=re.search(rf"^{k}:\s*(.+)$", block, re.M)
        return (m.group(1).strip().strip("'\"") if m else "")
    pd=gv("pubDate")
    if not pd: continue
    if best is None or pd>best["pubDate"]:
        title=gv("title")
        if title==">-":
            m=re.search(r"^title:\s*>-\s*\n((?:  .+\n)+)", block, re.M)
            title=" ".join(x.strip() for x in m.group(1).splitlines()) if m else p.stem
        imgs=re.findall(r"src:\s*>-\s*\n\s+(\S+)|src:\s*['\"](https?://[^'\"]+)", block)
        srcs=[a or b for a,b in imgs]
        if not srcs:
            srcs=re.findall(r"https://avniguy\.co\.il/images/blog/[^\\s]+\.(?:jpg|jpeg|png|webp)", block)
        alts=re.findall(r"^    alt:\s*>-\s*\n\s+(.+)$|^    alt:\s*(.+)$", block, re.M)
        alt=(alts[0][0] or alts[0][1]).strip() if alts else title
        tags=re.findall(r"^  - (.+)$", block, re.M)
        best={
          "slug": p.stem,
          "pubDate": pd,
          "title": title,
          "description": gv("description") or gv("metaDescription"),
          "mainKeyword": gv("mainKeyword"),
          "metaTitle": gv("metaTitle"),
          "canonical": f"https://avniguy.co.il/blog/{p.stem}/",
          "imageUrl": srcs[0] if srcs else "",
          "imageAlt": alt,
          "tags": tags[:8],
          "faq1": "",
        }
print(json.dumps(best or {}, ensure_ascii=False, indent=2))
PY
```

If `source.json` is empty → `log_step error load-content "" "no blog mdx"` and stop.

Keyword SSOT for copy (do not invent filler):

- Article: `title`, `description`/`metaDescription`, `mainKeyword`, `secondaryKeywords`, `tags`, first FAQ question/answer if present.
- Brand: `SITE_KEYWORDS_BRAND` in `src/consts.ts` (Hebrew-first: גיא אבני / גיא אבני עורך דין).
- Schema: `src/lib/content/schema.ts`.
- Live URL always the canonical on `avniguy.co.il` (not localhost).

## 3. Create copy + media (before any publish)

Language: **Hebrew**. No English-first posts. Optional 0–1 Latin hashtag. Professional, no outcome guarantees, not legal advice. CTA = canonical URL, then `https://avniguy.co.il/contact/` when space remains.

Disclaimer line (use when length allows): `התוכן אינו ייעוץ משפטי.`

Hashtags: from `mainKeyword` + 2–4 `tags`/`secondaryKeywords`, Hebrew, no spam. Strip spaces/quotes.

Media:

- Prefer the article's **already-public** `images[0].src` (unique per article on the live site). Do not add files under `public/images/`.
- Download a local copy into `$RUN_DIR` for uploads that need a file. Do not reuse that raster as a new site placement.
- YouTube requires a **video**: build a unique Short in `$RUN_DIR` from the still (ffmpeg). That file stays in `/tmp`.

```bash
IMG_URL=$(python3 -c 'import json;print(json.load(open("'"$RUN_DIR"'/source.json")).get("imageUrl") or "")')
if [ -z "$IMG_URL" ]; then
  log_step error download-image "" "source.json missing imageUrl"
else
  curl -fsSL "$IMG_URL" -o "$RUN_DIR/source.jpg" \
    || log_step error download-image "" "image download failed"
fi
```

Write `$RUN_DIR/copy.json` with per-network fields below. Count **graphemes** (Hebrew = 1). X URL weight = 23 chars via t.co.

### Per-network copy + media rules

**X** (`AvniGuy11492`)

- Format: 1 hook sentence + 1 insight from `description` + canonical URL. 0–2 hashtags.
- Limit: **280** (assume non-Premium). If over, drop hashtags then insight, keep URL.
- Media: 1 still, 16:9 or 1:1, JPEG/PNG/WEBP, ≤5MB, `media_category=tweet_image`. Alt = `imageAlt` (≤1000).
- CTA: the article URL (not a thread unless user asked).

**Instagram** (`guy_avni_lawyer`)

- Format: line 1 = hook with `mainKeyword`; 2–4 short lines; URL as plain text (feed links are not clickable); 3–5 hashtags at end.
- Limit: **2200** caption (first ~125 show without “more”).
- Media: feed still **4:5 (1080×1350)** preferred, else 1:1. JPEG, sRGB, ≤8MB, min width 320. Aspect must be between 4:5 and 1.91:1. `alt_text` = Hebrew `imageAlt`.
- CTA: “המאמר המלא: {canonical}” + contact URL if room.
- Do not exceed 30 hashtags. Prefer 3–5.

**YouTube** (`@guyavni`)

- Format: **Short** (vertical video), not a Community text post (no official API).
- Title ≤**100** chars, include topic + `גיא אבני`. Put `#Shorts` in title or first description line.
- Description ≤**5000**: 2–3 Hebrew sentences from `description`, canonical URL, contact URL, disclaimer, 3–8 tags from keywords.
- Media: 1080×1920, H.264 yuv420p, **15–45s**, ≤60s for Shorts reliability, no copyright soundtrack.
- categoryId: `27` (Education). privacyStatus: `public`.
- ffmpeg (if missing → skip YouTube with error log):

```bash
ffmpeg -y -loop 1 -i "$RUN_DIR/source.jpg" -t 20 \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,format=yuv420p" \
  -c:v libx264 -pix_fmt yuv420p -r 30 -an "$RUN_DIR/short.mp4" \
  || log_step error ffmpeg youtube "ffmpeg failed"
```

**LinkedIn** (`/in/guy-avni-35b3292b1/`)

- Format: 1–3 short paragraphs, professional; URL in body (unfurl). 3–5 hashtags.
- Limit: **3000** commentary.
- Media: 1 image 1200×627 or 1080×1080 JPEG/PNG ≤5MB **or** text+URL if image upload fails (still counts as posted).
- CTA: canonical + contact. No emoji spam.

**Facebook** (`profile.php?id=61591485283276`)

- Format: hook + 1 paragraph + URL. 0–2 hashtags.
- Limit: 63k but keep **≤500** visible-quality chars.
- Media: 1 still, ≥600px, 1.91:1 or 1:1.
- Live URL is a **profile**, not a Page. Graph Page APIs often fail here — see §5 Facebook.

Save payloads:

```bash
log_step info write-copy "" "$RUN_DIR/copy.json"
```

## 4. Choose posting method (simplest first)

**A. Aggregator shortcut** — if `AYRSHARE_API_KEY` is set, one call covers every linked network. Simplest multi-network path (Ayrshare maps IG containers, X media, YT upload). Never `requiresApproval`.

```bash
# platforms: twitter=X, instagram, youtube, linkedin, facebook
# Only include platforms that are both live-linked AND linked in the Ayrshare dashboard.
curl -sS -X POST "https://api.ayrshare.com/api/post" \
  -H "Authorization: Bearer ${AYRSHARE_API_KEY}" \
  -H "Content-Type: application/json" \
  -d @"$RUN_DIR/ayrshare-body.json" | tee "$RUN_DIR/ayrshare-response.json"
```

`ayrshare-body.json` shape (fill from `copy.json`; YouTube **must** include `youTubeOptions.title`):

```json
{
  "post": "HEBREW_DEFAULT_CAPTION",
  "platforms": ["twitter", "instagram", "linkedin", "facebook"],
  "mediaUrls": ["PUBLIC_IMAGE_URL"],
  "twitterOptions": { "thread": false },
  "youTubeOptions": {
    "title": "HEBREW_TITLE #Shorts",
    "visibility": "public",
    "shorts": true
  }
}
```

YouTube via Ayrshare needs a **video** URL in `mediaUrls` (use a public URL; local `/tmp` files are not fetchable). If you cannot host `short.mp4` publicly, do YouTube via native API (§5) even when Ayrshare handles the others.

If Ayrshare returns per-platform `status != success`, log that network as error and fall through to native for **that** network only.

**B. Native HTTP** — default when no aggregator key. Per-network curl below. Why native: no extra app dependency; after tokens exist, fully unattended.

**C. Playwright last resort** — only if native creds missing **and** a `storageState` file exists. Repo already has `@playwright/test`. Do not invent logins or pause for 2FA.

## 5. Native publish (parallel per network; isolate failures)

Load `copy.json` / `source.json`. For each network: if creds missing → error log + continue. If `DRY=1` → write `$RUN_DIR/{network}-payload.json` + `log_step info dry-run` + continue.

### 5.1 X — API v2 curl (simplest)

Why: one user bearer posts text+media; no CLI to install. Prefer OAuth 2 user token (`tweet.write` + `media.write` + `tweet.read` + `users.read` + `offline.access`).

Env: `X_USER_ACCESS_TOKEN` (required). Optional refresh: `X_CLIENT_ID` `X_CLIENT_SECRET` `X_REFRESH_TOKEN`.

```bash
# Image (small JPEG): initialize + append + finalize, then tweet
BYTES=$(wc -c < "$RUN_DIR/source.jpg" | tr -d ' ')
INIT=$(curl -sS -X POST "https://api.x.com/2/media/upload/initialize" \
  -H "Authorization: Bearer ${X_USER_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"media_type\":\"image/jpeg\",\"total_bytes\":${BYTES},\"media_category\":\"tweet_image\"}")
echo "$INIT" | tee "$RUN_DIR/x-init.json"
MEDIA_ID=$(python3 -c 'import json,sys; print(json.load(sys.stdin)["data"]["id"])' <<<"$INIT")
curl -sS -X POST "https://api.x.com/2/media/upload/${MEDIA_ID}/append" \
  -H "Authorization: Bearer ${X_USER_ACCESS_TOKEN}" \
  -F "segment_index=0" -F "media=@${RUN_DIR}/source.jpg" | tee "$RUN_DIR/x-append.json"
curl -sS -X POST "https://api.x.com/2/media/upload/${MEDIA_ID}/finalize" \
  -H "Authorization: Bearer ${X_USER_ACCESS_TOKEN}" | tee "$RUN_DIR/x-finalize.json"
# alt
curl -sS -X POST "https://api.x.com/2/media/metadata" \
  -H "Authorization: Bearer ${X_USER_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"${MEDIA_ID}\",\"metadata\":{\"alt_text\":{\"text\":\"ALT_FROM_copy_json\"}}}" || true
curl -sS -X POST "https://api.x.com/2/tweets" \
  -H "Authorization: Bearer ${X_USER_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"X_TEXT\",\"media\":{\"media_ids\":[\"${MEDIA_ID}\"]}}" \
  | tee "$RUN_DIR/x-tweet.json"
```

HTTP 201 with `data.id` → success (`https://x.com/AvniGuy11492/status/{id}`). Else `fail_net publish x "$body"`.

### 5.2 Instagram — Graph content publishing (simplest official)

Why: Meta has no posting CLI; 3-step Graph is the official unattended path. Image **must** be a public HTTPS URL (use live `imageUrl`, not `/tmp`).

Env: `IG_USER_ID` + `IG_ACCESS_TOKEN` (Facebook Login for Business Page token with `instagram_basic` `instagram_content_publish` `pages_read_engagement`, **or** Instagram user token with `instagram_business_basic` `instagram_business_content_publish`). Host: Page-token → `graph.facebook.com`; IG-login token → `graph.instagram.com`. Default host `graph.facebook.com`.

```bash
HOST="${IG_GRAPH_HOST:-graph.facebook.com}"
CONT=$(curl -sS -X POST "https://${HOST}/${GRAPH_API_VERSION}/${IG_USER_ID}/media" \
  -G \
  --data-urlencode "image_url=${PUBLIC_IMAGE_URL}" \
  --data-urlencode "caption=${IG_CAPTION}" \
  --data-urlencode "alt_text=${IG_ALT}" \
  --data-urlencode "access_token=${IG_ACCESS_TOKEN}")
echo "$CONT" | tee "$RUN_DIR/ig-container.json"
CID=$(python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("id") or "")' <<<"$CONT")
# poll until FINISHED (videos) — images are often immediately publishable
for i in 1 2 3 4 5 6; do
  ST=$(curl -sS "https://${HOST}/${GRAPH_API_VERSION}/${CID}?fields=status_code,status&access_token=${IG_ACCESS_TOKEN}")
  echo "$ST" | tee -a "$RUN_DIR/ig-status.json"
  echo "$ST" | grep -q FINISHED && break
  echo "$ST" | grep -q ERROR && { fail_net publish instagram "$ST"; CID=""; break; }
  sleep 3
done
[ -n "$CID" ] && curl -sS -X POST "https://${HOST}/${GRAPH_API_VERSION}/${IG_USER_ID}/media_publish" \
  -d "creation_id=${CID}" -d "access_token=${IG_ACCESS_TOKEN}" \
  | tee "$RUN_DIR/ig-publish.json"
```

Need `id` in publish JSON. Limit: 50 publishes / 24h rolling. Account must be Professional (Business/Creator) linked to a Page.

### 5.3 LinkedIn — Posts API (simplest official)

Why: `POST /rest/posts` with `w_member_social` is the current member-publish API (ugcPosts replaced). Profile is a **person** URN, not an organization.

Env: `LINKEDIN_ACCESS_TOKEN` + `LINKEDIN_AUTHOR_URN` (`urn:li:person:{id}`). Header `Linkedin-Version: 202607`.

Resolve person id once:

```bash
curl -sS "https://api.linkedin.com/v2/userinfo" \
  -H "Authorization: Bearer ${LINKEDIN_ACCESS_TOKEN}" | tee "$RUN_DIR/li-userinfo.json"
# author = urn:li:person:{sub}
```

Image (optional):

```bash
curl -sS -X POST "https://api.linkedin.com/rest/images?action=initializeUpload" \
  -H "Authorization: Bearer ${LINKEDIN_ACCESS_TOKEN}" \
  -H "Linkedin-Version: ${LINKEDIN_VERSION}" \
  -H "X-Restli-Protocol-Version: 2.0.0" \
  -H "Content-Type: application/json" \
  -d "{\"initializeUploadRequest\":{\"owner\":\"${LINKEDIN_AUTHOR_URN}\"}}" \
  | tee "$RUN_DIR/li-init.json"
# PUT binary to value.uploadUrl; then posts.content.media.id = value.image
curl -sS -X PUT "$UPLOAD_URL" \
  -H "Authorization: Bearer ${LINKEDIN_ACCESS_TOKEN}" \
  --data-binary @"$RUN_DIR/source.jpg"
```

Text (always works if image step failed):

```bash
curl -sS -D "$RUN_DIR/li-headers.txt" -X POST "https://api.linkedin.com/rest/posts" \
  -H "Authorization: Bearer ${LINKEDIN_ACCESS_TOKEN}" \
  -H "Linkedin-Version: ${LINKEDIN_VERSION}" \
  -H "X-Restli-Protocol-Version: 2.0.0" \
  -H "Content-Type: application/json" \
  -d "{
    \"author\": \"${LINKEDIN_AUTHOR_URN}\",
    \"commentary\": \"LINKEDIN_TEXT\",
    \"visibility\": \"PUBLIC\",
    \"distribution\": {\"feedDistribution\": \"MAIN_FEED\", \"targetEntities\": [], \"thirdPartyDistributionChannels\": []},
    \"lifecycleState\": \"PUBLISHED\",
    \"isReshareDisabledByAuthor\": false
  }" | tee "$RUN_DIR/li-post.json"
```

Success = HTTP 201 + `x-restli-id` header. Else `fail_net publish linkedin`.

### 5.4 Facebook — Page Graph if Page token; else Playwright

Why Page photos POST is the simplest **official** publish. Live link is `profile.php?id=61591485283276` (profile). Graph **cannot** publish to classic personal profiles. If the owner later converts to a Page, set `FACEBOOK_PAGE_ID`.

Env (Page path): `FACEBOOK_PAGE_ID` + `FACEBOOK_PAGE_ACCESS_TOKEN` (`pages_manage_posts`, `pages_read_engagement`, `pages_show_list`).

```bash
curl -sS -X POST "https://graph.facebook.com/${GRAPH_API_VERSION}/${FACEBOOK_PAGE_ID}/photos" \
  -F "url=${PUBLIC_IMAGE_URL}" \
  -F "caption=${FB_CAPTION}" \
  -F "published=true" \
  -F "access_token=${FACEBOOK_PAGE_ACCESS_TOKEN}" \
  | tee "$RUN_DIR/fb-photo.json"
```

Need `post_id` or `id` without `error`. If Graph errors with profile/PPA/permissions → Playwright if state exists, else `fail_net` and continue.

Playwright last resort (no pause, no 2FA prompt). Env: `PLAYWRIGHT_STATE_FACEBOOK` = path to `storageState` JSON from a prior logged-in session.

```bash
npx playwright eval >/dev/null 2>&1 || true
# Use a /tmp script, do not add a repo file:
node <<'NODE'
const { chromium } = require('@playwright/test');
const fs = require('fs');
(async () => {
  const state = process.env.PLAYWRIGHT_STATE_FACEBOOK;
  if (!state || !fs.existsSync(state)) {
    console.error(JSON.stringify({level:'error',step:'publish',network:'facebook',msg:'no PLAYWRIGHT_STATE_FACEBOOK'}));
    process.exit(0);
  }
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ storageState: state });
  const page = await ctx.newPage();
  try {
    await page.goto('https://www.facebook.com/', { waitUntil: 'domcontentloaded', timeout: 45000 });
    // If login form visible → session dead
    if (await page.getByRole('button', { name: /log in|התחבר/i }).count()) {
      throw new Error('facebook session expired');
    }
    const composer = page.getByRole('button', { name: /what.?s on your mind|מה בא לך/i }).first();
    await composer.click({ timeout: 15000 });
    const box = page.locator('[contenteditable="true"]').last();
    await box.fill(process.env.FB_CAPTION || '');
    const file = process.env.FB_IMAGE_PATH;
    if (file) {
      const input = page.locator('input[type="file"]').first();
      await input.setInputFiles(file);
    }
    await page.getByRole('button', { name: /post|פרסם|שיתוף/i }).last().click({ timeout: 15000 });
    await page.waitForTimeout(4000);
    console.error(JSON.stringify({level:'info',step:'publish',network:'facebook',msg:'playwright click-post attempted'}));
  } catch (err) {
    console.error(JSON.stringify({level:'error',step:'publish',network:'facebook',msg:String(err)}));
  } finally {
    await browser.close();
  }
})();
NODE
```

If checkpoint/2FA appears: log error, close browser, continue (cannot be unattended).

### 5.5 YouTube — Data API v3 resumable upload (simplest official)

Why: YouTube has no text-post API. Community posts have no official API. A Short via `videos.insert` is the unattended publish.

Env: `YOUTUBE_CLIENT_ID` `YOUTUBE_CLIENT_SECRET` `YOUTUBE_REFRESH_TOKEN` (scope `https://www.googleapis.com/auth/youtube.upload`).

```bash
TOK=$(curl -sS -X POST "https://oauth2.googleapis.com/token" \
  -d "client_id=${YOUTUBE_CLIENT_ID}" \
  -d "client_secret=${YOUTUBE_CLIENT_SECRET}" \
  -d "refresh_token=${YOUTUBE_REFRESH_TOKEN}" \
  -d "grant_type=refresh_token")
echo "$TOK" | tee "$RUN_DIR/yt-token.json" >/dev/null
YT_ACCESS=$(python3 -c 'import json,sys; print(json.load(sys.stdin).get("access_token") or "")' <<<"$TOK")
[ -n "$YT_ACCESS" ] || { fail_net token youtube "refresh failed"; true; }
```

Resumable upload (metadata then binary):

```bash
SIZE=$(wc -c < "$RUN_DIR/short.mp4" | tr -d ' ')
LOC=$(curl -sS -D - -o /dev/null -X POST \
  "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status" \
  -H "Authorization: Bearer ${YT_ACCESS}" \
  -H "Content-Type: application/json; charset=UTF-8" \
  -H "X-Upload-Content-Length: ${SIZE}" \
  -H "X-Upload-Content-Type: video/mp4" \
  -d "{
    \"snippet\": {
      \"title\": \"YT_TITLE\",
      \"description\": \"YT_DESC\",
      \"tags\": [\"גיא אבני\",\"עורך דין\"],
      \"categoryId\": \"27\"
    },
    \"status\": { \"privacyStatus\": \"public\", \"selfDeclaredMadeForKids\": false }
  }" | awk 'tolower($1)=="location:"{print $2}' | tr -d '\r')
curl -sS -X PUT "$LOC" \
  -H "Authorization: Bearer ${YT_ACCESS}" \
  -H "Content-Type: video/mp4" \
  -H "Content-Length: ${SIZE}" \
  --data-binary @"$RUN_DIR/short.mp4" \
  | tee "$RUN_DIR/yt-upload.json"
```

Success = JSON `id` (watch URL `https://www.youtube.com/watch?v={id}`). Quota: `videos.insert` is expensive; one Short per run.

Playwright Community-tab image post **only** if ffmpeg or OAuth is missing **and** `PLAYWRIGHT_STATE_YOUTUBE` exists. Same fail-closed 2FA rule.

## 6. Error logging contract

Every step writes one JSON line to `$LOG` **and** stderr:

```
{"ts":"...Z","level":"info|error","step":"resolve-profiles|load-content|write-copy|download-image|ffmpeg|token|publish|dry-run","network":"x|instagram|youtube|linkedin|facebook"|null,"msg":"..."}
```

- Never print access tokens, refresh tokens, or Authorization headers.
- On HTTP failure include status + truncated body (no secrets).
- End with a stdout summary table: network, method used (`ayrshare|native|playwright|skipped`), result (`ok|error|dry-run`), URL or error `msg`.

## 7. Fail-safe + what cannot be unattended

| Case | Action |
|---|---|
| Missing env for a network | error log, continue others |
| Ayrshare partial fail | native fallback for failed platforms |
| Instagram not Professional / no Page | skip IG, log |
| Facebook personal profile + no Page token + no storageState | skip FB, log (Graph cannot post to personal profiles) |
| Facebook/LinkedIn/YouTube login checkpoint or 2FA | abort that network only |
| ffmpeg missing | skip YouTube video path |
| `SOCIAL_POSTS_DRY_RUN=1` | no publish |
| Rate limit / 429 | log body, do not retry-loop forever; one retry after 30s then skip |

**One-time human (not per post):** create X/Meta/LinkedIn/Google apps, OAuth consent, connect IG Professional, optionally Ayrshare dashboard link, optionally Playwright `storageState`. After that, this playbook is hands-off.

**Not fully unattended without extra setup:** Facebook **profile** (live sameAs) — needs Page conversion + Page token, aggregator link, or a valid Playwright session. YouTube needs a refresh token **and** ffmpeg (or a public video URL for Ayrshare).

## 8. Env keys (list only; do not invent production secrets)

Put values in `.env.local` (gitignored). Do not add them to the Next.js app schema unless app code starts reading them.

| Key | Networks |
|---|---|
| `AYRSHARE_API_KEY` | all linked (optional shortcut) |
| `X_USER_ACCESS_TOKEN` | X |
| `X_CLIENT_ID` `X_CLIENT_SECRET` `X_REFRESH_TOKEN` | X token refresh |
| `IG_USER_ID` `IG_ACCESS_TOKEN` | Instagram |
| `IG_GRAPH_HOST` | `graph.facebook.com` (default) or `graph.instagram.com` |
| `LINKEDIN_ACCESS_TOKEN` `LINKEDIN_AUTHOR_URN` | LinkedIn |
| `FACEBOOK_PAGE_ID` `FACEBOOK_PAGE_ACCESS_TOKEN` | Facebook Page |
| `YOUTUBE_CLIENT_ID` `YOUTUBE_CLIENT_SECRET` `YOUTUBE_REFRESH_TOKEN` | YouTube |
| `PLAYWRIGHT_STATE_FACEBOOK` `PLAYWRIGHT_STATE_LINKEDIN` `PLAYWRIGHT_STATE_YOUTUBE` | last-resort sessions |
| `SOCIAL_POSTS_DRY_RUN` | `1` = no publish |
| `GRAPH_API_VERSION` | default `v22.0` |
| `LINKEDIN_VERSION` | default `202607` |

## 9. Done

- Posted or logged-skip for **every** live social profile from §1.
- `$RUN_DIR/run.jsonl` exists.
- No files added under `public/images/`.
- No human approval gate was inserted.
- Print `$RUN_DIR` path and the per-network table to the user.
