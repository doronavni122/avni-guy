# Plan: home-person-graph

ADR: none , (entity graph Person @id)

## Goal

Home JSON-LD references `about/#person` via LegalService.employee + explicit Person node + WebPage.about/mainEntity.

## Changes

1. LegalService.employee → SITE_PERSON_ID
2. Home extraJsonLd includes buildPersonSchema
3. HowTo name destuffed to match UI

## VALIDATE_TRUE

| Claim | Evidence | Conf |
|-------|----------|------|
| Home LD lacked Person node | 006 P1.7 | 0.99 |

**Outcome:** PASS conf>0.95
