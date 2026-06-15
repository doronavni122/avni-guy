#!/usr/bin/env node
/**
 * Validate reserch/ domain study draft.
 * Usage: node check-research.mjs <file.md> [--profile path]
 */
import { readFileSync } from "node:fs"
import { loadProfile } from "./lib/load-profile.mjs"

function fail(msg) {
  console.error(`[check-research] FAIL: ${msg}`)
  process.exitCode = 1
}

function pass(msg) {
  console.log(`[check-research] OK: ${msg}`)
}

function parseArgs(argv) {
  const args = { file: null, profilePath: null }
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--profile") args.profilePath = argv[++i]
    else if (!argv[i].startsWith("--")) args.file = argv[i]
  }
  return args
}

const args = parseArgs(process.argv)
if (!args.file) {
  console.error("Usage: node check-research.mjs <path/to/research.md> [--profile path]")
  process.exit(1)
}

let profile = { researchSectionAliases: [] }
try {
  profile = loadProfile(process.cwd(), args.profilePath).profile
} catch {
  // optional profile for CI fixture-only runs
}

let raw
try {
  raw = readFileSync(args.file, "utf8")
} catch (e) {
  fail(`cannot read ${args.file}: ${e.message}`)
  process.exit(1)
}

const words = raw.split(/\s+/).filter(Boolean).length
if (words < 2000) fail(`word count ${words} < 2000`)

const urls = new Set([...raw.matchAll(/https?:\/\/[^\s)>\]]+/g)].map((m) => m[0]))
if (urls.size < 20) fail(`citations/URLs ${urls.size} < 20`)

const headings = [...raw.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].toLowerCase())
const bodyLower = raw.toLowerCase()

const requiredPatterns = [
  { name: "research question", pat: /research question|research question/i },
  { name: "SMART objectives", pat: /smart objectives|objectives/i },
  { name: "hypotheses", pat: /hypotheses|exploratory aims/i },
  { name: "literature gap", pat: /literature gap|background/i },
  { name: "methodology", pat: /methodology|method/i },
  { name: "findings", pat: /findings|results/i },
  { name: "limitations", pat: /limitations|limitation/i },
  { name: "sources", pat: /sources|references|bibliography/i },
]

for (const { name, pat } of requiredPatterns) {
  const found =
    headings.some((h) => pat.test(h)) ||
    pat.test(bodyLower) ||
    (profile.researchSectionAliases || []).some((a) => bodyLower.includes(a.toLowerCase()))
  if (!found) fail(`missing required section: ${name}`)
}

const serpSignals = (raw.match(/SERP|keyword volume|search volume|search ranking|ranking report/gi) || []).length
const domainSignals = (raw.match(/methodology|hypothesis|limitations|peer-reviewed|domain study/gi) || []).length
if (serpSignals >= 5 && domainSignals < 3) {
  fail("appears SEO-keyword report not domain study")
}
if (/SERP keyword report|keyword volume analysis/i.test(raw) && !/not SERP|NOT SERP|no SERP|domain study/i.test(raw)) {
  fail("appears SEO-keyword report not domain study")
}

if (!process.exitCode) pass(`${args.file} (${words} words, ${urls.size} URLs)`)
