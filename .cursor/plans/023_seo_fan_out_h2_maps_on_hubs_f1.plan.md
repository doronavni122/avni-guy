# fan-out-h2-maps-on-hubs — AI Mode sub-asks as H2 clusters on hubs

ADR: none , cite SSOT.md

##todos
- [x] Document AI Mode fan-out map for `/about/`, `/services/`, top guides → existing hubs only
- [x] Add H2 (+ H3) fan-out clusters on `src/app/about/page.tsx`
- [x] Add H2 (+ H3) fan-out clusters on `src/app/services/page.tsx`
- [x] Link clusters to existing top guides / categories / bridges (no new routes)
- [x] Verify: `pnpm build` in worktree; confirm zero new thin URLs under `src/app/`

## Goal
Capture Google AI Mode–style fan-out sub-asks as **visible H2 clusters on existing hubs** (`/about/`, `/services/`). Map top-guide intents into those hubs via deep links. **Zero thin fan-out landing URLs.**

## SSOT
- `SSOT.md` — Hebrew-first static Next, one visible H1/page, `force-static`
- Reuse `PageSection` + `SectionHeader` (H2) patterns; keep speakable/FAQ blocks unchanged unless a cluster needs a short link out

## Exclusive files
- `src/app/about/page.tsx`
- `src/app/services/` (hub page only)
- Plan + brief for this scope

## Fan-out map (sub-ask → hub surface)

### `/about/` (brand / entity fan-out)
| Sub-ask (HE intent) | Hub H2 cluster id | Deep links (existing only) |
|---|---|---|
| מי זה גיא אבני / מה הוא עושה | existing `#entity` + `#speakable` | `/services/`, `/contact/` |
| האם גיא אבני עורך דין מקרקעין/מיסוי | `#fanout-nedlan` | `/nedlan-lawyer-guy-avni/`, `/categories/tax/`, `/blog/choose-real-estate-lawyer/` |
| איך בוחרים עורך דין לפני פנייה | `#fanout-choose-lawyer` | `/blog/find-winning-lawyer-israel-bar-members/`, `/blog/choosing-lawyer-israel-comprehensive-guide/`, `/sheelot/` |
| מה לקרוא לפני פגישה לפי נושא | `#fanout-guides` | top guides + `/categories/*` |

### `/services/` (offer / journey fan-out)
| Sub-ask (HE intent) | Hub H2 cluster id | Deep links (existing only) |
|---|---|---|
| מה כולל השירות / פגישת מיקוד | existing speakable + services grid | `/about/`, `/contact/` |
| מתי ייעוץ חד-פעמי מול ליווי מלא | `#fanout-engagement` | `/about/#workflow`, `/contact/` |
| איזה מסלול: נדל״ן / חוזים / ליטיגציה / עסקים | `#fanout-practice-map` | category hubs + practice bridges |
| מדריכים לפי שלב בעסקה | `#fanout-guides` | top guides listed below |

### Top guides (map into hubs — do **not** edit MDX; do **not** create guide microsites)
| Guide slug | Fan-out intents absorbed on hubs |
|---|---|
| `find-winning-lawyer-israel-bar-members` | בחירת עורך דין, לשכה, דגלים אדומים |
| `choosing-lawyer-israel-comprehensive-guide` | פרוטוקול בחירה מקיף |
| `choose-real-estate-lawyer` | עורך דין מקרקעין |
| `apartment-buyer-required-documents` | מסמכים לפני קנייה |
| `buying-from-contractor-checklist` | דירה מקבלן |
| `capital-gains-exemption-single-apartment-2026` | מס שבח / דירה יחידה |
| `capital-gains-tax-second-apartment` | דירה שנייה |

## Out of scope / non-regression
- No new `src/app/**` routes for fan-out questions
- No MDX rewrites; no Globes pages
- No FAQ schema theater expansion on brand hubs (visible clusters only; keep existing FAQ JSON-LD as-is)
- Do not edit practice-bridge page files (link to them only)

## Verify
`pnpm build` in worktree `/Users/doronavni/avni-guy-wt-fan-out-h2-maps-on-hubs`
