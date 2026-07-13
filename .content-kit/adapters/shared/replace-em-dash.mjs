/** U+2014 em dash → ASCII hyphen in user-facing copy. */
export const EM_DASH = "\u2014"

const EM_DASH_RE = /\u2014/g

/**
 * Replace every em dash (—) with a hyphen (-) in a string.
 * @param {string} text
 * @returns {string}
 */
export function replaceEmDashInText(text) {
  if (typeof text !== "string" || !text.includes(EM_DASH)) return text
  return text.replace(EM_DASH_RE, "-")
}

/**
 * Recursively replace em dashes in all string leaves (objects, arrays, primitives).
 * @template T
 * @param {T} value
 * @returns {T}
 */
export function replaceEmDashDeep(value) {
  if (typeof value === "string") return replaceEmDashInText(value)
  if (Array.isArray(value)) return value.map((item) => replaceEmDashDeep(item))
  if (value instanceof Date) return value
  if (value && typeof value === "object") {
    /** @type {Record<string, unknown>} */
    const out = {}
    for (const [key, nested] of Object.entries(value)) {
      out[key] = replaceEmDashDeep(nested)
    }
    return /** @type {T} */ (out)
  }
  return value
}
