# Internal linking standard (kit law)

## Per article manifest (Phase 0)

Record `internalLinkManifest` per subject. Minimum:

- Homepage `/` or profile `siteDomain`
- Primary CTA (`primaryCta` from profile)
- Own slug (if self-reference needed)
- **≥ 2** related pages (siblings, services, other content under `publishPrefix`)

## Phase 5 rules

- **Remove** bottom link-list sections and TL;DR lines that are **only** links
- **Embed** every removed link into body paragraphs
- Spread links across **≥ 4 distinct H2 sections** (not clustered in TL;DR only)
- **Exactly one** homepage link per article (long-tail anchor around `primaryServiceAnchor`)

## External / denylist

- Remove all URLs matching `linkDenylist` from profile (body + sources)
- Replace with authoritative non-competitor sources (standards, gov, peer-reviewed)

## Phase 6 global checks (per file)

- [ ] 0 denylisted outbound links
- [ ] 0 bottom link-list sections
- [ ] Exactly **1** homepage link
- [ ] Links in **4+** body H2 sections
- [ ] Every manifest path present in body (not TL;DR only)
