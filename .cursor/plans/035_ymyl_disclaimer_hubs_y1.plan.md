# Plan: ymyl-disclaimer-hubs

ADR: none , (YMYL trust copy; SSOT content pages)

## Goal

Visible body “not personal advice” disclaimer on hubs missing it: home, services, categories, contact (practice landings already redirected).

## Changes

1. `src/components/seo/YmylDisclaimer.tsx` — short Hebrew visible phrase
2. Mount on home, services, categories index, contact (near footer of main content)

## VALIDATE_TRUE

| Claim | Evidence | Conf |
|-------|----------|------|
| Missing on listed hubs | 006 P1.5 / 007 | 0.99 |

**Outcome:** PASS conf>0.95
