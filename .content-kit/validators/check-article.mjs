#!/usr/bin/env node
/**
 * Validate reserch-based-articles draft (profile-driven).
 * Usage: node check-article.mjs <file.md> [--profile path] [--manifest path] [--subject-nnnn 0001]
 */
import { readFileSync } from "node:fs"
import { loadManifest, loadProfile, findSubject } from "./lib/load-profile.mjs"
import { findDenylistViolations } from "./lib/match-denylist.mjs"
import { validateSeoFrontmatter } from "./lib/parse-frontmatter.mjs"
import { faqHeadings, linksSectionHeadings, escapeRegex, matchesHeading } from "./lib/heading-aliases.mjs"
import {
  splitArticle,
  parseH2Sections,
  extractInternalLinks,
  countHomepageLinks,
  findTldrSection,
  countFaqItems,
  proseEmDashes,
  pathInBody,
  validateHomepageAnchor,
  hasTldrLinkListOnly,
  validateSourceAnchors,
} from "./lib/parse-article.mjs"

function fail(msg) {
  console.error(`[check-article] FAIL: ${msg}`)
  process.exitCode = 1
}

function pass(msg) {
  console.log(`[check-article] OK: ${msg}`)
}

function parseArgs(argv) {
  const args = { file: null, profilePath: null, manifestPath: null, nnnn: null }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--profile") args.profilePath = argv[++i]
    else if (a === "--manifest") args.manifestPath = argv[++i]
    else if (a === "--subject-nnnn") args.nnnn = argv[++i]
    else if (!a.startsWith("--")) args.file = a
  }
  return args
}

const args = parseArgs(process.argv)
if (!args.file) {
  console.error("Usage: node check-article.mjs <file.md> [--profile path] [--manifest path] [--subject-nnnn 0001]")
  process.exit(1)
}

let raw
try {
  raw = readFileSync(args.file, "utf8")
} catch (e) {
  fail(`cannot read ${args.file}: ${e.message}`)
  process.exit(1)
}

let profile
try {
  profile = loadProfile(process.cwd(), args.profilePath).profile
} catch (e) {
  fail(e.message)
  process.exit(1)
}

const { yaml, body, error } = splitArticle(raw)
if (error) fail(error)

const { errors: fmErrors } = validateSeoFrontmatter(yaml, profile)
for (const e of fmErrors) fail(e)

if (/[«»]/.test(raw)) fail("guillemets present — remove before publish")

const linkHeadings = linksSectionHeadings(profile)
const bottomPatterns = linkHeadings.map((h) => escapeRegex(h)).join("|")
const bottomRe = new RegExp(`^##\\s+(${bottomPatterns})`, "im")
if (bottomRe.test(body)) fail("bottom link-list section still present (Phase 5)")

const sections = parseH2Sections(body)
if (sections.length < 4) fail(`need ≥4 H2 sections, found ${sections.length}`)

const faqAliases = faqHeadings(profile)
const faqSection = sections.find((s) => matchesHeading(s.heading, faqAliases))
if (!faqSection) {
  fail(`no FAQ section (faqHeading: ${profile.faqHeading})`)
} else {
  const faqCount = countFaqItems(faqSection.text)
  if (faqCount < 5 || faqCount > 8) fail(`FAQ items count ${faqCount} — expect 5–6 (tolerance to 8)`)
}

const tldr = findTldrSection(sections, profile)
if (tldr) {
  const bullets = (tldr.text.match(/^[-*]\s+/gm) || []).length
  if (bullets < 3 || bullets > 6) fail(`TL;DR bullets ${bullets} — need 3–6`)
  if (!tldr.text.includes(`](${profile.primaryCta})`) && !tldr.text.includes(profile.primaryCta)) {
    fail(`TL;DR missing CTA link to ${profile.primaryCta}`)
  }
  if (hasTldrLinkListOnly(tldr.text, profile)) fail("TL;DR link-list-only block")
}

const homeCount = countHomepageLinks(body, profile.siteDomain)
if (homeCount !== 1) fail(`homepage links: ${homeCount} — need exactly 1`)

const anchorCheck = validateHomepageAnchor(body, profile.primaryServiceAnchor)
if (!anchorCheck.ok) fail(anchorCheck.message)

const sourceCheck = validateSourceAnchors(body)
if (!sourceCheck.ok) {
  for (const msg of sourceCheck.messages) fail(msg)
}

const internal = extractInternalLinks(body)
if (internal.length < 3) fail(`internal links ${internal.length} < 3`)

const sectionsWithLinks = sections.filter((s) => extractInternalLinks(s.text).length > 0)
if (sectionsWithLinks.length < 4) {
  fail(`H2 sections with internal links: ${sectionsWithLinks.length} — need ≥4`)
}

const denyViolations = findDenylistViolations(body, profile.linkDenylist)
if (denyViolations.length) fail(`denylist violations: ${denyViolations.join(", ")}`)

const emHits = proseEmDashes(body)
if (emHits.length) fail(`em dash — in prose at line(s): ${emHits.map((h) => h.line).join(", ")}`)

const { data: manifest } = loadManifest(process.cwd(), args.manifestPath, profile)
if (manifest && args.nnnn) {
  const subject = findSubject(manifest, args.nnnn)
  if (subject?.internalLinkManifest) {
    const tldrText = tldr?.text || ""
    for (const p of subject.internalLinkManifest) {
      if (!pathInBody(p, body, tldrText)) fail(`manifest path missing in body: ${p}`)
    }
  }
}

if (!process.exitCode) pass(args.file)
