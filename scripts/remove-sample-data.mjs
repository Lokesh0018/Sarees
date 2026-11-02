// Removes every product marked "sample": true from public/data/products.json.
import { readFileSync, writeFileSync } from 'node:fs'

const file = new URL('../public/data/products.json', import.meta.url)
const products = JSON.parse(readFileSync(file, 'utf8'))
const kept = products.filter((p) => !p.sample)
writeFileSync(file, JSON.stringify(kept, null, 2) + '\n')
console.log(`Removed ${products.length - kept.length} sample products, ${kept.length} remain.`)
