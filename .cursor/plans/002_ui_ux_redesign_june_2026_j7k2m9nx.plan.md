# Plan 002: UI/UX Redesign June 2026 (v0-quality)

ADR: frontend , SSOT-E
Status: executing
Scope: Hebrew RTL legal content site — premium v0/Vercel-quality look & feel without content/SEO/Keystatic loss.

## Research approach (skills cited)

- **web-design-guidelines**: fetch Vercel Web Interface Guidelines; audit changed TSX at validation (U4).
- **shadcn**: base-nova preset, navigation-menu, sheet, accordion, card, badge; RTL in components.json.
- **vercel-react-best-practices**: RSC-first, client islands only for MobileNav/sheet; bundle-direct imports; content-visibility on long home sections.
- **figma-generate-design**: N/A (code-first redesign; no Figma source).
- **canvas**: N/A (no analytical artifact deliverable).

## Constraints (preserve)

- Content: `src/content/blog/`, schema, heroes in `main-page-heroes.ts` (word counts/H1 rules unchanged).
- SEO kit, Keystatic, metadata, JSON-LD, sitemap, RSS.
- `trailingSlash: true`; port 3001 dev; atomic commits + task_graph.log per change.

## Scopes

### S1 — Design tokens + typography
##todos
- [ ] Add Noto Sans Hebrew via next/font; wire --font-sans/--font-heading in layout.tsx
- [ ] Refine oklch tokens: legal emerald primary, warm cream bg, elevation shadows in global.css
- [ ] Remove Bear Blog legacy em-scale h1–h5; use Tailwind @layer base typography
- [ ] Add utility classes: .glass-header, .premium-panel, .prose-legal, .section-gap
- [ ] Commit: redesign-design-tokens-typography

### S2 — Shell + navigation
##todos
- [ ] Create src/lib/nav/site-nav.ts (NAV_LINKS SSOT) + src/lib/nav/is-nav-active.ts
- [ ] Upgrade SiteShell container rhythm + optional page fade-in
- [ ] Header: glass backdrop-blur, refined logo lockup, navigation-menu polish
- [ ] Footer: multi-column nav + social; premium spacing
- [ ] MobileNav: sheet polish, shared nav SSOT
- [ ] Commit: redesign-site-shell-navigation

### S3 — Shared layout primitives
##todos
- [ ] Add PageSection, SectionHeader, PremiumPanel in src/components/layout/
- [ ] Upgrade MainPageHero: gradient accent, optional badges slot
- [ ] Commit: redesign-layout-primitives

### S4 — Main pages migration
##todos
- [ ] HomePage: apply PremiumPanel/SectionHeader; hero glow; card hover consistency
- [ ] about, services, blog index, contact: PageSection wrappers + visual hierarchy
- [ ] Commit per page group: redesign-main-pages

### S5 — Blog experience
##todos
- [ ] BlogPostLayout: prose-legal, refined image grid, FAQ accordion if frontmatter faq
- [ ] RelatedArticles + AuthorBio polish
- [ ] FaqAccordion home: premium panel wrapper
- [ ] Commit: redesign-blog-experience

### S6 — Taxonomy hubs
##todos
- [ ] categories/page, categories/[category], tags/page, tags/[tag]: SectionHeader + card grid polish
- [ ] Commit: redesign-taxonomy-hubs

### S7 — Deprecated cleanup
##todos
- [ ] Remove HeaderLink.tsx (move isNavLinkActive to lib/nav); update imports
- [ ] Remove duplicate NAV_LINKS arrays
- [ ] Strip unused Bear Blog CSS remnants; no duplicate style files
- [ ] components.json: verify rtl + base-nova unchanged unless needed
- [ ] Commit: remove-deprecated-ui-traces

### S8 — Validation gates
##todos
- [ ] Execute `.commends/TODO_validate_true.md` (read-only): every plan ##todo true, confidence >0.95
- [ ] UI gates (adapted from TODO_confidance_full_95.md, do NOT edit commends):
  - **U1** design system: tokens, fonts, globals, primitives exist and render
  - **U2** page migration: all main-menu + blog + taxonomy routes use new primitives
  - **U3** build/smoke: `pnpm build` + dev on :3001 — /, /blog/, /about/, /contact/, sample blog slug
  - **U4** deprecated cleanup + web-design-guidelines audit on changed TSX
- [ ] Push origin main when all green

## Files (primary touch)

src/styles/global.css, src/app/layout.tsx, src/lib/nav/*, src/components/layout/*, src/components/Header.tsx, src/components/Footer.tsx, src/components/react/MobileNav.tsx, src/components/seo/MainPageHero.tsx, src/components/home/*, src/app/{about,services,blog,contact,categories,tags}/**, src/components/layout/BlogPostLayout.tsx, src/components/blog/*

## Removed (expected)

src/components/HeaderLink.tsx (after nav util extraction)
