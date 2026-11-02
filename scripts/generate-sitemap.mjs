// Builds public/sitemap.xml and public/robots.txt.
// SITE_URL comes from VITE_SITE_URL (env or .env file).
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const root = new URL('../', import.meta.url)

function siteUrl() {
  if (process.env.VITE_SITE_URL) return process.env.VITE_SITE_URL
  for (const file of ['.env.production', '.env']) {
    const path = new URL(file, root)
    if (!existsSync(path)) continue
    const match = readFileSync(path, 'utf8').match(/^VITE_SITE_URL=(.+)$/m)
    if (match) return match[1].trim()
  }
  return 'https://www.example.com'
}

const base = siteUrl().replace(/\/$/, '')
const today = new Date().toISOString().slice(0, 10)

// Single-page site: the home page is the only URL.
const urls = [['/', '1.0']]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([loc, priority]) => `  <url><loc>${base}${loc}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`).join('\n')}
</urlset>
`
writeFileSync(new URL('public/sitemap.xml', root), xml)
writeFileSync(new URL('public/robots.txt', root), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`)
console.log(`sitemap.xml: ${urls.length} URLs for ${base}`)
