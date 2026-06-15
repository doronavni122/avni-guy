#!/usr/bin/env node
/**
 * Content SEO Kit — project sync (install | check | diff | update)
 *
 * Safety:
 * - managed: updatable only with --approve; blocked if locally modified since install
 * - template-once: copied on init if missing; never auto-overwritten
 * - optional: copy on init if missing only
 * - --dry-run default for update; use --approve to apply
 */
import { createHash } from "node:crypto"
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

function sha256(content) {
  return createHash("sha256").update(content).digest("hex")
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"))
}

function parseArgs(argv) {
  const args = {
    command: argv[2] || "check",
    project: process.cwd(),
    kitPath: process.env.CONTENT_KIT_PATH || "",
    profile: "default",
    dryRun: true,
    approve: false,
    acceptTemplates: new Set(),
    forceManaged: new Set(),
  }
  for (let i = 3; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--project") args.project = resolve(argv[++i])
    else if (a === "--kit-path") args.kitPath = resolve(argv[++i])
    else if (a === "--profile") args.profile = argv[++i]
    else if (a === "--dry-run") args.dryRun = true
    else if (a === "--approve") {
      args.approve = true
      args.dryRun = false
    }
    else if (a === "--accept-template") args.acceptTemplates.add(argv[++i])
    else if (a === "--force-managed") args.forceManaged.add(argv[++i])
    else if (a === "--help") args.help = true
  }
  return args
}

function resolveKitPath(args) {
  if (args.kitPath && existsSync(join(args.kitPath, "MANIFEST.json"))) {
    return args.kitPath
  }
  const vendor = join(args.project, ".content-kit", "vendor")
  if (existsSync(join(vendor, "MANIFEST.json"))) return vendor
  const sibling = resolve(__dirname, "..")
  if (existsSync(join(sibling, "MANIFEST.json"))) return sibling
  throw new Error(
    "Kit not found. Set CONTENT_KIT_PATH, clone to .content-kit/vendor, or run from kit repo."
  )
}

function ensureDirFor(filePath) {
  mkdirSync(dirname(filePath), { recursive: true })
}

function loadManifest(kitPath) {
  return readJson(join(kitPath, "MANIFEST.json"))
}

function loadLock(project) {
  const lockPath = join(project, ".content-kit", "kit.lock.json")
  if (!existsSync(lockPath)) return null
  return { path: lockPath, data: readJson(lockPath) }
}

function saveLock(lockPath, data) {
  ensureDirFor(lockPath)
  writeFileSync(lockPath, `${JSON.stringify(data, null, 2)}\n`, "utf8")
}

function fileState(project, projectPath) {
  const full = join(project, projectPath)
  if (!existsSync(full)) return { exists: false, sha256: null, content: null }
  const content = readFileSync(full, "utf8")
  return { exists: true, sha256: sha256(content), content }
}

function kitFileState(kitPath, kitPathRel) {
  const full = join(kitPath, kitPathRel)
  const content = readFileSync(full, "utf8")
  return { sha256: sha256(content), content }
}

function copyKitToProject(kitPath, entry, project, dryRun) {
  const src = join(kitPath, entry.kitPath)
  const dest = join(project, entry.projectPath)
  if (dryRun) {
    console.log(`  [dry-run] would copy ${entry.kitPath} → ${entry.projectPath}`)
    return
  }
  ensureDirFor(dest)
  copyFileSync(src, dest)
  console.log(`  copied ${entry.kitPath} → ${entry.projectPath}`)
}

function installProfile(kitPath, profile, project, dryRun) {
  const src = join(kitPath, "profiles", `${profile}.profile.json`)
  const dest = join(project, "content-pipeline.profile.json")
  if (!existsSync(src)) throw new Error(`Unknown profile: ${profile}`)
  if (existsSync(dest)) {
    console.log(`  skip profile (exists): content-pipeline.profile.json`)
    return
  }
  if (dryRun) {
    console.log(`  [dry-run] would copy profile ${profile} → content-pipeline.profile.json`)
    return
  }
  copyFileSync(src, dest)
  console.log(`  copied profile ${profile} → content-pipeline.profile.json`)
}

function cmdInit(args, kitPath, manifest) {
  const lockPath = join(args.project, ".content-kit", "kit.lock.json")
  if (existsSync(lockPath) && !args.approve) {
    console.error("Already installed. Use `update` or `init --approve` to reinstall lock.")
    process.exit(1)
  }
  const dryRun = !args.approve
  console.log(`${dryRun ? "[dry-run] " : ""}init kit ${manifest.kitVersion} → ${args.project}`)
  installProfile(kitPath, args.profile, args.project, dryRun)
  const lock = {
    kitVersion: manifest.kitVersion,
    kitSource: process.env.CONTENT_KIT_REPO || "content-seo-kit",
    installedAt: new Date().toISOString(),
    profile: args.profile,
    files: {},
  }
  for (const entry of manifest.entries) {
    if (entry.policy === "managed-by-sync") continue
    const kit = kitFileState(kitPath, entry.kitPath)
    const proj = fileState(args.project, entry.projectPath)
    if (entry.policy === "template-once" && proj.exists) {
      console.log(`  skip template (exists): ${entry.projectPath}`)
      lock.files[entry.projectPath] = {
        id: entry.id,
        policy: entry.policy,
        sha256: proj.sha256,
        kitSha256: kit.sha256,
      }
      continue
    }
    if (entry.policy === "optional" && proj.exists) {
      lock.files[entry.projectPath] = {
        id: entry.id,
        policy: entry.policy,
        sha256: proj.sha256,
        kitSha256: kit.sha256,
      }
      continue
    }
    copyKitToProject(kitPath, entry, args.project, dryRun)
    lock.files[entry.projectPath] = {
      id: entry.id,
      policy: entry.policy,
      sha256: kit.sha256,
      kitSha256: kit.sha256,
    }
  }
  if (!dryRun) {
    saveLock(lockPath, lock)
    mkdirSync(join(args.project, "reserch"), { recursive: true })
    mkdirSync(join(args.project, "reserch-based-articles"), { recursive: true })
    console.log("init complete.")
  }
}

