export function slugInRegistry(registryText, slug, contentFile) {
  const slugOk = new RegExp(`slug:\\s*["']${slug}["']`).test(registryText)
  const fileOk = contentFile ? registryText.includes(contentFile) : true
  return slugOk && fileOk
}
