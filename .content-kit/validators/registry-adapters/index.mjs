import { slugInRegistry as nextGuide } from "./next-guide.mjs"
import { slugInRegistry as astroBlog } from "./astro-blog.mjs"
import { slugInRegistry as researchOnly } from "./research-only.mjs"
import { slugInRegistry as generic } from "./generic.mjs"

const adapters = {
  "next-guide": nextGuide,
  "astro-blog": astroBlog,
  generic,
  none: researchOnly,
}

export function checkRegistrySlugs({ profile, manifest, projectRoot, readFile }) {
  const adapterName = profile.registryAdapter || "generic"
  if (adapterName === "none" || profile.stack === "research-only") {
    return { ok: true, skipped: true, message: "registry check skipped" }
  }
  if (!profile.contentRegistry) {
    return { ok: true, skipped: true, message: "no contentRegistry in profile" }
  }
  if (!manifest?.subjects?.length) {
    return { ok: true, skipped: true, message: "no manifest subjects" }
  }

  let registryText
  try {
    registryText = readFile(profile.contentRegistry)
  } catch (e) {
    return { ok: false, message: `cannot read registry: ${e.message}` }
  }

  const check = adapters[adapterName] || generic
  const missing = []
  for (const s of manifest.subjects) {
    const found = check(registryText, s.slug, s.contentFile)
    if (!found) missing.push(s.slug)
  }

  if (missing.length) {
    return { ok: false, message: `slugs missing from registry: ${missing.join(", ")}` }
  }
  return { ok: true, message: "all manifest slugs in registry" }
}
