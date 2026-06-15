#!/usr/bin/env node
/**
 * Phase 6 batch audit — all subjects in manifest.
 * Usage: node check-batch.mjs [--manifest path] [--dir path] [--profile path]
 */
import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { loadManifest, loadProfile } from "./lib/load-profile.mjs"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const checkArticle = join(__dirname, "check-article.mjs")

function parseArgs(argv) {
  const args = { manifestPath: null, dir: null, profilePath: null }
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--manifest") args.manifestPath = argv[++i]
    else if (argv[i] === "--dir") args.dir = argv[++i]
    else if (argv[i] === "--profile") args.profilePath = argv[++i]
  }
  return args
}

const args = parseArgs(process.argv)
const projectRoot = process.cwd()

let profile
try {
  profile = loadProfile(projectRoot, args.profilePath).profile
} catch (e) {
  console.error(`[check-batch] FAIL: ${e.message}`)
  process.exit(1)
}

const articleDirName = args.dir || profile.articleDraftDir
const { path: manifestPath, data: manifest } = loadManifest(projectRoot, args.manifestPath, profile)
if (!manifest?.subjects?.length) {
  console.error(`[check-batch] FAIL: no subjects in ${manifestPath}`)
  process.exit(1)
}

const articleDir = join(projectRoot, articleDirName)
if (!existsSync(articleDir)) {
  console.error(`[check-batch] FAIL: missing dir ${articleDir}`)
  process.exit(1)
}

const files = readdirSync(articleDir).filter((f) => f.endsWith(".md"))
let failed = 0
const rows = []

for (const subject of manifest.subjects) {
  const prefix = `${subject.nnnn}_`
  const match = files.find((f) => f.startsWith(prefix))
  if (!match) {
    rows.push({ nnnn: subject.nnnn, file: "-", status: "MISSING" })
    failed++
    continue
  }
  const filePath = join(articleDir, match)
  const r = spawnSync(
    process.execPath,
    [
      checkArticle,
      filePath,
      "--manifest",
      manifestPath,
      "--subject-nnnn",
      subject.nnnn,
      ...(args.profilePath ? ["--profile", args.profilePath] : []),
    ],
    { cwd: projectRoot, encoding: "utf8" }
  )
  const ok = r.status === 0
  if (!ok) failed++
  rows.push({ nnnn: subject.nnnn, file: match, status: ok ? "PASS" : "FAIL" })
}

console.log("\n[check-batch] Summary")
console.log("NNNN | File | Status")
for (const row of rows) {
  console.log(`${row.nnnn} | ${row.file} | ${row.status}`)
}

if (failed) {
  console.error(`[check-batch] FAIL: ${failed} subject(s)`)
  process.exit(1)
}
console.log(`[check-batch] OK: ${rows.length} subjects`)
