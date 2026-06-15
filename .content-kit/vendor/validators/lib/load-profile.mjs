import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

const REQUIRED = [
  "kitVersion",
  "stack",
  "brand",
  "siteDomain",
  "language",
  "contentRoot",
  "publishPrefix",
  "primaryCta",
  "primaryServiceAnchor",
  "faqHeading",
]

export function loadProfile(projectRoot = process.cwd(), profilePath) {
  const path = profilePath || join(projectRoot, "content-pipeline.profile.json")
  if (!existsSync(path)) {
    throw new Error(`missing profile: ${path}`)
  }
  const profile = JSON.parse(readFileSync(path, "utf8"))
  for (const key of REQUIRED) {
    if (profile[key] === undefined || profile[key] === "") {
      throw new Error(`profile missing required field: ${key}`)
    }
  }
  profile.linkDenylist = profile.linkDenylist || []
  profile.linksSectionHeading = profile.linksSectionHeading || "Related links"
  profile.subjectManifest = profile.subjectManifest || "subject-manifest.json"
  profile.registryAdapter = profile.registryAdapter || "generic"
  profile.researchDir = profile.researchDir || "reserch/"
  profile.articleDraftDir = profile.articleDraftDir || "reserch-based-articles/"
  profile.tldrHeadingAliases = profile.tldrHeadingAliases || []
  profile.faqHeadingAliases = profile.faqHeadingAliases || []
  profile.linksSectionHeadingAliases = profile.linksSectionHeadingAliases || []
  profile.researchSectionAliases = profile.researchSectionAliases || []
  return { profile, path }
}

export function loadManifest(projectRoot, manifestPath, profile) {
  const path = manifestPath || join(projectRoot, profile.subjectManifest)
  if (!existsSync(path)) {
    return { path, data: null }
  }
  return { path, data: JSON.parse(readFileSync(path, "utf8")) }
}

export function findSubject(manifest, nnnn) {
  if (!manifest?.subjects) return null
  return manifest.subjects.find((s) => s.nnnn === nnnn) || null
}
