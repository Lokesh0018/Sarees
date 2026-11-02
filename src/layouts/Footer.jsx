import { Camera, Clock, Headset, MapPin, MapPinned, Phone } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { addressLines, formatPhone, generalEnquiryMessage, mapsDirectionsHref, telHref, whatsappHref } from '../utils/contact'
import { FOOTER } from '../content/home'

const SOCIAL_LABELS = { instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube' }
const HEADING = 'border-b border-gold/20 pb-2 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.18em] text-gold-light'
const LINK = 'text-[0.8125rem] text-mist transition-colors hover:text-gold-light'
const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' }

export default function Footer() {
  const { settings } = useStore()
  const social = Object.entries(settings.social || {}).filter(([, url]) => url)
  const address = [...addressLines(settings.address), settings.address.postalCode && `${settings.address.postalCode}, ${settings.address.country}`].filter(Boolean).join(', ')
  const enquire = (topic) => whatsappHref(settings, generalEnquiryMessage(settings, { topic }))

  return (
    <footer className="border-t border-gold/25 bg-night-lowest text-mist">
      <div className="flex items-center justify-center gap-3 border-b border-gold/15 px-4 py-3 text-center">
        <span className="hidden h-px w-24 bg-gold/30 sm:block" aria-hidden="true" />
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-gold-light">{FOOTER.ribbon[0]}</span>
        <span className="text-xs text-gold" aria-hidden="true">◆</span>
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-sage">{FOOTER.ribbon[1]}</span>
        <span className="hidden h-px w-24 bg-gold/30 sm:block" aria-hidden="true" />
      </div>

      <div className="container-x grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-4 lg:col-span-4">
          <a href="#top" className="flex items-center gap-3" aria-label={`${settings.storeName} — back to top`}>
            <img src={settings.logo || '/brand/sjr-logo-sm.webp'} alt="" width={360} height={230} loading="lazy" className="h-10 w-auto" />
            <span className="font-serif text-xl font-semibold uppercase text-gold-light">{settings.storeName}</span>
          </a>
          {settings.footer?.about && <p className="max-w-sm text-[0.8125rem] leading-relaxed">{settings.footer.about}</p>}
          <address className="flex flex-col gap-1.5 text-[0.8125rem] not-italic">
            <a href={mapsDirectionsHref(settings)} {...EXTERNAL} className="flex items-start gap-2 hover:text-gold-light">
              <MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gold-light" aria-hidden="true" /> <span>{address}</span>
            </a>
            <p className="flex items-center gap-2">
              <Clock className="h-[18px] w-[18px] shrink-0 text-gold-light" aria-hidden="true" />
              <span>{settings.hours?.length ? settings.hours.map((h) => `${h.days}: ${h.time}`).join(' · ') : settings.hoursNote}</span>
            </p>
            <a href={telHref(settings)} className="flex items-center gap-2 hover:text-gold-light">
              <Phone className="h-[18px] w-[18px] shrink-0 text-gold-light" aria-hidden="true" /> +{settings.countryCode} {formatPhone(settings.phone)}
            </a>
          </address>
        </div>

        <nav className="flex flex-col gap-3 lg:col-span-3" aria-label="Boutique collections">
          <h2 className={HEADING}>Boutique Collections</h2>
          <ul className="flex flex-col gap-2">
            {FOOTER.collectionLinks.map((label) => <li key={label}><a href="#collections" className={LINK}>{label}</a></li>)}
          </ul>
        </nav>

        <nav className="flex flex-col gap-3 lg:col-span-2" aria-label={FOOTER.concierge.title}>
          <h2 className={HEADING}>{FOOTER.concierge.title}</h2>
          <ul className="flex flex-col gap-2">
            {FOOTER.concierge.links.map((l) => (
              <li key={l.label}>
                <a href={l.directions ? mapsDirectionsHref(settings) : enquire(l.topic)} {...EXTERNAL} className={LINK}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4 lg:col-span-3">
          <h2 className={HEADING}>{FOOTER.salon.title}</h2>
          <p className="text-[0.8125rem]">{FOOTER.salon.body}</p>
          <a href={enquire('Private salon session')} {...EXTERNAL} className="flex min-h-11 items-center justify-center gap-2 border border-gold/40 bg-sage-deep p-3 text-[0.8125rem] font-semibold uppercase tracking-[0.18em] text-sage transition-colors hover:bg-gold hover:text-ink">
            <Headset className="h-5 w-5" aria-hidden="true" /> {FOOTER.salon.cta}
          </a>
          <div className="flex flex-wrap items-center gap-1 pt-1">
            <span className="mr-2 text-[0.6875rem] font-semibold uppercase tracking-wider">Connect:</span>
            <a href={mapsDirectionsHref(settings)} {...EXTERNAL} aria-label="Boutique location on Google Maps" className="flex h-11 w-11 items-center justify-center text-gold-light transition-colors hover:text-sage">
              <MapPinned className="h-5 w-5" aria-hidden="true" />
            </a>
            <a href={settings.social?.instagram || '#gallery'} {...(settings.social?.instagram ? EXTERNAL : {})} aria-label={settings.social?.instagram ? 'Instagram' : 'Boutique gallery'} className="flex h-11 w-11 items-center justify-center text-gold-light transition-colors hover:text-sage">
              <Camera className="h-5 w-5" aria-hidden="true" />
            </a>
            {social.filter(([key]) => key !== 'instagram').map(([key, url]) => (
              <a key={key} href={url} {...EXTERNAL} className="px-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-gold-light hover:text-sage">{SOCIAL_LABELS[key] || key}</a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gold/20">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-4 text-center sm:flex-row sm:text-left">
          <p className="text-[0.8125rem]">© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-gold">{settings.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
