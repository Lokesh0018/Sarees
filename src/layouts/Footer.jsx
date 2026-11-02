import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUp, Camera, Clock, Headset, MapPin, MapPinned, Phone } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { addressLines, formatPhone, generalEnquiryMessage, mapsDirectionsHref, telHref, whatsappHref } from '../utils/contact'
import { FOOTER } from '../content/home'
// Footer background animation: SareeLoom (loom weaving), SareeFlag (waving saree) and SareeRibbons (silk ribbons) are drop-in swaps
import SareeLoom from '../components/SareeLoom'

const SOCIAL_LABELS = { instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube' }
const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' }
// Column title: serif, with a short gold rule beneath
const HEADING = 'font-serif text-[1.15rem] font-medium leading-tight text-ivory after:mt-2 after:block after:h-px after:w-10 after:bg-gold/60'
const CONTACT_ICON = 'flex h-8 w-8 shrink-0 items-center justify-center border border-gold/35 text-gold-light'
const ICON_BTN = 'flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold-light transition-colors duration-300 hover:border-gold-light hover:bg-gold/10 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light'

// True once the element comes within `margin` of the viewport; stays true after that
function useNearViewport(margin = '300px') {
  const ref = useRef(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || near) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect() } }, { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [near, margin])
  return [ref, near]
}

// Fine gold thread: a hairline that fades out at both ends, with a small diamond knot at the centre
function GoldThread({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/45 to-gold/45" />
      <span className="h-1.5 w-1.5 rotate-45 border border-gold/70" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/45 to-gold/45" />
    </div>
  )
}

