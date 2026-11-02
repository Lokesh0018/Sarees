import { getResource } from './api'

const byOrder = (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
const newest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt)

export const getSettings = () => getResource('settings')
export const getGallery = async () => (await getResource('gallery')).filter((g) => g.isActive !== false).sort(byOrder)

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

export const SORTS = {
  featured: { label: 'Featured', fn: (a, b) => Number(b.isFeatured) - Number(a.isFeatured) || byOrder(a, b) },
  latest: { label: 'Latest', fn: newest },
}

export async function getProducts({ category, subcategory, q, availability, sort = 'featured', page = 1, pageSize = 12 } = {}) {
  let items = await visibleProducts()
  if (category) items = items.filter((p) => p.categorySlug === category)
  if (subcategory) items = items.filter((p) => p.subcategorySlug === subcategory)
  if (availability) items = items.filter((p) => p.availability === availability)
  if (q) {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
    items = items.filter((p) => {
      const hay = `${p.name} ${p.productCode} ${p.description} ${p.categorySlug} ${p.subcategorySlug ?? ''}`.toLowerCase()
      return terms.every((t) => hay.includes(t))
    })
  }
  items = [...items].sort((SORTS[sort] || SORTS.featured).fn)
  return { items: items.slice(0, page * pageSize), total: items.length }
}

export async function getProduct(slug) {
  const items = await visibleProducts()
  const product = items.find((p) => p.slug === slug)
  if (!product) return null
  const related = items
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .sort(SORTS.featured.fn)
    .slice(0, 4)
  return { product, related }
}

export const getFeatured = async (limit = 8) => (await visibleProducts()).filter((p) => p.isFeatured).sort(byOrder).slice(0, limit)
export const getNewArrivals = async (limit = 8) => (await visibleProducts()).filter((p) => p.isNewArrival).sort(newest).slice(0, limit)
