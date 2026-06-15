#!/usr/bin/env node
/**
 * Gate P — publish readiness (profile + manifest + registry).
 * Usage: node check-publish.mjs [--manifest path] [--profile path] [--pre-publish|--post-publish]
 */
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { spawnSync } from "node:child_process"
import { loadManifest, loadProfile } from "./lib/load-profile.mjs"
import { checkRegistrySlugs } from "./registry-adapters/index.mjs"

function fail(msg) {
  console.error(`[check-publish] FAIL: ${msg}`)
  process.exitCode = 1
}

function pass(msg) {
  console.log(`[check-publish] OK: ${msg}`)
}

function parseArgs(argv) {
  const args = {
    manifestPath: null,
    profilePath: null,
    mode: "pre-publish",
  }
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--manifest") args.manifestPath = argv[++i]
    else if (argv[i] === "--profile") args.profilePath = argv[++i]
    else if (argv[i] === "--pre-publish") args.mode = "pre-publish"
    else if (argv[i] === "--post-publish") args.mode = "post-publish"
  }
  return args
}

const args = parseArgs(process.argv)
const projectRoot = process.cwd()

let profile
try {
  profile = loadProfile(projectRoot, args.profilePath).profile
} catch (e) {
  fail(e.message)
  process.exit(1)
}

const optionalPaths = [
  "contentRegistry",
  "markdownLoader",
  "publishRoute",
  "sitemapBuilder",
  "structuredDataModule",
]
for (const key of optionalPaths) {
  const rel = profile[key]
  if (rel) {
    const p = join(projectRoot, rel)
    if (!existsSync(p)) fail(`profile path missing: ${key} → ${rel}`)
    else pass(`path exists: ${key}`)
  }
}

const contentRoot = join(projectRoot, profile.contentRoot)
if (!existsSync(contentRoot)) fail(`contentRoot missing: ${profile.contentRoot}`)
else pass(`contentRoot exists`)

const { path: manifestPath, data: manifest } = loadManifest(projectRoot, args.manifestPath, profile)
if (manifest?.subjects) {
  for (const s of manifest.subjects) {
    if (/\d{4}/.test(s.slug) && /000\d/.test(s.slug)) {
      fail(`slug contains draft id pattern: ${s.slug}`)
    }
    const livePath = join(contentRoot, s.contentFile || `${s.slug}.md`)
    if (!existsSync(livePath)) {
      if (args.mode === "post-publish") fail(`live file missing: ${s.contentFile || s.slug}`)
      else console.warn(`[check-publish] WARN: live file not yet present (Phase 7?): ${s.contentFile || s.slug}`)
    } else pass(`live file: ${s.contentFile || s.slug}`)
  }
}

if (profile.sitemapBuilder && manifest?.subjects?.length) {
  const sitemapPath = join(projectRoot, profile.sitemapBuilder)
  if (existsSync(sitemapPath)) {
    const sitemapText = readFileSync(sitemapPath, "utf8")
    const prefix = profile.publishPrefix.endsWith("/")
      ? profile.publishPrefix
      : `${profile.publishPrefix}/`
    for (const s of manifest.subjects) {
      const publishPath = `${prefix}${s.slug}`.replace(/\/+/g, "/")
      const found =
        sitemapText.includes(publishPath) ||
        sitemapText.includes(s.slug) ||
        sitemapText.includes(s.contentFile || "")
      if (!found) fail(`sitemap missing path for slug: ${s.slug}`)
    }
    if (!process.exitCode) pass("sitemap includes manifest slugs")
  }
}

const syncScript = join(projectRoot, "scripts/content-kit-sync.mjs")
if (existsSync(syncScript)) {
  const r = spawnSync(process.execPath, [syncScript, "check"], {
    cwd: projectRoot,
    encoding: "utf8",
  })
  if (r.status !== 0) fail("content-kit-sync check failed")
  else pass("content-kit-sync check")
} else {
  console.warn("[check-publish] WARN: scripts/content-kit-sync.mjs not found — skip sync check")
}

const reg = checkRegistrySlugs({
  profile,
  manifest,
  projectRoot,
  readFile: (p) => readFileSync(join(projectRoot, p), "utf8"),
})
if (!reg.ok) fail(reg.message)
else if (!reg.skipped) pass(reg.message)

if (args.mode === "post-publish" && profile.buildCommand) {
  console.log(`[check-publish] running buildCommand: ${profile.buildCommand}`)
  const r = spawnSync(profile.buildCommand, {
    shell: true,
    cwd: projectRoot,
    encoding: "utf8",
    stdio: "inherit",
  })
  if (r.status !== 0) fail(`buildCommand failed: ${profile.buildCommand}`)
  else pass(`buildCommand succeeded`)
}

if (!process.exitCode) pass("publish gate ready")
