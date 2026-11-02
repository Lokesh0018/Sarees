import { SITE_URL } from '../config/site'

const digits = (value = '') => String(value).replace(/\D/g, '')

// Normalises a local Indian number to international form for wa.me / tel: links.
export function intlNumber(number, countryCode = '91') {
  const d = digits(number)
  return d.length === 10 ? `${countryCode}${d}` : d
}

export const telHref = (settings) => `tel:+${intlNumber(settings.phone, settings.countryCode)}`

export function whatsappHref(settings, message) {
  const base = `https://wa.me/${intlNumber(settings.whatsapp, settings.countryCode)}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const productUrl = (product) => `${SITE_URL}/products/${product.slug}`

export function productEnquiryMessage(settings, product, categoryName) {
  return [
    `Hello ${settings.storeName}!`,
    '',
    'I am interested in the following product:',
    '',
    `Product: ${product.name}`,
    `Category: ${categoryName || product.categorySlug}`,
    `Product Code: ${product.productCode}`,
    `Product URL: ${productUrl(product)}`,
    '',
    'Please share more details and availability.',
  ].join('\n')
}

export function generalEnquiryMessage(settings, { name, phone, topic, message } = {}) {
  const lines = [`Hello ${settings.storeName}!`, '']
  if (message?.trim()) lines.push(message.trim())
  else lines.push(`I would like to know more about your ${topic ? topic.toLowerCase() : 'collections'}.`)
  const details = []
  if (topic) details.push(`Regarding: ${topic}`)
  if (name?.trim()) details.push(`Name: ${name.trim()}`)
  if (phone?.trim()) details.push(`Contact: ${phone.trim()}`)
  if (details.length) lines.push('', ...details)
  return lines.join('\n')
}

export function formatPhone(number) {
  const d = digits(number)
  return d.length === 10 ? `${d.slice(0, 5)} ${d.slice(5)}` : number
}

export function addressLines(address) {
  return [address.line1, address.line2, [address.city, address.region].filter(Boolean).join(', ')].filter(Boolean)
}

export function mapsDirectionsHref(settings) {
  if (settings.maps?.placeUrl) return settings.maps.placeUrl
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.maps?.query || addressLines(settings.address).join(', '))}`
}

export function mapsEmbedSrc(settings) {
  if (settings.maps?.embedUrl) return settings.maps.embedUrl
  return `https://maps.google.com/maps?q=${encodeURIComponent(settings.maps?.query || addressLines(settings.address).join(', '))}&z=16&output=embed`
}

export const formatPrice = (price) =>
  price == null || price === '' ? null : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)
