import { DATA_BASE_URL } from '../config/site'

const cache = new Map()

// Fetches a named data resource. Today these are static JSON files in
// public/data; point DATA_BASE_URL at a REST API returning the same shapes.
export function getResource(name) {
  if (!cache.has(name)) {
    const request = fetch(`${DATA_BASE_URL}/${name}.json`, { headers: { Accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error(`Could not load ${name} (${res.status})`)
        return res.json()
      })
      .catch((err) => {
        cache.delete(name)
        throw err
      })
    cache.set(name, request)
  }
  return cache.get(name)
}
