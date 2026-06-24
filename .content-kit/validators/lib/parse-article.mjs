import { matchesHeading, tldrHeadings } from "./heading-aliases.mjs"

const INTERNAL_LINK = /\]\((\/[^)]*)\)/g
const EXTERNAL_LINK = /\]\((https?:\/\/[^)]+)\)/gi
const MD_LINK = /\[([^\]]*)\]\((\/[^)]*)\)/g

export function splitArticle(raw) {
  if (!raw.startsWith("---\n")) {
    return { yaml: null, body: raw, error: "missing YAML frontmatter" }
  }
  const end = raw.indexOf("\n---\n", 4)
  if (end === -1) {
    return { yaml: null, body: raw, error: "unclosed YAML frontmatter" }
  }
  return {
    yaml: raw.slice(4, end),
    body: raw.slice(end + 5),
    error: null,
  }
}

export function parseH2Sections(body) {
  const lines = body.split("\n")
  const sections = []
  let current = null
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const m = line.match(/^##\s+(.+)$/)
    if (m) {
      if (current) sections.push(current)
      current = { heading: m[1].trim(), start: i, lines: [], text: "" }
      continue
    }
    if (current) current.lines.push(line)
  }
  if (current) sections.push(current)
  for (const s of sections) {
    s.text = s.lines.join("\n")
  }
  return sections
}

export function extractInternalLinks(text) {
  return [...text.matchAll(INTERNAL_LINK)].map((m) => m[1])
}

export function extractExternalLinks(text) {
  return [...text.matchAll(EXTERNAL_LINK)].map((m) => m[1])
}

export function isHomepageLink(href, siteDomain) {
  if (href === "/" || href === "") return true
  if (!siteDomain) return false
  try {
    const u = new URL(href)
    const base = new URL(siteDomain)
    return u.origin === base.origin && (u.pathname === "/" || u.pathname === "")
  } catch {
    return false
  }
}

export function countHomepageLinks(body, siteDomain) {
  const internal = extractInternalLinks(body)
  const external = extractExternalLinks(body)
  let count = 0
  for (const h of internal) {
    if (h === "/") count++
  }
  for (const h of external) {
    if (isHomepageLink(h, siteDomain)) count++
  }
  return count
}

export function findHomepageLinkAnchors(body) {
  const anchors = []
  for (const m of body.matchAll(MD_LINK)) {
    if (m[2] === "/") anchors.push(m[1].trim())
  }
  return anchors
}

export function anchorMatchesService(anchorText, primaryServiceAnchor) {
  if (!primaryServiceAnchor || !anchorText) return false
  const tokens = primaryServiceAnchor
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 4)
  if (!tokens.length) {
    return anchorText.toLowerCase().includes(primaryServiceAnchor.toLowerCase())
  }
  const anchor = anchorText.toLowerCase()
  return tokens.some((t) => anchor.includes(t))
}

export function validateHomepageAnchor(body, primaryServiceAnchor) {
  const anchors = findHomepageLinkAnchors(body)
  if (anchors.length !== 1) {
    return { ok: false, message: `homepage link anchors: ${anchors.length} (need exactly 1)` }
  }
  if (!anchorMatchesService(anchors[0], primaryServiceAnchor)) {
    return {
      ok: false,
      message: `homepage link anchor must reference primaryServiceAnchor (${primaryServiceAnchor})`,
    }
  }
  return { ok: true }
}

export function findTldrSection(sections, profile) {
  const aliases = tldrHeadings(profile)
  const match = sections.find((s) => matchesHeading(s.heading, aliases))
  return match || sections[0] || null
}

export function countFaqItems(faqSectionText) {
  const h3 = (faqSectionText.match(/^###\s+/gm) || []).length
  const boldQ = (faqSectionText.match(/^\*\*[^*]+\?\*\*/gm) || []).length
  const qLines = (faqSectionText.match(/^.+\?$/gm) || []).length
  return Math.max(h3, boldQ, Math.min(qLines, h3 + boldQ + 6))
}

export function proseEmDashes(body) {
  const lines = body.split("\n")
  const hits = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.includes("|") && line.trim().startsWith("|")) continue
    if (line.includes("—")) hits.push({ line: i + 1, text: line.trim().slice(0, 80) })
  }
  return hits
}

export function pathInBody(path, body, excludeTldrText) {
  const rest = excludeTldrText ? body.replace(excludeTldrText, "") : body
  const variants = [path, path.replace(/\/$/, ""), `${path}/`]
  return variants.some((v) => rest.includes(`](${v})`) || rest.includes(`](${v}#`))
}

export function hasTldrLinkListOnly(tldrText, profile) {
  const linksHeading = profile.linksSectionHeading || "Related links"
  const pattern = new RegExp(`^\\*\\*${escapeRegex(linksHeading)}:\\*\\*`, "im")
  return pattern.test(tldrText)
}

/** Sources section anchors must use institution names, not generic labels or slugs. */
export function validateSourceAnchors(body) {
  const issues = []
  const lines = body.split("\n").filter((line) => /מקורות/i.test(line))
  for (const line of lines) {
    if (/\|\s*לשכה\s*\]/u.test(line)) {
      issues.push("sources line uses generic anchor 'לשכה' — use full institution name")
    }
    if (/\|\s*מקור\s*רשמי\s*\]/u.test(line)) {
      issues.push("sources line uses generic anchor 'מקור רשמי'")
    }
    if (/\[[a-z0-9-]+\s*\|[^\]]+\]/i.test(line)) {
      issues.push("sources line uses slug-as-anchor pattern (slug | label)")
    }
    if (/\[(https?:\/\/[^\]]+)\]/i.test(line)) {
      issues.push("sources line uses raw URL as anchor text")
    }
  }
  return { ok: issues.length === 0, messages: issues }
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
