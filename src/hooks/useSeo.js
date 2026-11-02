import { useEffect } from 'react'
import { SITE_URL } from '../config/site'

const BRAND = 'SJR – House of Collection'

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

// Sets per-page title, description, canonical, Open Graph and optional JSON-LD.
export function useSeo({ title, description, path = '/', image = '/brand/og-image.jpg', jsonLd, noindex = false }) {
  const ld = jsonLd ? JSON.stringify(jsonLd) : ''
  useEffect(() => {
    const fullTitle = title ? `${title} | ${BRAND}` : `${BRAND} | Sarees & Boutique in MVP Colony, Vizag`
    const url = `${SITE_URL}${path}`
    document.title = fullTitle
    if (description) {
      setMeta('name', 'description', description)
      setMeta('property', 'og:description', description)
      setMeta('name', 'twitter:description', description)
    }
    setMeta('property', 'og:title', fullTitle)
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('property', 'og:url', url)
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow')
    if (image) {
      setMeta('property', 'og:image', image.startsWith('http') ? image : `${SITE_URL}${image}`)
    }

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url

    let script
    if (ld) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.page = 'true'
      script.textContent = ld
      document.head.appendChild(script)
    }
    return () => script?.remove()
  }, [title, description, path, image, ld, noindex])
}
