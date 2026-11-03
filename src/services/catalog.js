import { getResource } from './api'

const byOrder = (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)

export const getSettings = () => getResource('settings')

export async function getCategories() {
  const all = await getResource('categories')
  return all.filter((c) => c.isActive).sort(byOrder)
}
