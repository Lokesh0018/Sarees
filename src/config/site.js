// Fallback business details, used only if settings.json cannot be loaded.
export const FALLBACK_SETTINGS = {
  storeName: 'SJR – House of Collection',
  shortName: 'SJR',
  tagline: 'Your Style • Our Craft',
  phone: '9052122474',
  whatsapp: '9052122474',
  countryCode: '91',
  address: { line1: 'Plot No. 69, Sector-2', line2: 'MVP Colony', city: 'Visakhapatnam', region: 'Andhra Pradesh', country: 'India' },
  maps: { query: 'Plot No. 69, Sector-2, MVP Colony, Visakhapatnam, Andhra Pradesh', placeUrl: '', embedUrl: '' },
  hours: [],
  hoursNote: "Please call or WhatsApp us to confirm today's timings.",
  logo: '/brand/sjr-logo-sm.webp',
  social: {},
  hero: {
    eyebrow: 'SJR – House of Collection',
    heading: 'Elegance Woven Into Every Moment.',
    description: 'Discover timeless sarees, exquisite fashion, and thoughtful craftsmanship curated to celebrate your style.',
    primaryCta: { label: 'Explore Collections', to: '#collections' },
    secondaryCta: { label: 'Contact Our Boutique', to: '#visit' },
    videoWebmMobile: '/media/hero-720.webm',
    videoWebm: '/media/hero.webm',
    videoMp4: '/media/hero.mp4',
    poster: '/media/hero-poster.webp',
  },
  banners: [],
  footer: {},
}

export const SITE_URL = (import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/$/, '')
export const DATA_BASE_URL = (import.meta.env.VITE_DATA_BASE_URL || '/data').replace(/\/$/, '')
