# Plan: contact-schema-depth

ADR: none , (ContactPage schema; NAP match)

## Goal

Deepen contact prep; add ContactPage + ContactPoint matching visible NAP; add 2–4 prep FAQ Q→A visible + FAQPage schema.

## Changes

1. `buildContactPageSchema` in structured-data.ts
2. Contact page FAQ section + deepen prep copy
3. JSON-LD: ContactPage, ContactPoint (email/phone/areaServed from claimed NAP), FAQPage

## VALIDATE_TRUE

| Claim | Evidence | Conf |
|-------|----------|------|
| No ContactPage / 0 FAQ | 006/007 | 0.99 |

**Outcome:** PASS conf>0.95
