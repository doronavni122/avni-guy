# social-source-copy

ADR: none , (ops CLI; no ADR dir)

##todos
- [ ] Resolve live + footer social profile URLs
- [ ] Newest MDX or --slug/--url source.json
- [ ] Hebrew copy per network with grapheme limits
- [ ] Download live article image; ffmpeg Short or skip YouTube

## Exclusive files
- scripts/social-posts/source.mjs
- scripts/social-posts/copy.mjs
- scripts/social-posts/media.mjs

## Verify
node --test scripts/social-posts/source.test.mjs scripts/social-posts/copy.test.mjs scripts/social-posts/media.test.mjs
