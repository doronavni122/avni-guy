# 074 office sameAs TLS warn (F21 wiring)

ADR: seo , env-validation

## goal
In-repo OPERATOR wiring for guyavni TLS: warnProductionEnvGaps when default office sameAs is active; empty PERSON_OFFICE_SITE_URL remains opt-out. No invented URLs.

## todos
- [x] warn when PERSON_OFFICE_SITE_URL unset (default guyavni) in production
- [x] no warn on explicit empty opt-out
- [ ] verify

## DoD
Production builds warn about default office sameAs TLS risk; opt-out via empty env works.
