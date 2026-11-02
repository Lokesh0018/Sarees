// Builds public/sitemap.xml and public/robots.txt from the catalogue data.
// SITE_URL comes from VITE_SITE_URL (env or .env file).
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const root = new URL('../', import.meta.url)
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'))

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
const categories = read('public/data/categories.json').filter((c) => c.isActive)
const products = read('public/data/products.json').filter((p) => p.isPublished && !p.archived)
const today = new Date().toISOString().slice(0, 10)

const urls = [
  ['/', '1.0'],
  ['/collections', '0.9'],
  ['/our-craft', '0.7'],
  ['/about', '0.6'],
  ['/gallery', '0.6'],
  ['/contact', '0.8'],
  ['/privacy-policy', '0.2'],
  ...categories.map((c) => [`/collections/${c.slug}`, '0.8']),
  ...products.map((p) => [`/products/${p.slug}`, '0.7']),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([loc, priority]) => `  <url><loc>${base}${loc}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`).join('\n')}
</urlset>
`
writeFileSync(new URL('public/sitemap.xml', root), xml)
writeFileSync(new URL('public/robots.txt', root), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`)
console.log(`sitemap.xml: ${urls.length} URLs for ${base}`)
