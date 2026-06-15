#!/usr/bin/env node
/**
 * Validate JSON schemas against fixture profiles/manifests.
 */
import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"

function fail(msg) {
  console.error(`[validate-schemas] FAIL: ${msg}`)
  process.exitCode = 1
}

function pass(msg) {
  console.log(`[validate-schemas] OK: ${msg}`)
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"))
}

function validateProfile(profile, schema) {
  const errors = []
  for (const key of schema.required || []) {
    if (profile[key] === undefined || profile[key] === "") {
      errors.push(`missing ${key}`)
    }
  }
  if (profile.kitVersion && schema.properties?.kitVersion?.pattern) {
    if (!new RegExp(schema.properties.kitVersion.pattern).test(profile.kitVersion)) {
      errors.push(`invalid kitVersion ${profile.kitVersion}`)
    }
  }
  if (profile.stack && schema.properties?.stack?.enum) {
    if (!schema.properties.stack.enum.includes(profile.stack)) {
      errors.push(`invalid stack ${profile.stack}`)
    }
  }
  return errors
}

const root = process.cwd()
const profileSchema = loadJson(join(root, "schemas/project-profile.schema.json"))

const profiles = [
  "profiles/default.profile.json",
  "profiles/_active.profile.json",
  "profiles/next-guide.profile.json",
  "fixtures/profile-fixture.json",
  "fixtures/next-guide-fixture.profile.json",
]

for (const p of profiles) {
  if (!existsSync(join(root, p))) {
    fail(`missing ${p}`)
    continue
  }
  const data = loadJson(join(root, p))
  const errs = validateProfile(data, profileSchema)
  if (errs.length) fail(`${p}: ${errs.join(", ")}`)
  else pass(p)
}

const manifestSchema = loadJson(join(root, "schemas/subject-manifest.schema.json"))
const manifestPath = join(root, "fixtures/manifest-fixture.json")
if (existsSync(manifestPath)) {
  const m = loadJson(manifestPath)
  if (!m.subjects?.length) fail("manifest-fixture has no subjects")
  else pass("manifest-fixture.json")
}

if (!process.exitCode) pass("schema validation complete")
