import { getResource } from './api'

const byOrder = (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
const newest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt)

export const getSettings = () => getResource('settings')

export async function getCategories() {
  const all = await getResource('categories')
  return all
    .filter((c) => c.isActive)
    .sort(byOrder)
    .map((c) => ({ ...c, subcategories: (c.subcategories || []).filter((s) => s.isActive !== false) }))
}

async function visibleProducts() {
  const [products, categories] = await Promise.all([getResource('products'), getCategories()])
  const active = new Set(categories.map((c) => c.slug))
  return products.filter((p) => p.isPublished && !p.archived && active.has(p.categorySlug))
}

export const getFeatured = async (limit = 8) => (await visibleProducts()).filter((p) => p.isFeatured).sort(byOrder).slice(0, limit)
export const getNewArrivals = async (limit = 8) => (await visibleProducts()).filter((p) => p.isNewArrival).sort(newest).slice(0, limit)
