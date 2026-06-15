#!/usr/bin/env node
/**
 * Run confidence gate R1, A6, or P.
 * Usage: node run-gate.mjs R1 <research.md>
 *        node run-gate.mjs A6 <article.md> [--manifest path] [--subject-nnnn 0001]
 *        node run-gate.mjs P [--manifest path] [--pre-publish|--post-publish]
 */
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { join } from "node:path"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const gate = process.argv[2]
const target = process.argv[3]
const extra = process.argv.slice(4)

if (!gate || !["R1", "A6", "P"].includes(gate)) {
  console.error("Usage: node run-gate.mjs R1|A6|P [file] [extra args]")
  process.exit(1)
}

let script
let args
if (gate === "R1") {
  if (!target) {
    console.error("R1 requires research file path")
    process.exit(1)
  }
  script = join(__dirname, "check-research.mjs")
  args = [script, target]
} else if (gate === "A6") {
  if (!target) {
    console.error("A6 requires article file path")
    process.exit(1)
  }
  script = join(__dirname, "check-article.mjs")
  args = [script, target, ...extra]
} else {
  script = join(__dirname, "check-publish.mjs")
  args = [script, ...process.argv.slice(3)]
}

const r = spawnSync(process.execPath, args, { stdio: "inherit", cwd: process.cwd() })
process.exit(r.status ?? 1)
