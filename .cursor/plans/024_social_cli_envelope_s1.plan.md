# social-cli-envelope

ADR: none , (ops CLI; no ADR dir)

##todos
- [ ] JSONL logger with secret redaction + tests
- [ ] Env loader + missing-creds continue + dry-run flag
- [ ] CLI entry scripts/tools/social-posts.mjs + RUN_DIR envelope
- [ ] Empty posting keys in .env.example and .env.development.example (not src/env.ts)

## Goal
Unattended run envelope: log every step, never print tokens, skip publish when dry-run or missing creds.

## Exclusive files
- scripts/social-posts/
- scripts/tools/social-posts.mjs
- .env.example
- .env.development.example

## Out of scope
- Network HTTP publish
- Copy generation
- src/env.ts

## Verify
node --test scripts/social-posts/log.test.mjs scripts/social-posts/env.test.mjs
node scripts/tools/social-posts.mjs --dry-run