function analyzeUpdates(args, kitPath, manifest, lock) {
  const changes = []
  const blocked = []
  for (const entry of manifest.entries) {
    if (entry.policy === "managed-by-sync" || entry.policy === "optional") continue
    const kit = kitFileState(kitPath, entry.kitPath)
    const proj = fileState(args.project, entry.projectPath)
    const prev = lock?.data?.files?.[entry.projectPath]
    if (entry.policy === "template-once") {
      if (!proj.exists) changes.push({ entry, kind: "missing-template", kit })
      else if (prev && kit.sha256 !== prev.kitSha256) {
        if (args.acceptTemplates.has(entry.id)) changes.push({ entry, kind: "template-accepted", kit })
        else blocked.push({ entry, reason: "template-once changed in kit; use --accept-template " + entry.id })
      }
      continue
    }
    if (entry.policy !== "managed") continue
    if (!proj.exists) {
      changes.push({ entry, kind: "add", kit })
      continue
    }
    if (kit.sha256 === proj.sha256) continue
    const locallyModified = prev && prev.sha256 && proj.sha256 !== prev.sha256
    if (locallyModified && !args.forceManaged.has(entry.id)) {
      blocked.push({
        entry,
        reason: `local modifications detected; use --force-managed ${entry.id} to overwrite`,
      })
      continue
    }
    changes.push({ entry, kind: "update", kit })
  }
  return { changes, blocked }
}

function cmdDiffOrUpdate(args, kitPath, manifest, lock, mode) {
  const { changes, blocked } = analyzeUpdates(args, kitPath, manifest, lock)
  if (blocked.length) {
    console.log("BLOCKED:")
    for (const b of blocked) console.log(`  - ${b.entry.projectPath}: ${b.reason}`)
  }
  if (!changes.length && !blocked.length) {
    console.log("Kit is up to date.")
    return
  }
  if (changes.length) {
    console.log(`${mode === "diff" ? "CHANGES" : args.dryRun ? "PLANNED" : "APPLYING"}:`)
    for (const c of changes) {
      console.log(`  - [${c.kind}] ${c.entry.kitPath} → ${c.entry.projectPath}`)
    }
  }
  if (mode === "diff" || args.dryRun || !args.approve) {
    if (!args.approve && changes.length) {
      console.log("\nRe-run with --approve to apply managed updates.")
    }
    if (blocked.length) process.exitCode = 2
    return
  }
  const lockData = lock?.data || {
    kitVersion: manifest.kitVersion,
    kitSource: process.env.CONTENT_KIT_REPO || "content-seo-kit",
    installedAt: new Date().toISOString(),
    profile: args.profile,
    files: {},
  }
  for (const c of changes) {
    copyKitToProject(kitPath, c.entry, args.project, false)
    const proj = fileState(args.project, c.entry.projectPath)
    lockData.files[c.entry.projectPath] = {
      id: c.entry.id,
      policy: c.entry.policy,
      sha256: proj.sha256,
      kitSha256: c.kit.sha256,
    }
  }
  lockData.kitVersion = manifest.kitVersion
  lockData.updatedAt = new Date().toISOString()
  saveLock(join(args.project, ".content-kit", "kit.lock.json"), lockData)
  console.log("update complete.")
}

function cmdCheck(args, kitPath, manifest, lock) {
  if (!lock) {
    console.error("Not installed: missing .content-kit/kit.lock.json — run init first.")
    process.exit(1)
  }
  const { changes, blocked } = analyzeUpdates(args, kitPath, manifest, lock)
  console.log(`kit: ${manifest.kitVersion} (lock: ${lock.data.kitVersion})`)
  console.log(`pending changes: ${changes.length}, blocked: ${blocked.length}`)
  if (lock.data.kitVersion !== manifest.kitVersion) {
    console.log("  version drift — run: node scripts/content-kit-sync.mjs diff")
  }
  if (blocked.length || changes.length) process.exitCode = 1
}

function main() {
  const args = parseArgs(process.argv)
  if (args.help) {
    console.log(`Usage:
  node project-sync.mjs init --profile next-guide [--approve]
  node project-sync.mjs check
  node project-sync.mjs diff [--accept-template <id>] [--force-managed <id>]
  node project-sync.mjs update --approve [--accept-template <id>] [--force-managed <id>]

Env: CONTENT_KIT_PATH, CONTENT_KIT_REPO`)
    return
  }
  const kitPath = resolveKitPath(args)
  const manifest = loadManifest(kitPath)
  const lock = loadLock(args.project)
  if (args.command === "init") cmdInit(args, kitPath, manifest)
  else if (args.command === "check") cmdCheck(args, kitPath, manifest, lock)
  else if (args.command === "diff") cmdDiffOrUpdate(args, kitPath, manifest, lock, "diff")
  else if (args.command === "update") cmdDiffOrUpdate(args, kitPath, manifest, lock, "update")
  else {
    console.error(`Unknown command: ${args.command}`)
    process.exit(1)
  }
}

main()
