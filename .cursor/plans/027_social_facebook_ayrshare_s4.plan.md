# social-facebook-ayrshare-playwright

ADR: none , (ops CLI; no ADR dir)

##todos
- [ ] Facebook Page photos or profile skip
- [ ] Ayrshare one-call + native fallback
- [ ] Playwright last resort only if storageState exists

## Exclusive files
- scripts/social-posts/publish/facebook.mjs
- scripts/social-posts/publish/ayrshare.mjs
- scripts/social-posts/publish/playwright-fallback.mjs

## Verify
node --test scripts/social-posts/publish/facebook.test.mjs scripts/social-posts/publish/ayrshare.test.mjs scripts/social-posts/publish/playwright-fallback.test.mjs
