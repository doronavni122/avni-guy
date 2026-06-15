/**
 * Parse nested seo frontmatter per article-frontmatter.schema.json
 */
export function parseYamlBlock(yamlText) {
  const lines = yamlText.split("\n")
  const root = {}
  const stack = [{ indent: -1, obj: root, key: null }]

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim() || line.trim().startsWith("#")) continue
    const indent = line.search(/\S/)
    const trimmed = line.trim()

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop()
    }
    const frame = stack[stack.length - 1]

    const listMatch = trimmed.match(/^- (.+)$/)
    if (listMatch) {
      const val = unquote(listMatch[1])
      if (Array.isArray(frame.obj)) {
        frame.obj.push(val)
      } else if (frame.key && frame.parent) {
        if (!Array.isArray(frame.parent[frame.key])) frame.parent[frame.key] = []
        frame.parent[frame.key].push(val)
      }
      continue
    }

    const kv = trimmed.match(/^([^:]+):\s*(.*)$/)
    if (!kv) continue
    const key = kv[1].trim()
    const rawVal = kv[2].trim()
    const parent = frame.obj

    if (rawVal === "") {
      const child = {}
      parent[key] = child
      stack.push({ indent, obj: child, key, parent })
      continue
    }

    if (rawVal.startsWith("[") && rawVal.endsWith("]")) {
      parent[key] = parseInlineArray(rawVal)
      continue
    }

    parent[key] = parseScalar(rawVal)
  }

  return root
}

function parseInlineArray(raw) {
  const inner = raw.slice(1, -1).trim()
  if (!inner) return []
  return inner.split(",").map((s) => unquote(s.trim()))
}

function parseScalar(raw) {
  return unquote(raw)
}

function unquote(s) {
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1)
  }
  return s
}

export function validateSeoFrontmatter(yamlText, profile) {
  const errors = []
  const data = parseYamlBlock(yamlText)

  if (data.title || data.description || data.slug) {
    errors.push("flat frontmatter keys not allowed — use nested seo: block")
    return { seo: null, errors }
  }

  const seo = data.seo
  if (!seo || typeof seo !== "object") {
    errors.push("frontmatter missing nested seo block")
    return { seo: null, errors }
  }

  const required = ["title", "description", "slug", "canonical", "dateModified", "keywords"]
  for (const key of required) {
    if (seo[key] === undefined || seo[key] === "") {
      errors.push(`seo.${key} missing`)
    }
  }

  if (seo.title && seo.title.length < 10) {
    errors.push("seo.title too short (min 10)")
  }

  if (seo.description) {
    const len = String(seo.description).length
    if (len < 120 || len > 165) {
      errors.push(`seo.description length ${len} not in 120–165`)
    }
  }

  if (seo.slug && !/^\/[^\s]*$/.test(seo.slug)) {
    errors.push(`seo.slug must start with / (got ${seo.slug})`)
  }

  if (seo.canonical && !/^\/[^\s]*$/.test(seo.canonical)) {
    errors.push(`seo.canonical must start with / (got ${seo.canonical})`)
  }

  if (profile?.publishPrefix && seo.slug && !seo.slug.startsWith(profile.publishPrefix)) {
    errors.push(`seo.slug must start with publishPrefix ${profile.publishPrefix}`)
  }

  if (profile?.publishPrefix && seo.canonical && !seo.canonical.startsWith(profile.publishPrefix)) {
    errors.push(`seo.canonical must start with publishPrefix ${profile.publishPrefix}`)
  }

  if (seo.dateModified && !/^\d{4}-\d{2}-\d{2}$/.test(seo.dateModified)) {
    errors.push("seo.dateModified must be YYYY-MM-DD")
  }

  if (!Array.isArray(seo.keywords) || seo.keywords.length < 3) {
    errors.push("seo.keywords must be array with ≥3 items")
  }

  return { seo, errors }
}
