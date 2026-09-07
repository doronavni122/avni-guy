# social-native-publish

ADR: none , (ops CLI; no ADR dir)

##todos
- [ ] Shared http helper: redact, truncate, one 429 retry
- [ ] X v2 media+tweet, IG Graph, LinkedIn posts, YouTube resumable
- [ ] Mocked fetch tests; fail-continue

## Exclusive files
- scripts/social-posts/http.mjs
- scripts/social-posts/publish/x.mjs
- scripts/social-posts/publish/instagram.mjs
- scripts/social-posts/publish/linkedin.mjs
- scripts/social-posts/publish/youtube.mjs

## Verify
node --test scripts/social-posts/http.test.mjs scripts/social-posts/publish/*.test.mjs
