const GUILLEMET_RE = /[«»]/g

export function stripGuillemets(text: string): string {
  return text.replace(GUILLEMET_RE, "")
}
