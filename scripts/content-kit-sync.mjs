// Content kit sync wrapper — run from project root:
//   node scripts/content-kit-sync.mjs check|diff|update|init
import { spawnSync } from "node:child_process"
import { existsSync } from "node:fs"
import { join } from "node:path"

const vendor = join(process.cwd(), ".content-kit", "vendor", "scripts", "project-sync.mjs")
if (!existsSync(vendor)) {
  console.error("Missing .content-kit/vendor — run content-seo-kit install.sh on this project.")
  process.exit(1)
}
const r = spawnSync(process.execPath, [vendor, ...process.argv.slice(2), "--project", process.cwd()], {
  stdio: "inherit",
})
process.exit(r.status ?? 1)
