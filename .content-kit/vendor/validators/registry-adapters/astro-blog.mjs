export function slugInRegistry(registryText, slug, contentFile) {
  return registryText.includes(slug) || (contentFile && registryText.includes(contentFile))
}
