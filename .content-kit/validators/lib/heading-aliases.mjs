const DEFAULT_TLDR = ["TL;DR", "Summary", "In brief"]
const DEFAULT_LINKS = ["Links", "Related links"]

export function headingAliases(profile, field, defaults = []) {
  const primary = profile[field]
  const extra = profile[`${field}Aliases`] || []
  const list = []
  if (primary) list.push(primary)
  for (const a of extra) if (a && !list.includes(a)) list.push(a)
  for (const d of defaults) if (!list.includes(d)) list.push(d)
  return list
}

export function tldrHeadings(profile) {
  return headingAliases(profile, "tldrHeading", DEFAULT_TLDR)
}

export function faqHeadings(profile) {
  return headingAliases(profile, "faqHeading", ["FAQ"])
}

export function linksSectionHeadings(profile) {
  return headingAliases(profile, "linksSectionHeading", DEFAULT_LINKS)
}

export function matchesHeading(heading, aliases) {
  const h = heading.trim().toLowerCase()
  return aliases.some((a) => a.trim().toLowerCase() === h)
}

export function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
