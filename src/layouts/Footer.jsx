import { ArrowUp, Camera, Clock, Headset, MapPin, MapPinned, Phone } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { addressLines, formatPhone, generalEnquiryMessage, mapsDirectionsHref, telHref, whatsappHref } from '../utils/contact'
import { FOOTER } from '../content/home'
// Footer background animation: SareeLoom (loom weaving), SareeFlag (waving saree) and SareeRibbons (silk ribbons) are drop-in swaps
import SareeLoom from '../components/SareeLoom'

const SOCIAL_LABELS = { instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube' }
const HEADING = 'mb-2.5 flex items-center gap-3 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.22em] text-gold-light after:h-px after:flex-1 after:bg-gold/20'
const LINK = 'group inline-flex items-center gap-2 text-[0.8125rem] text-mist transition-colors hover:text-gold-light'
const DOT = 'h-1 w-1 rotate-45 bg-gold/40 transition-colors group-hover:bg-gold-light'
const ICON_BTN = 'flex h-11 w-11 items-center justify-center border border-gold/30 text-gold-light transition-colors hover:border-gold-light hover:bg-gold-light hover:text-ink'
const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' }

export default function Footer() {
  const { settings } = useStore()
  const social = Object.entries(settings.social || {}).filter(([, url]) => url)
  const address = [...addressLines(settings.address), settings.address.postalCode && `${settings.address.postalCode}, ${settings.address.country}`].filter(Boolean).join(', ')
  const enquire = (topic) => whatsappHref(settings, generalEnquiryMessage(settings, { topic }))

  return (
    <footer className="relative overflow-hidden bg-night-lowest text-mist [text-shadow:0_1px_10px_rgb(5_17_13/0.95),0_0_2px_rgb(5_17_13/0.8)]">
      {/* Stitched divider from the contact section: two dashed gold lines with a diamond at the centre */}
      <div className="relative z-10 flex items-center gap-4 px-4 pt-px" aria-hidden="true">
        <span className="flex flex-1 flex-col gap-[3px]">
          <span className="border-t-2 border-dashed border-gold/70" />
          <span className="border-t border-dashed border-gold/40" />
        </span>
        <span className="h-2.5 w-2.5 shrink-0 rotate-45 border border-gold-light bg-night-lowest" />
        <span className="flex flex-1 flex-col gap-[3px]">
          <span className="border-t-2 border-dashed border-gold/70" />
          <span className="border-t border-dashed border-gold/40" />
        </span>
      </div>
      {/* Saree waving in the wind behind the whole footer. The veil is lighter through the middle so the zari shows,
          darker at the top and bottom edges; text carries a soft dark shadow to stay readable over the fabric. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <SareeLoom className="h-full w-full opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-night-lowest/65 via-night-lowest/35 to-night-lowest/75" />
        <div className="absolute inset-0 bg-[radial-gradient(85%_95%_at_50%_50%,transparent,rgb(5_17_13/0.55))]" />
      </div>

      <div className="relative">
        {/* Ribbon */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-gold/15 px-4 py-2 text-center">
          <span className="hidden h-px w-24 bg-gold/30 sm:block" aria-hidden="true" />
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-gold-light">{FOOTER.ribbon[0]}</span>
          <span className="text-xs text-gold" aria-hidden="true">◆</span>
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-sage">{FOOTER.ribbon[1]}</span>
          <span className="hidden h-px w-24 bg-gold/30 sm:block" aria-hidden="true" />
        </div>

        {/* Salon banner over the waving saree */}
        <div className="container-x flex flex-col items-start justify-between gap-5 py-7 lg:flex-row lg:items-center lg:gap-8">
          <div className="flex items-center gap-5">
            <a href="#top" className="shrink-0" aria-label={`${settings.storeName} — back to top`}>
              <img src={settings.logo || '/brand/sjr-logo-sm.webp'} alt="" width={360} height={230} loading="lazy" className="h-12 w-auto" />
            </a>
            <span className="hidden h-12 w-px bg-gold/30 sm:block" aria-hidden="true" />
            <div>
              <h2 className="font-serif text-[1.6rem] leading-tight text-ivory sm:text-[1.9rem]">{FOOTER.salon.title}</h2>
              <p className="mt-1 hidden max-w-md text-[0.875rem] leading-snug text-mist sm:block">{FOOTER.salon.body}</p>
            </div>
          </div>
          <a href={enquire('Private salon session')} {...EXTERNAL} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2.5 bg-gold-light px-6 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-ink shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8)] transition-colors hover:bg-ivory">
            <Headset className="h-5 w-5" aria-hidden="true" /> {FOOTER.salon.cta}
          </a>
        </div>

        {/* Link columns */}
        <div className="container-x grid gap-7 border-t border-gold/15 py-7 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h2 className={HEADING}>Visit the Boutique</h2>
            {settings.footer?.about && <p className="mb-3 max-w-sm text-[0.8125rem] leading-relaxed">{settings.footer.about}</p>}
            <address className="flex flex-col gap-2 text-[0.8125rem] not-italic">
              <a href={mapsDirectionsHref(settings)} {...EXTERNAL} className="flex items-start gap-3 hover:text-gold-light">
                <MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gold-light" aria-hidden="true" /> <span>{address}</span>
              </a>
              <p className="flex items-start gap-3">
                <Clock className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gold-light" aria-hidden="true" />
                <span>{settings.hours?.length ? settings.hours.map((h) => `${h.days}: ${h.time}`).join(' · ') : settings.hoursNote}</span>
              </p>
              <a href={telHref(settings)} className="flex items-center gap-3 font-serif text-[1.15rem] text-gold-light hover:underline">
                <Phone className="h-[18px] w-[18px] shrink-0" aria-hidden="true" /> +{settings.countryCode} {formatPhone(settings.phone)}
              </a>
            </address>
          </div>

          <nav className="lg:col-span-3" aria-label="Boutique collections">
            <h2 className={HEADING}>Collections</h2>
            <ul className="flex flex-col gap-1.5">
              {FOOTER.collectionLinks.map((label) => (
                <li key={label}><a href="#collections" className={LINK}><span className={DOT} aria-hidden="true" />{label}</a></li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-3" aria-label={FOOTER.concierge.title}>
            <h2 className={HEADING}>{FOOTER.concierge.title}</h2>
            <ul className="flex flex-col gap-1.5">
              {FOOTER.concierge.links.map((l) => (
                <li key={l.label}>
                  <a href={l.directions ? mapsDirectionsHref(settings) : enquire(l.topic)} {...EXTERNAL} className={LINK}><span className={DOT} aria-hidden="true" />{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className={HEADING}>Connect</h2>
            <div className="flex flex-wrap gap-2">
              <a href={mapsDirectionsHref(settings)} {...EXTERNAL} aria-label="Boutique location on Google Maps" className={ICON_BTN}>
                <MapPinned className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href={settings.social?.instagram || '#gallery'} {...(settings.social?.instagram ? EXTERNAL : {})} aria-label={settings.social?.instagram ? 'Instagram' : 'Boutique gallery'} className={ICON_BTN}>
                <Camera className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href={telHref(settings)} aria-label="Call the boutique" className={ICON_BTN}>
                <Phone className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
            {social.some(([key]) => key !== 'instagram') && (
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {social.filter(([key]) => key !== 'instagram').map(([key, url]) => (
                  <a key={key} href={url} {...EXTERNAL} className="text-[0.6875rem] font-semibold uppercase tracking-wider text-gold-light hover:text-sage">{SOCIAL_LABELS[key] || key}</a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Base bar */}
        <div className="border-t border-gold/20">
          <div className="container-x flex flex-col items-center justify-between gap-2 py-3 text-center sm:flex-row sm:text-left">
            <p className="text-[0.8125rem]">© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
            <p className="font-serif text-[1rem] italic text-gold">{settings.tagline}</p>
            <a href="#top" className="inline-flex min-h-11 items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gold-light transition-colors hover:text-ivory">
              Back to top <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