export default function Footer() {
  const { settings } = useStore()
  // The background animation mounts (and builds its canvases) only as the footer approaches; it then runs only while visible
  const [footerRef, nearFooter] = useNearViewport()
  const social = Object.entries(settings.social || {}).filter(([, url]) => url)
  const address = [...addressLines(settings.address), settings.address.postalCode && `${settings.address.postalCode}, ${settings.address.country}`].filter(Boolean).join(', ')
  const enquire = (topic) => whatsappHref(settings, generalEnquiryMessage(settings, { topic }))

  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-night-lowest text-mist">
      {/* Stitched divider from the contact section: two dashed gold lines with a diamond at the centre */}
      <div className="relative z-10 flex items-center gap-4 px-4 pt-px" aria-hidden="true">
        <span className="flex flex-1 flex-col gap-[3px]">
          <span className="border-t-2 border-dashed border-gold/60" />
          <span className="border-t border-dashed border-gold/30" />
        </span>
        <span className="h-2.5 w-2.5 shrink-0 rotate-45 border border-gold-light bg-night-lowest" />
        <span className="flex flex-1 flex-col gap-[3px]">
          <span className="border-t-2 border-dashed border-gold/60" />
          <span className="border-t border-dashed border-gold/30" />
        </span>
      </div>

      {/* Woven silk behind the footer: kept low contrast and veiled so the text always leads */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {nearFooter && <SareeLoom className="h-full w-full opacity-70 motion-safe:animate-[fadeIn_1.6s_ease-out]" />}
        <div className="absolute inset-0 bg-gradient-to-b from-night-lowest/85 via-night-lowest/72 to-night-lowest/55" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_40%,rgb(5_17_13/0.35),transparent)]" />
      </div>

      <div className="relative">
        {/* Ribbon */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 pb-0 pt-3 text-center">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.26em] text-gold-light">{FOOTER.ribbon[0]}</span>
          <span className="text-[0.5rem] text-gold" aria-hidden="true">◆</span>
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.26em] text-sage">{FOOTER.ribbon[1]}</span>
        </div>

        {/* Private Salon Service: an emerald card framed in antique gold */}
        <div className="container-x pt-4">
          <div className="relative overflow-hidden border border-gold/35 bg-gradient-to-r from-emerald-deep/95 via-night-low/95 to-emerald-deep/90 px-6 py-5 sm:px-8 lg:px-10">
            <span className="pointer-events-none absolute inset-1.5 border border-gold/15" aria-hidden="true" />
            <span className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 bg-[radial-gradient(closest-side,rgb(201_164_92/0.14),transparent)]" aria-hidden="true" />
            <div className="relative flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5 sm:gap-7">
                <a href="#top" className="shrink-0" aria-label={`${settings.storeName} — back to top`}>
                  <img src={settings.logo || '/brand/sjr-logo-sm.webp'} alt="" width={360} height={230} loading="lazy" className="h-10 w-auto sm:h-12" />
                </a>
                <span className="hidden h-12 w-px bg-gradient-to-b from-transparent via-gold/50 to-transparent sm:block" aria-hidden="true" />
                <div>
                  <span className="text-[0.625rem] font-semibold uppercase tracking-[0.28em] text-gold">By Appointment</span>
                  <h2 className="mt-0.5 font-serif text-[1.45rem] leading-tight text-ivory sm:text-[1.75rem]">{FOOTER.salon.title}</h2>
                  <p className="mt-1 hidden max-w-md text-[0.8125rem] leading-snug text-mist lg:block">{FOOTER.salon.body}</p>
                </div>
              </div>
              <a href={enquire('Private salon session')} {...EXTERNAL} className="group inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2.5 border border-gold-light bg-gold-light px-7 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:bg-transparent hover:text-gold-light sm:w-auto">
                <Headset className="h-5 w-5" aria-hidden="true" /> {FOOTER.salon.cta}
              </a>
            </div>
          </div>
        </div>

        {/* Four columns */}
        <div className="container-x grid gap-x-10 gap-y-7 py-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-12">
          {/* Visit the Boutique */}
          <div className="lg:col-span-4">
            <h2 className={HEADING}>Visit the Boutique</h2>
            {settings.footer?.about && <p className="mt-3 max-w-sm text-[0.8125rem] leading-relaxed">{settings.footer.about}</p>}
            <address className="mt-3 flex flex-col gap-2.5 not-italic">
              <a href={mapsDirectionsHref(settings)} {...EXTERNAL} className="group flex items-start gap-3.5">
                <span className={CONTACT_ICON}><MapPin className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" /></span>
                <span>
                  <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-gold/80">Address</span>
                  <span className="mt-0.5 block text-[0.875rem] leading-relaxed text-ivory/90 transition-colors group-hover:text-gold-light">{address}</span>
                </span>
              </a>
              <div className="flex items-start gap-3.5">
                <span className={CONTACT_ICON}><Clock className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" /></span>
                <span>
                  <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-gold/80">Hours</span>
                  <span className="mt-0.5 block text-[0.875rem] text-ivory/90">{settings.hours?.length ? settings.hours.map((h) => `${h.days}: ${h.time}`).join(' · ') : settings.hoursNote}</span>
                </span>
              </div>
              <a href={telHref(settings)} className="group flex items-start gap-3.5">
                <span className={CONTACT_ICON}><Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" /></span>
                <span>
                  <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-gold/80">Call or WhatsApp</span>
                  <span className="mt-0.5 block font-serif text-[1.2rem] text-gold-light transition-colors group-hover:text-ivory">+{settings.countryCode} {formatPhone(settings.phone)}</span>
                </span>
              </a>
            </address>
          </div>

          {/* Collections: minimal gold diamond bullets */}
          <nav className="lg:col-span-3" aria-label="Boutique collections">
            <h2 className={HEADING}>Collections</h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              {FOOTER.collectionLinks.map((label) => (
                <li key={label}>
                  <a href="#collections" className="group inline-flex items-center gap-3 text-[0.8125rem] text-mist transition-colors duration-300 hover:text-gold-light">
                    <span className="h-1.5 w-1.5 shrink-0 rotate-45 border border-gold/60 transition-colors duration-300 group-hover:bg-gold-light" aria-hidden="true" />
                    <span className="transition-transform duration-300 motion-safe:group-hover:translate-x-0.5">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Client Concierge: links separated by hairlines */}
          <nav className="lg:col-span-3" aria-label={FOOTER.concierge.title}>
            <h2 className={HEADING}>{FOOTER.concierge.title}</h2>
            <ul className="mt-2 divide-y divide-gold/12 border-y border-gold/12">
              {FOOTER.concierge.links.map((l) => (
                <li key={l.label}>
                  <a href={l.directions ? mapsDirectionsHref(settings) : enquire(l.topic)} {...EXTERNAL} className="group flex min-h-10 items-center justify-between gap-3 text-[0.875rem] text-mist transition-colors duration-300 hover:text-gold-light">
                    {l.label}
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-gold/50 transition-[color,transform] duration-300 group-hover:text-gold-light motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect: thin gold rings */}
          <div className="lg:col-span-2">
            <h2 className={HEADING}>Connect</h2>
            <div className="mt-3 flex flex-wrap gap-2.5">
              <a href={mapsDirectionsHref(settings)} {...EXTERNAL} aria-label="Boutique location on Google Maps" className={ICON_BTN}>
                <MapPinned className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
              </a>
              <a href={settings.social?.instagram || '#gallery'} {...(settings.social?.instagram ? EXTERNAL : {})} aria-label={settings.social?.instagram ? 'Instagram' : 'Boutique gallery'} className={ICON_BTN}>
                <Camera className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
              </a>
              <a href={telHref(settings)} aria-label="Call the boutique" className={ICON_BTN}>
                <Phone className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
              </a>
            </div>
            {social.some(([key]) => key !== 'instagram') && (
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                {social.filter(([key]) => key !== 'instagram').map(([key, url]) => (
                  <a key={key} href={url} {...EXTERNAL} className="text-[0.6875rem] font-semibold uppercase tracking-wider text-gold-light hover:text-sage">{SOCIAL_LABELS[key] || key}</a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Base bar, set off by a fine gold thread */}
        <div className="container-x">
          <GoldThread />
          <div className="flex flex-col items-center justify-between gap-1 py-2 text-center sm:flex-row sm:text-left">
            <p className="text-[0.8125rem] text-mist/90">© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
            <p className="font-serif text-[1.05rem] italic text-gold">{settings.tagline}</p>
            <a href="#top" className="inline-flex min-h-11 items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gold-light transition-colors hover:text-ivory">
              Back to top <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
