# social-tests-ci-skillwire

ADR: none , (ops CLI; no ADR dir)

##todos
- [ ] CLI wires source/copy/media/publishAll
- [ ] pnpm test + pnpm social:posts; add test to build:ci
- [ ] SKILL.md invokes CLI
- [ ] Dry-run e2e against newest article

## Exclusive files
- scripts/tools/social-posts.mjs
- package.json
- .github/workflows/ci.yml
- .cursor/skills/social-posts/SKILL.md

## Verify
pnpm test && pnpm social:posts --dry-run
pnpm run build:ci
