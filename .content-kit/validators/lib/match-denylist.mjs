export function urlMatchesDenylist(url, denylist) {
  if (!denylist?.length) return false
  for (const pattern of denylist) {
    const p = pattern.trim()
    if (!p) continue
    if (p.startsWith("*.")) {
      const tld = p.slice(2)
      try {
        const host = new URL(url).hostname
        if (host.endsWith(tld) || host.endsWith(`.${tld}`)) return true
      } catch {
        if (url.includes(tld)) return true
      }
      continue
    }
    if (url.includes(p)) return true
  }
  return false
}

export function findDenylistViolations(text, denylist) {
  const urls = [...text.matchAll(/https?:\/\/[^\s)>\]"']+/g)].map((m) => m[0])
  return urls.filter((u) => urlMatchesDenylist(u, denylist))
}
