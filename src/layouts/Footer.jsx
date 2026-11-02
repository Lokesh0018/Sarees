import { MapPin, Phone } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { addressLines, formatPhone, generalEnquiryMessage, mapsDirectionsHref, telHref, whatsappHref } from '../utils/contact'
import Logo from '../components/Logo'
import { SECTION_LINKS } from './Header'
import WhatsAppIcon from '../components/WhatsAppIcon'

const SOCIAL_LABELS = { instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube' }

export default function Footer() {
  const { settings, categories } = useStore()
  const social = Object.entries(settings.social || {}).filter(([, url]) => url)

  return (
    <footer className="grain relative overflow-hidden bg-emerald-deep text-ivory/75">
      <div className="h-1 bg-[repeating-linear-gradient(90deg,var(--color-gold)_0_18px,transparent_18px_24px)] opacity-60" aria-hidden="true" />
      <div className="container-x relative grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo settings={settings} />
          <p className="mt-6 font-serif text-2xl italic text-gold">{settings.tagline}</p>
          {settings.footer?.about && <p className="mt-4 max-w-sm text-sm leading-relaxed">{settings.footer.about}</p>}
        </div>

        <div className="lg:col-span-3">
          <h2 className="eyebrow text-gold">Collections</h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}><a href="#collections" className="link-underline hover:text-ivory">{c.name}</a></li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="eyebrow text-gold">Boutique</h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {SECTION_LINKS.map(({ href, label }) => (
              <li key={href}><a href={href} className="link-underline hover:text-ivory">{label}</a></li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="eyebrow text-gold">Visit Us</h2>
          <address className="mt-5 not-italic text-sm leading-relaxed">
            <a href={mapsDirectionsHref(settings)} target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-ivory">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{addressLines(settings.address).map((l) => <span key={l} className="block">{l}</span>)}</span>
            </a>
            <a href={telHref(settings)} className="mt-4 flex items-center gap-3 hover:text-ivory"><Phone className="h-4 w-4 text-gold" /> {formatPhone(settings.phone)}</a>
            <a href={whatsappHref(settings, generalEnquiryMessage(settings))} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-3 hover:text-ivory">
              <WhatsAppIcon className="h-4 w-4 text-gold" /> WhatsApp {formatPhone(settings.whatsapp)}
            </a>
          </address>
          {social.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-4 text-xs uppercase tracking-[0.2em]">
              {social.map(([key, url]) => (
                <li key={key}><a href={url} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light">{SOCIAL_LABELS[key] || key}</a></li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="relative border-t border-ivory/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          <p>MVP Colony · Visakhapatnam</p>
        </div>
      </div>
    </footer>
  )
}
