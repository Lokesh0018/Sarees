import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, BadgeCheck, BookOpen, Brush, CalendarCheck, CalendarDays, Check, CircleCheck, CircleDot, Clock, Flower, Flower2, Grid2x2, Layers, LockOpen, MapPin, Palette, PencilRuler, Phone, Ribbon, Ruler, Scissors, Shield, Shirt, Sparkles, UserCheck, Waves } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { useAsync } from '../hooks/useAsync'
import { gsap, useReveal } from '../utils/motion'
import { getNewArrivals } from '../services/catalog'
import { addressLines, formatPhone, generalEnquiryMessage, mapsDirectionsHref, productEnquiryMessage, telHref, whatsappHref } from '../utils/contact'
import WhatsAppIcon from '../components/WhatsAppIcon'
import ShadeFinder from '../components/ShadeFinder'
import { LOGO } from '../components/Logo'
import { imageUrl } from '../utils/assets'
import { ARRIVALS, COLLECTIONS, CRAFT, DRESS_SETS, FEATURED, GALLERY, INNERS, INTRO, JEWELLERY, MARQUEE, MATCHINGS, NIGHTIES, PETTICOATS, SAREES, STITCHING, STORY, VISIT } from '../content/home'

// Shared type scale for the editorial sections
const LABEL = 'text-[0.6875rem] font-semibold uppercase tracking-[0.22em]'
const ACTION = 'text-[0.8125rem] font-semibold uppercase tracking-[0.18em]'
const H_XL = 'font-serif text-[2.4rem] font-normal leading-[1.08] sm:text-[3.5rem]'
const BTN_GOLD = `inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2 bg-gold-light px-8 text-ink transition-colors duration-300 hover:bg-ivory ${ACTION}`
const BTN_LINE = `inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2 border border-gold/40 px-6 text-ivory transition-colors duration-300 hover:border-gold-light hover:text-gold-light ${ACTION}`
const BTN_SAGE = `inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-3 border border-gold/40 bg-sage-deep px-6 text-sage transition-colors duration-300 hover:bg-gold hover:text-ink ${ACTION}`
const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' }

function Photo({ src, alt, position = '50% 50%', className = '', eager = false }) {
  return (
    <img
      src={src}
      alt={alt}
      width={1408}
      height={768}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={`h-full w-full object-cover ${className}`}
      style={{ objectPosition: position }}
    />
  )
}

function RuleLabel({ children, className = '', both = false, ...rest }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} {...rest}>
      <span className="h-px w-8 bg-current opacity-70" aria-hidden="true" />
      <span className={LABEL}>{children}</span>
      {both && <span className="h-px w-8 bg-current opacity-70" aria-hidden="true" />}
    </div>
  )
}

function useSectionReveal() {
  const ref = useRef(null)
  useReveal(ref)
  return ref
}

// 0 · Scrolling band between the hero film and the parchment introduction

// Four-point star, like a kolam dot or a zari buti, used as the separator
function ZariStar({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d="M12 1.5c.9 5 3.6 7.7 10.5 10.5C15.6 14.8 12.9 17.5 12 22.5c-.9-5-3.6-7.7-10.5-10.5C8.4 9.2 11.1 6.5 12 1.5Z" fill="currentColor" />
      <circle cx="12" cy="12" r="1.7" fill="var(--color-night-lowest)" />
    </svg>
  )
}

// One copy of a row; the track renders it twice and slides by exactly one copy's width, so each item carries
// its own trailing separator and spacing to keep both copies identical and the loop seamless.
function MarqueeRun({ items, variant, hidden = false }) {
  const major = variant === 'major'
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {/* Brand crest once per loop, where the list wraps back to the start */}
      {major && (
        <li className="flex shrink-0 items-center" aria-hidden="true">
          <img src={LOGO.src} alt="" width={LOGO.width} height={LOGO.height} loading="lazy" className="h-9 w-auto opacity-90 sm:h-12" />
          <ZariStar className="mx-7 h-4 w-4 text-gold sm:mx-12 sm:h-5 sm:w-5" />
        </li>
      )}
      {items.map((item, i) => (
        <li key={item} className="flex shrink-0 items-center">
          {major ? (
            <span
              className={`marquee-spot whitespace-nowrap font-serif text-[1.7rem] leading-[1.15] sm:text-[2.6rem] ${
                i % 2
                  ? 'bg-[linear-gradient(100deg,#B08A45_0%,#F1DCAA_38%,#C9A45C_62%,#E9D3A0_100%)] bg-clip-text pr-[0.12em] italic text-transparent'
                  : 'text-ivory'
              }`}
            >
              {item}
            </span>
          ) : (
            <span className="whitespace-nowrap text-[0.6875rem] font-semibold uppercase tracking-[0.32em] text-mist/80">{item}</span>
          )}
          {major ? <ZariStar className="mx-7 h-4 w-4 text-gold sm:mx-12 sm:h-5 sm:w-5" /> : <span className="mx-5 h-1 w-1 shrink-0 rotate-45 bg-gold/70 sm:mx-7" aria-hidden="true" />}
        </li>
      ))}
    </ul>
  )
}

const MarqueeRow = ({ items, variant, trackRef }) => (
  <div ref={trackRef} className="flex w-max will-change-transform">
    <MarqueeRun items={items} variant={variant} />
    <MarqueeRun items={items} variant={variant} hidden />
  </div>
)

// Scroll-reactive drift: a calm base speed that surges with scroll speed and eases back, reverses when the visitor
// scrolls up, leans the large type slightly with velocity, and glides to a stop on hover.
function useMarqueeMotion(bandRef, majorRef, minorRef) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const band = bandRef.current
    const rows = [
      { el: majorRef.current, speed: 64, dir: -1, lean: true },
      { el: minorRef.current, speed: 26, dir: 1, lean: false },
    ].map((r) => ({ ...r, x: 0, span: 0 }))

    // One copy's width: the distance after which the track looks identical again
    const measure = () => rows.forEach((r) => { r.span = r.el.firstElementChild.getBoundingClientRect().width })
    measure()
    const resize = new ResizeObserver(measure)
    rows.forEach((r) => resize.observe(r.el.firstElementChild))

    let visible = true
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    io.observe(band)

    let hover = false
    const enter = () => { hover = true }
    const leave = () => { hover = false }
    band.addEventListener('pointerenter', enter)
    band.addEventListener('pointerleave', leave)

    let lastY = window.scrollY
    let heading = 1 // 1 while scrolling down, -1 after scrolling up
    let flow = 1 // eased 0..1, 0 when hovered
    let speed = 0 // smoothed scroll speed in px/s; wheel scrolling arrives in bursts with still frames between
    let surge = 0 // eased extra speed from scrolling
    let lean = 0 // eased skew in degrees
    const ease = (from, to, rate, dt) => from + (to - from) * Math.min(1, dt * rate)

    const tick = (_time, deltaMs) => {
      const dt = Math.min(deltaMs, 64) / 1000
      const y = window.scrollY
      speed = ease(speed, (y - lastY) / Math.max(dt, 0.001), 4, dt)
      lastY = y
      if (Math.abs(speed) > 40) heading = speed > 0 ? 1 : -1
      if (!visible) return
      flow = ease(flow, hover ? 0 : 1, 5, dt)
      surge = ease(surge, Math.min(Math.abs(speed) / 220, 6), 5, dt)
      lean = ease(lean, hover ? 0 : gsap.utils.clamp(-8, 8, -speed / 110), 6, dt)
      for (const r of rows) {
        if (!r.span) continue
        r.x = gsap.utils.wrap(-r.span, 0, r.x + r.dir * heading * r.speed * (1 + surge) * flow * dt)
        r.el.style.transform = `translate3d(${r.x.toFixed(2)}px,0,0)${r.lean ? ` skewX(${lean.toFixed(2)}deg)` : ''}`
      }
    }
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      resize.disconnect()
      io.disconnect()
      band.removeEventListener('pointerenter', enter)
      band.removeEventListener('pointerleave', leave)
      rows.forEach((r) => { r.el.style.transform = '' })
    }
  }, [bandRef, majorRef, minorRef])
}

export function MarqueeBand() {
  const bandRef = useRef(null)
  const majorRef = useRef(null)
  const minorRef = useRef(null)
  useMarqueeMotion(bandRef, majorRef, minorRef)

  return (
    <section ref={bandRef} className="marquee relative overflow-hidden bg-night-lowest" aria-label={MARQUEE.label}>
      {/* Woven zari border, top and bottom, like the edge of a saree */}
      <div className="zari-border h-2.5" aria-hidden="true" />
      {/* A low warm glow behind the words, so the band reads as lit fabric rather than a flat strip */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_45%,rgb(201_164_92/0.09),transparent_70%)]" aria-hidden="true" />
      {/* Soft fade at both edges so words drift in and out rather than being cut */}
      <div className="relative [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]">
        <div className="py-5 sm:py-7">
          <MarqueeRow items={MARQUEE.items} variant="major" trackRef={majorRef} />
        </div>
        <div className="mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-gold/30 to-transparent" aria-hidden="true" />
        <div className="py-3.5 sm:py-4">
          <MarqueeRow items={MARQUEE.details} variant="minor" trackRef={minorRef} />
        </div>
      </div>
      <div className="zari-border h-2.5 rotate-180" aria-hidden="true" />
    </section>
  )
}

// 1 · Warm editorial introduction on parchment
export function IntroSection() {
  const ref = useSectionReveal()
  return (
    <section ref={ref} className="relative overflow-hidden bg-parchment py-20 text-forest sm:py-28" aria-labelledby="intro-title">
      {/* Kept fully inside the section: if it overhangs the bottom edge, the J's descending hook is cut off and it reads as "SIR" */}
      <div className="pointer-events-none absolute -right-6 bottom-10 select-none font-serif text-[clamp(10rem,24vw,24rem)] leading-none text-forest opacity-[0.05]" aria-hidden="true">SJR</div>
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="relative lg:col-span-6" data-reveal>
          <div className="absolute -left-4 -top-4 hidden h-full w-full border-2 border-gold/50 sm:block" aria-hidden="true" />
          <div className="relative h-[420px] overflow-hidden shadow-2xl sm:h-[520px]">
            <Photo {...INTRO.image} />
            <div className="absolute bottom-5 left-5 right-5 max-w-xs bg-forest p-4 text-parchment shadow-xl sm:bottom-6 sm:left-6 sm:right-auto">
              <span className={`${LABEL} text-gold`}>{INTRO.stamp.label}</span>
              <p className="mt-1 font-serif text-xl font-semibold">{INTRO.stamp.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-parchment/80">{INTRO.stamp.body}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <RuleLabel className="text-bronze" data-reveal>{INTRO.eyebrow}</RuleLabel>
          <h2 id="intro-title" className={`mt-4 text-forest ${H_XL}`} data-reveal>
            {INTRO.title} <br className="hidden sm:inline" />
            <span className="italic text-[#947230]">{INTRO.titleAccent}</span>
          </h2>
          <p className="mt-6 text-lg font-light leading-[1.85] text-[#3B4C45]" data-reveal>
            {INTRO.lead.split('SJR – House of Collection').flatMap((part, i) => (i ? [<strong key={i} className="font-semibold text-forest">SJR – House of Collection</strong>, part] : [part]))}
          </p>
          <p className="mt-5 text-[0.9375rem] leading-[1.7] text-[#4E6058]" data-reveal>{INTRO.body}</p>
          <blockquote className="mt-8 border-l-2 border-gold bg-parchment-dark/60 py-3 pl-6 pr-4" data-reveal>
            <p className="font-serif text-xl italic text-forest">{INTRO.quote}</p>
            <cite className={`mt-2 block not-italic text-bronze ${LABEL}`}>{INTRO.quoteBy}</cite>
          </blockquote>
          <dl className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4" data-reveal-stagger>
            {INTRO.stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-6">
                {i > 0 && <span className="h-10 w-px bg-gold/40" aria-hidden="true" />}
                <div className="flex flex-col-reverse">
                  <dt className="text-[0.8125rem] text-[#4E6058]">{s.label}</dt>
                  <dd className="font-serif text-[1.75rem] font-medium text-forest">{s.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

// 2 · Seven-category bento grid
const BENTO = [
  { span: 'lg:col-span-8', height: 'h-[400px] lg:h-[460px]', size: 'lg' },
  { span: 'lg:col-span-4', height: 'h-[400px] lg:h-[460px]', size: 'md' },
  { span: 'lg:col-span-4', height: 'h-[340px] lg:h-[380px]', size: 'sm' },
  { span: 'lg:col-span-4', height: 'h-[340px] lg:h-[380px]', size: 'sm' },
  { span: 'lg:col-span-4', height: 'h-[340px] lg:h-[380px]', size: 'sm' },
  { span: 'lg:col-span-6', height: 'h-[320px] lg:h-[340px]', size: 'md' },
  { span: 'lg:col-span-6', height: 'h-[320px] lg:h-[340px]', size: 'md' },
]
const CARD_TITLE = { lg: 'text-[2.25rem] leading-[1.15]', md: 'text-[1.75rem] leading-tight', sm: 'text-[1.4rem] leading-tight' }

// Category slug → its dedicated section further down the page
const SECTION_BY_SLUG = {
  sarees: SAREES.id, stitching: STITCHING.id, matchings: MATCHINGS.id, petticoats: PETTICOATS.id,
  inners: INNERS.id, nighties: NIGHTIES.id, 'fancy-jewellery': JEWELLERY.id, 'dress-sets': DRESS_SETS.id,
}

function CollectionCard({ category, index }) {
  const { settings } = useStore()
  const card = COLLECTIONS.cards[category.slug] || { label: `Category ${String(index + 1).padStart(2, '0')}`, title: category.name, body: category.description, cta: 'Enquire' }
  const layout = BENTO[index] || BENTO[BENTO.length - 1]
  const section = SECTION_BY_SLUG[category.slug]
  // Scroll to the category's section when it has one; otherwise fall back to a WhatsApp enquiry
  const link = section
    ? { href: `#${section}` }
    : { href: whatsappHref(settings, generalEnquiryMessage(settings, { topic: card.title })), ...EXTERNAL }
  return (
    <a
      {...link}
      className={`group relative flex cursor-pointer flex-col justify-end overflow-hidden border border-gold/20 bg-night-low p-6 transition-colors duration-500 hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light sm:p-8 ${layout.span} ${layout.height}`}
    >
      {category.image && (
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
          <Photo src={imageUrl(category.image)} alt="" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-night-lowest via-night-lowest/60 to-transparent" aria-hidden="true" />
      <div className="relative">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className={`${LABEL} text-gold-light`}>{card.label}</span>
          {card.badge && <span className="border border-gold/30 bg-night-high/90 px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-gold-light">{card.badge}</span>}
        </div>
        <h3 className={`font-serif font-medium text-ivory transition-colors duration-300 group-hover:text-gold-light ${CARD_TITLE[layout.size]}`}>{card.title}</h3>
        <p className="mb-4 mt-1 max-w-xl text-[0.8125rem] leading-relaxed text-mist">{card.body}</p>
        <span className={`inline-flex items-center gap-2 text-gold-light ${layout.size === 'sm' ? 'text-[0.6875rem] font-semibold uppercase tracking-[0.18em]' : ACTION}`}>
          {card.cta} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
        </span>
      </div>
    </a>
  )
}

export function CollectionsSection() {
  const { categories, status } = useStore()
  const ref = useRef(null)
  useReveal(ref, [categories.length])
  return (
    <section id="collections" ref={ref} className="relative bg-night-lowest py-20 text-ivory sm:py-28" aria-labelledby="collections-title">
      <div className="container-x">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end" data-reveal>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className={`${LABEL} text-gold-light`}>{COLLECTIONS.eyebrow}</span>
              <span className="text-xs text-gold" aria-hidden="true">◆</span>
              <span className={`${LABEL} text-mist`}>{COLLECTIONS.eyebrowNote}</span>
            </div>
            <h2 id="collections-title" className={`text-ivory ${H_XL}`}>{COLLECTIONS.title}</h2>
            <p className="mt-2 max-w-xl text-[0.9375rem] leading-[1.7] text-mist">{COLLECTIONS.lead}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`${LABEL} text-mist`}>{COLLECTIONS.aside}</span>
            <span className="h-px w-12 bg-gold/40" aria-hidden="true" />
          </div>
        </div>
        {status === 'loading' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
            {BENTO.map((b, i) => <div key={i} className={`animate-pulse bg-night-low ${b.span} ${b.height}`} />)}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12" data-reveal-stagger>
            {categories.map((c, i) => <CollectionCard key={c.slug} category={c} index={i} />)}
          </div>
        )}
      </div>
    </section>
  )
}

// ── 2.1–2.8 · Dedicated collection sections ──────────────────────────────────────────────────────────────────

const COLLECTION_ICONS = {
  ruler: PencilRuler, sparkles: Sparkles, clock: Clock, check: CircleCheck,
  texture: Grid2x2, layers: Layers, ribbon: Ribbon,
  shirt: Shirt, shield: Shield, cups: CircleDot, flower: Flower2,
  blossom: Flower, waves: Waves, zip: LockOpen,
}

function IconBox({ name, small = false }) {
  const Icon = COLLECTION_ICONS[name] || Sparkles
  return (
    <span className={`flex shrink-0 items-center justify-center border border-gold/30 bg-gold-light/10 text-gold-light ${small ? 'h-10 w-10' : 'h-12 w-12'}`}>
      <Icon className={small ? 'h-5 w-5' : 'h-6 w-6'} strokeWidth={1.5} aria-hidden="true" />
    </span>
  )
}

// Eyebrow + title + lead, left-aligned with an optional action on the right, or centred
function CollectionHeader({ data, titleId, action, centered = false }) {
  if (centered) {
    return (
      <div className="mx-auto mb-14 max-w-3xl text-center" data-reveal>
        <RuleLabel both className="mb-3 justify-center text-gold-light">{data.eyebrow}</RuleLabel>
        <h2 id={titleId} className={H_XL}>{data.title}</h2>
        <p className="mt-3 text-[0.9375rem] leading-[1.7] text-mist">{data.lead}</p>
      </div>
    )
  }
  return (
    <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end" data-reveal>
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <span className={`${LABEL} text-gold-light`}>{data.eyebrow}</span>
          {data.note && (
            <>
              <span className="text-xs text-gold" aria-hidden="true">◆</span>
              <span className={`${LABEL} !tracking-wider text-sage`}>{data.note}</span>
            </>
          )}
        </div>
        <h2 id={titleId} className={H_XL}>{data.title}</h2>
        <p className="mt-2 max-w-2xl text-[0.9375rem] leading-[1.7] text-mist">{data.lead}</p>
      </div>
      {action}
    </div>
  )
}

function CollectionSection({ data, tone, className = '', children }) {
  const ref = useSectionReveal()
  return (
    <section id={data.id} ref={ref} className={`relative border-t border-gold/20 py-20 text-ivory sm:py-28 ${tone === 'low' ? 'bg-night-lowest' : 'bg-night'} ${className}`} aria-labelledby={`${data.id}-title`}>
      <div className="container-x">{children}</div>
    </section>
  )
}

// Image card used by jewellery and dress sets
function ShowcaseCard({ item, height, cta, titleSize = 'text-xl' }) {
  const { settings } = useStore()
  const href = whatsappHref(settings, item.message)
  return (
    <article className="group flex flex-col overflow-hidden border border-gold/20 bg-night-low transition-[border-color,box-shadow] duration-300 hover:border-gold hover:shadow-2xl">
      <div className={`relative overflow-hidden border-b border-gold/20 bg-night-mid ${height}`}>
        {item.image && (
          <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-silk)] group-hover:scale-105">
            <Photo src={item.image} alt={item.alt} position={item.position} />
          </div>
        )}
        <span className="absolute left-3 top-3 border border-gold/30 bg-night-high/90 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-gold-light backdrop-blur-md">{item.badge}</span>
      </div>
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <span className="mb-1 block text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-gold">{item.label}</span>
          <h3 className={`font-serif font-semibold text-ivory transition-colors group-hover:text-gold-light ${titleSize}`}>{item.title}</h3>
          <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-mist">{item.body}</p>
        </div>
        {/* If the note and link don't fit on one line, the link drops to the right on the next */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-gold/15 pt-3">
          {item.status
            ? <span className="whitespace-nowrap text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-sage">{item.status}</span>
            : <span className="whitespace-nowrap text-xs text-sage">{item.note}</span>}
          <a href={href} {...EXTERNAL} className={`${ACTION} ml-auto shrink-0 text-gold-light hover:underline`} aria-label={`${cta} — ${item.title}, on WhatsApp`}>{cta} →</a>
        </div>
      </div>
    </article>
  )
}

// Hover loupe on saree photos: square side in px, and how much it magnifies
const LENS_SIZE = 150
const LENS_ZOOM = 2.5

// Saree card: the whole card is one WhatsApp link, framed like a drape on display
function SareeCard({ item, index, cta }) {
  const { settings } = useStore()
  const lensRef = useRef(null)
  const lensViewRef = useRef(null)
  // Move the loupe square with the cursor and pan its enlarged copy of the photo; written straight to the DOM to skip re-renders
  const followZoom = (e) => {
    if (e.pointerType !== 'mouse' || !lensRef.current) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const half = LENS_SIZE / 2
    lensRef.current.style.transform = `translate(${x - half}px, ${y - half}px)`
    const view = lensViewRef.current.style
    view.width = `${r.width * LENS_ZOOM}px`
    view.height = `${r.height * LENS_ZOOM}px`
    view.transform = `translate(${half - x * LENS_ZOOM}px, ${half - y * LENS_ZOOM}px)`
  }
  return (
    <a
      href={whatsappHref(settings, item.message)}
      {...EXTERNAL}
      aria-label={`${cta} — ${item.title}, on WhatsApp`}
      className="group relative flex cursor-pointer flex-col border border-gold/20 bg-night-low transition-[border-color,box-shadow,transform] duration-500 ease-[var(--ease-silk)] hover:border-gold/70 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.75)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light motion-safe:hover:-translate-y-1.5"
    >
      <div className="group/zoom relative aspect-[3/4] cursor-crosshair overflow-hidden bg-night-mid" onPointerMove={followZoom}>
        {item.image && <Photo src={item.image} alt={item.alt} position={item.position || '50% 25%'} />}
        {/* Shade at the foot of the photo so it settles into the card body */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night-low via-night-low/40 to-transparent" aria-hidden="true" />
        {/* Loupe square: an enlarged copy of the photo, panned so the cursor sits at its centre */}
        {item.image && (
          <div
            ref={lensRef}
            className="pointer-events-none absolute left-0 top-0 z-10 overflow-hidden border border-gold-light bg-night-mid opacity-0 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.8)] transition-opacity duration-300 group-hover/zoom:opacity-100"
            style={{ width: LENS_SIZE, height: LENS_SIZE }}
            aria-hidden="true"
          >
            <div ref={lensViewRef} className="absolute left-0 top-0">
              <Photo src={item.image} alt="" position={item.position || '50% 25%'} />
            </div>
          </div>
        )}
        {/* Gold inner frame that draws in on hover */}
        <div className="pointer-events-none absolute inset-3 border border-gold-light/0 transition-colors duration-500 group-hover:border-gold-light/60" aria-hidden="true" />
        <span className="absolute left-5 top-5 border border-gold/40 bg-night/70 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-gold-light backdrop-blur-md">{item.badge}</span>
        <span className="absolute right-5 top-4 font-serif text-[1.75rem] leading-none text-ivory/80 [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="relative flex flex-1 flex-col px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="flex items-center gap-2.5 text-gold">
          <span className="h-px w-6 bg-current" aria-hidden="true" />
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em]">{item.label}</span>
        </div>
        <h3 className="mt-2 font-serif text-[1.5rem] font-semibold leading-tight text-ivory transition-colors duration-300 group-hover:text-gold-light">{item.title}</h3>
        <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-mist">{item.body}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-gold/15 pt-4">
          <span className="whitespace-nowrap text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-sage">{item.status}</span>
          <span className={`${ACTION} ml-auto inline-flex shrink-0 items-center gap-2 text-gold-light`}>
            {cta}
            <span className="transition-transform duration-300 motion-safe:group-hover:translate-x-1" aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </a>
  )
}

export function SareesCollection() {
  const { settings } = useStore()
  const d = SAREES
  return (
    <CollectionSection data={d}>
      <CollectionHeader
        data={d}
        titleId={`${d.id}-title`}
        action={<a href={whatsappHref(settings, d.cta.message)} {...EXTERNAL} className={`${BTN_SAGE} shrink-0`}><WhatsAppIcon className="h-[18px] w-[18px]" /> {d.cta.label}</a>}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal-stagger>
        {d.items.map((item, i) => <SareeCard key={item.title} item={item} index={i} cta={d.cardCta} />)}
      </div>
    </CollectionSection>
  )
}

export function StitchingCollection() {
  const { settings } = useStore()
  const d = STITCHING
  return (
    <CollectionSection data={d} tone="low" className="lg:py-16">
      {/* On desktop the photo stretches to the copy's height so the whole spread fits one screen */}
      <div className="grid gap-12 lg:grid-cols-12 lg:items-stretch lg:gap-14">
        <div className="relative pb-5 pr-5 sm:pb-7 sm:pr-7 lg:col-span-6" data-reveal>
          {/* Offset mat behind the photo, like a fabric swatch pinned to a board */}
          <div className="pointer-events-none absolute bottom-0 left-5 right-0 top-5 border border-gold/30 bg-[radial-gradient(80%_70%_at_70%_80%,rgb(201_164_92/0.10),transparent_70%)] sm:left-7 sm:top-7" aria-hidden="true" />
          <div className="group relative h-[380px] overflow-hidden border border-gold/30 bg-night-mid shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] sm:h-[520px] lg:h-full lg:min-h-[480px]">
            <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-silk)] motion-safe:group-hover:scale-[1.03]">
              <Photo {...d.image} />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-3 border border-gold-light/25" aria-hidden="true" />
            {/* Tape-measure edge: fine ticks every 12px, long ticks every 60px */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-7 border-r border-gold/30 bg-night/70 backdrop-blur-sm" aria-hidden="true">
              <div className="absolute inset-y-0 left-0 w-2.5 [background-image:repeating-linear-gradient(to_bottom,rgb(227_200_143/0.55)_0_1px,transparent_1px_12px)]" />
              <div className="absolute inset-y-0 left-0 w-4 [background-image:repeating-linear-gradient(to_bottom,rgb(227_200_143/0.9)_0_1px,transparent_1px_60px)]" />
            </div>
            {/* Fitting seal, ringed with a stitched border */}
            <div className="absolute right-4 top-4 flex h-[4.75rem] w-[4.75rem] flex-col items-center justify-center rounded-full border border-gold-light/60 bg-night/80 text-center backdrop-blur-md sm:right-7 sm:top-7 sm:h-24 sm:w-24">
              <span className="pointer-events-none absolute inset-1.5 rounded-full border border-dashed border-gold-light/40" aria-hidden="true" />
              <span className="font-serif text-[1.9rem] leading-none text-gold-light">18</span>
              <span className="mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.2em] text-mist">Point Fit</span>
            </div>
            <div className="absolute bottom-5 left-10 right-5 max-w-sm border-l-2 border-gold-light bg-night/85 px-4 py-3.5 backdrop-blur-md sm:bottom-8 sm:left-12 sm:right-8 sm:px-5 sm:py-4">
              <span className={`block text-gold-light ${LABEL}`}>{d.caption.label}</span>
              <span className="mt-1.5 block font-serif text-[1.2rem] sm:text-[1.4rem] font-semibold leading-tight text-ivory">{d.caption.title}</span>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-mist">{d.caption.body}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center lg:col-span-6">
          <RuleLabel className="mb-3 text-gold-light" data-reveal>{d.eyebrow}</RuleLabel>
          <h2 id={`${d.id}-title`} className={`mb-5 ${H_XL} lg:text-[3.1rem]`} data-reveal>
            {d.title} <br />
            <span className="italic text-gold-light">{d.titleAccent}</span>
          </h2>
          <p className="max-w-xl text-base font-light leading-[1.8] text-mist lg:text-[0.9375rem] lg:leading-[1.75]" data-reveal>{d.lead}</p>
          {/* Stitched seam divider */}
          <div className="my-7 flex items-center gap-3 text-gold lg:my-6" aria-hidden="true" data-reveal>
            <Scissors className="h-4 w-4 -rotate-90" strokeWidth={1.5} />
            <span className="h-0 flex-1 border-t border-dashed border-gold/50" />
          </div>
          <ul className="mb-8 grid border-l border-t border-gold/20 sm:grid-cols-2" data-reveal-stagger>
            {d.features.map((f, i) => {
              const Icon = COLLECTION_ICONS[f.icon] || Sparkles
              return (
                <li key={f.title} className="group/feat relative flex items-start gap-4 border-b border-r border-gold/20 p-5 transition-colors duration-300 hover:bg-night-low">
                  <span className="absolute right-4 top-4 font-serif text-[1rem] italic text-gold/50" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-gold/35 bg-gold-light/10 text-gold-light transition-colors duration-300 group-hover/feat:border-gold-light group-hover/feat:bg-gold-light group-hover/feat:text-ink">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <span className="block pr-7 font-serif text-[1.125rem] font-semibold leading-snug text-ivory">{f.title}</span>
                    <p className="mt-1 text-[0.8125rem] leading-relaxed text-mist">{f.body}</p>
                  </div>
                </li>
              )
            })}
          </ul>
          {/* Labels may wrap on phones so the long consultation button never overflows the screen */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:[&>a]:whitespace-nowrap [&>a]:text-center" data-reveal>
            <a href={whatsappHref(settings, d.primary.message)} {...EXTERNAL} className={`${BTN_GOLD} shadow-xl`}><CalendarDays className="h-[18px] w-[18px]" aria-hidden="true" /> {d.primary.label}</a>
            <a href={whatsappHref(settings, d.secondary.message)} {...EXTERNAL} className={BTN_LINE}><WhatsAppIcon className="h-[18px] w-[18px]" /> {d.secondary.label}</a>
          </div>
        </div>
      </div>
    </CollectionSection>
  )
}

// Matching card: the whole card is one WhatsApp link; photo on top with the icon seal riding its lower edge
function MatchingCard({ item, cta }) {
  const { settings } = useStore()
  const Icon = COLLECTION_ICONS[item.icon] || Sparkles
  return (
    <a
      href={whatsappHref(settings, item.message)}
      {...EXTERNAL}
      aria-label={`${cta} — ${item.title}, on WhatsApp`}
      className="group flex cursor-pointer flex-col border border-gold/20 bg-night-low transition-[border-color,box-shadow] duration-300 hover:border-gold/70 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.75)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-night-mid">
        <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-silk)] motion-safe:group-hover:scale-105">
          <Photo src={item.image} alt={item.alt} position={item.position} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night-low via-night-low/10 to-transparent" aria-hidden="true" />
        <span className="absolute left-4 top-4 border border-gold/40 bg-night/75 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-gold-light backdrop-blur-md">{item.note}</span>
      </div>
      <div className="relative flex flex-1 flex-col px-6 pb-6 sm:px-7 sm:pb-7">
        <span className="-mt-6 mb-4 flex h-12 w-12 items-center justify-center border border-gold/50 bg-night-high text-gold-light shadow-lg transition-colors duration-300 group-hover:border-gold-light group-hover:bg-gold-light group-hover:text-ink">
          <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <span className={`${LABEL} text-gold-light`}>{item.label}</span>
        <h3 className="mb-3 mt-1.5 font-serif text-[1.65rem] font-medium leading-tight text-ivory transition-colors duration-300 group-hover:text-gold-light">{item.title}</h3>
        <p className="flex-1 text-[0.875rem] leading-relaxed text-mist">{item.body}</p>
        <span className={`${ACTION} mt-6 inline-flex items-center gap-2 border-t border-gold/15 pt-4 text-gold-light`}>
          {cta}
          <span className="transition-transform duration-300 motion-safe:group-hover:translate-x-1" aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  )
}

// Shade card strip: tall dyed-thread swatches that lift on hover. The strip and the tone count both open the full shade finder.
function ShadeCard({ shades }) {
  const [open, setOpen] = useState(false)
  return (
    <figure className="mx-auto mb-14 max-w-4xl" data-reveal>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group/shades flex h-20 w-full cursor-pointer gap-1 border border-gold/25 bg-night-low p-1.5 transition-colors duration-300 hover:border-gold/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light sm:h-24 sm:gap-1.5 sm:p-2"
        aria-label={`Open the shade card — ${shades.note}`}
        aria-haspopup="dialog"
      >
        {shades.swatches.map((s) => (
          <span
            key={s.name}
            title={s.name}
            className="h-full flex-1 border-t-2 border-gold-light/60 transition-transform duration-300 ease-[var(--ease-silk)] motion-safe:hover:-translate-y-1.5"
            style={{ backgroundColor: s.hex }}
            aria-hidden="true"
          />
        ))}
      </button>
      <figcaption className="mt-3 flex items-center justify-between gap-4">
        <span className={`${LABEL} text-mist`}>{shades.label}</span>
        <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" className={`${LABEL} group/more -my-3 inline-flex min-h-11 cursor-pointer items-center gap-2 text-gold-light transition-colors hover:text-ivory`}>
          {shades.note}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 motion-safe:group-hover/more:translate-x-1" aria-hidden="true" />
        </button>
      </figcaption>
      <ShadeFinder open={open} onClose={() => setOpen(false)} />
    </figure>
  )
}

export function MatchingsCollection() {
  const d = MATCHINGS
  return (
    <CollectionSection data={d}>
      <CollectionHeader data={d} titleId={`${d.id}-title`} centered />
      <ShadeCard shades={d.shades} />
      <div className="grid gap-6 md:grid-cols-3 lg:gap-8" data-reveal-stagger>
        {d.items.map((item) => <MatchingCard key={item.title} item={item} cta={d.cardCta} />)}
      </div>
    </CollectionSection>
  )
}

// Petticoat card: photo, copy and a reserve link. `wide` lays it out photo-beside-copy while it spans two columns (tablet).
function PetticoatCard({ item, cta, wide = false }) {
  const { settings } = useStore()
  return (
    <article className={`group flex flex-col justify-between overflow-hidden border border-gold/20 bg-night-low transition-[border-color,box-shadow] duration-300 hover:border-gold hover:shadow-2xl ${wide ? 'sm:col-span-2 sm:flex-row lg:col-span-1 lg:flex-col' : ''}`}>
      <div className={wide ? 'sm:flex sm:flex-1 lg:block' : ''}>
        <div className={`relative h-80 w-full shrink-0 overflow-hidden border-b border-gold/20 bg-night-mid sm:h-96 lg:h-[22rem] ${wide ? 'sm:h-auto sm:min-h-[22rem] sm:w-[45%] sm:border-b-0 sm:border-r lg:h-[22rem] lg:min-h-0 lg:w-full lg:border-b lg:border-r-0' : ''}`}>
          <img
            src={item.image}
            alt={item.alt}
            width={800}
            height={1000}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ objectPosition: item.position }}
          />
          <span className="absolute left-3 top-3 border border-gold/30 bg-night-high/90 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-gold-light backdrop-blur-md">{item.badge}</span>
        </div>
        <div className="flex flex-col p-5 sm:p-6">
          <div className="mb-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-gold-light">{item.label}</span>
            <span className="text-right text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-sage">{item.spec}</span>
          </div>
          <h3 className="mb-2 font-serif text-[1.45rem] font-medium leading-tight sm:text-[1.6rem] text-ivory transition-colors group-hover:text-gold-light">{item.title}</h3>
          <p className="mb-4 text-[0.8125rem] leading-relaxed text-mist">{item.body}</p>
          <ul className="flex flex-col gap-2 text-[0.8125rem] text-mist">
            {item.points.map((pt) => (
              <li key={pt} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" aria-hidden="true" /> {pt}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className={`mt-2 p-5 pt-0 sm:p-6 sm:pt-0 ${wide ? 'sm:self-end sm:w-[55%] lg:w-full' : ''}`}>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-gold/15 pt-4">
          <span className="text-xs text-sage">{item.note}</span>
          <a href={whatsappHref(settings, item.message)} {...EXTERNAL} className={`${ACTION} flex items-center gap-1 text-gold-light hover:underline`} aria-label={`${cta} — ${item.title}, on WhatsApp`}>{cta} →</a>
        </div>
      </div>
    </article>
  )
}

export function PetticoatsCollection() {
  const d = PETTICOATS
  return (
    <CollectionSection data={d} tone="low">
      <CollectionHeader data={d} titleId={`${d.id}-title`} action={<span className={`${LABEL} !tracking-wider shrink-0 text-mist`}>{d.aside}</span>} />
      {/* 1 column on phones, 2 on tablets (the third card spans both, photo beside copy), 3 on desktop */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
        {d.items.map((item, i) => <PetticoatCard key={item.title} item={item} cta={d.cardCta} wide={i === d.items.length - 1} />)}
      </div>
    </CollectionSection>
  )
}

// Inners: photo panel with the comfort promises beside a compact 2x2 grid, sized so the spread fits one laptop screen
export function InnersCollection() {
  const { settings } = useStore()
  const d = INNERS
  return (
    <CollectionSection data={d} className="lg:py-16">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
        {/* Photo panel */}
        <div className="relative min-h-[300px] overflow-hidden border border-gold/25 bg-night-mid sm:min-h-[380px] lg:col-span-5 lg:min-h-0" data-reveal>
          <div className="absolute inset-0"><Photo {...d.image} /></div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-3 border border-gold-light/20" aria-hidden="true" />
          <div className="absolute inset-x-5 bottom-5 sm:inset-x-7 sm:bottom-7">
            <span className={`${LABEL} text-gold-light`}>{d.note}</span>
            <ul className="mt-3 flex flex-wrap gap-2">
              {d.promises.map((p) => (
                <li key={p} className="inline-flex items-center gap-1.5 border border-gold/40 bg-night/80 px-3 py-1.5 text-[0.75rem] font-semibold text-ivory backdrop-blur-md">
                  <Check className="h-3.5 w-3.5 text-gold-light" strokeWidth={2.5} aria-hidden="true" /> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copy + essentials */}
        <div className="flex flex-col lg:col-span-7">
          <div data-reveal>
            <RuleLabel className="mb-3 text-gold-light">{d.eyebrow}</RuleLabel>
            <h2 id={`${d.id}-title`} className={`${H_XL} lg:text-[3rem]`}>{d.title}</h2>
            <p className="mt-3 max-w-2xl text-[0.9375rem] leading-[1.7] text-mist">{d.lead}</p>
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2" data-reveal-stagger>
            {d.items.map((item, i) => {
              const Icon = COLLECTION_ICONS[item.icon] || Sparkles
              return (
                <li key={item.title} className="group/inner relative flex flex-col border border-gold/20 bg-night-low p-5 transition-colors duration-300 hover:border-gold/60 hover:bg-night-mid">
                  <span className="absolute right-4 top-4 font-serif text-[1rem] italic text-gold/50" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex items-center gap-3 pr-8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-gold/35 bg-gold-light/10 text-gold-light transition-colors duration-300 group-hover/inner:border-gold-light group-hover/inner:bg-gold-light group-hover/inner:text-ink">
                      <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <h3 className="font-serif text-[1.2rem] font-semibold leading-snug text-ivory">{item.title}</h3>
                  </div>
                  <p className="mt-3 flex-1 text-[0.8125rem] leading-relaxed text-mist">{item.body}</p>
                  <span className="mt-4 w-fit border-t border-gold/15 pt-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-sage">{item.note}</span>
                </li>
              )
            })}
          </ul>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" data-reveal>
            <p className="flex items-center gap-2 text-[0.8125rem] text-mist">
              <Shield className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" /> {d.privacy}
            </p>
            <a href={whatsappHref(settings, d.cta.message)} {...EXTERNAL} className={`${BTN_SAGE} shrink-0 text-center`}>
              <WhatsAppIcon className="h-[18px] w-[18px]" /> {d.cta.label}
            </a>
          </div>
        </div>
      </div>
    </CollectionSection>
  )
}

export function NightiesCollection() {
  const { settings } = useStore()
  const d = NIGHTIES
  return (
    <CollectionSection data={d} tone="low">
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col lg:col-span-6">
          <RuleLabel className="mb-3 text-gold-light" data-reveal>{d.eyebrow}</RuleLabel>
          <h2 id={`${d.id}-title`} className={`mb-6 ${H_XL}`} data-reveal>
            {d.title} <br />
            <span className="italic text-gold-light">{d.titleAccent}</span>
          </h2>
          <p className="mb-6 text-lg font-light leading-[1.85] text-mist" data-reveal>{d.lead}</p>
          <ul className="mb-8 flex flex-col gap-4" data-reveal-stagger>
            {d.features.map((f) => (
              <li key={f.title} className="flex items-start gap-4 border border-gold/20 bg-night-low p-4">
                <IconBox name={f.icon} small />
                <div>
                  <h3 className="text-sm font-semibold text-ivory">{f.title}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-mist">{f.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <div data-reveal>
            <a href={whatsappHref(settings, d.cta.message)} {...EXTERNAL} className={`${BTN_GOLD} shadow-xl`}><WhatsAppIcon className="h-[18px] w-[18px]" /> {d.cta.label}</a>
          </div>
        </div>
        <div className="lg:col-span-6" data-reveal>
          <div className="h-[420px] overflow-hidden border border-gold/30 shadow-2xl sm:h-[500px]"><Photo {...d.image} /></div>
        </div>
      </div>
    </CollectionSection>
  )
}

export function JewelleryCollection() {
  const d = JEWELLERY
  return (
    <CollectionSection data={d}>
      <CollectionHeader data={d} titleId={`${d.id}-title`} centered />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal-stagger>
        {d.items.map((item) => <ShowcaseCard key={item.title} item={item} height="h-[300px] lg:h-[320px]" cta={d.cardCta} />)}
      </div>
    </CollectionSection>
  )
}

export function DressSetsCollection() {
  const { settings } = useStore()
  const d = DRESS_SETS
  return (
    <CollectionSection data={d} tone="low">
      <CollectionHeader
        data={d}
        titleId={`${d.id}-title`}
        action={<a href={whatsappHref(settings, d.cta.message)} {...EXTERNAL} className={`${BTN_GOLD} shrink-0 shadow-xl`}><WhatsAppIcon className="h-[18px] w-[18px]" /> {d.cta.label}</a>}
      />
      <div className="grid gap-6 md:grid-cols-3 lg:gap-8" data-reveal-stagger>
        {d.items.map((item) => <ShowcaseCard key={item.title} item={item} height="h-[340px] lg:h-[360px]" cta={d.cardCta} titleSize="text-[1.6rem] leading-tight" />)}
      </div>
    </CollectionSection>
  )
}

// 3 · Featured masterpiece
export function FeaturedSection() {
  const { settings } = useStore()
  const ref = useSectionReveal()
  return (
    <section id="featured" ref={ref} className="relative overflow-hidden border-y border-gold/20 bg-night py-20 text-ivory sm:py-28" aria-labelledby="featured-title">
      <div className="container-x">
        <div className="mb-14 flex items-center justify-center gap-4 text-gold-light" data-reveal>
          <span className="hidden h-px w-24 bg-gold/30 sm:block" aria-hidden="true" />
          <span className="text-xs" aria-hidden="true">◆</span>
          <span className={`${LABEL} text-center`}>{FEATURED.ribbon}</span>
          <span className="text-xs text-gold" aria-hidden="true">◆</span>
          <span className="hidden h-px w-24 bg-gold/30 sm:block" aria-hidden="true" />
        </div>

        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="relative lg:col-span-7" data-reveal>
            <div className="relative h-[460px] border border-gold/30 shadow-2xl sm:h-[620px]">
              <Photo {...FEATURED.image} />
              <div className="absolute left-5 top-5 max-w-[200px] border border-gold/40 bg-night/90 p-4 backdrop-blur-md sm:left-6 sm:top-6">
                <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-gold-light">{FEATURED.seal.label}</span>
                <span className="font-serif text-xl font-semibold text-ivory">{FEATURED.seal.title}</span>
                <span className="mt-1 block text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-sage">{FEATURED.seal.note}</span>
              </div>
              <figure className="absolute -bottom-8 -right-4 hidden h-48 w-48 border-2 border-gold-light shadow-2xl sm:block lg:-right-8">
                <Photo src={FEATURED.detail.src} alt={FEATURED.detail.alt} />
                <figcaption className="absolute bottom-2.5 left-2.5 bg-night/90 px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-wider text-gold-light">{FEATURED.detail.caption}</figcaption>
              </figure>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-5 lg:pl-6">
            <span className={`${LABEL} mb-3 text-gold-light`} data-reveal>{FEATURED.code}</span>
            <h2 id="featured-title" className={`mb-6 ${H_XL}`} data-reveal>
              {FEATURED.title} <br />
              <span className="italic text-gold-light">{FEATURED.titleAccent}</span>
            </h2>
            <p className="mb-6 text-[0.9375rem] leading-[1.7] text-mist" data-reveal>{FEATURED.body}</p>
            <dl className="mb-8 flex flex-col gap-4 border border-gold/20 bg-night-low p-6" data-reveal>
              {FEATURED.specs.map((s, i) => (
                <div key={s.label} className={`flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${i < FEATURED.specs.length - 1 ? 'border-b border-gold/15 pb-2.5' : ''}`}>
                  <dt className={`${LABEL} text-mist`}>{s.label}</dt>
                  <dd className={`text-[0.8125rem] font-semibold sm:text-right ${s.tone === 'gold' ? 'text-gold-light' : s.tone === 'sage' ? 'text-sage' : 'text-ivory'}`}>{s.value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap [&>a]:whitespace-nowrap" data-reveal>
              <a href={whatsappHref(settings, FEATURED.enquiry)} {...EXTERNAL} className={BTN_GOLD}>
                <WhatsAppIcon className="h-[18px] w-[18px]" /> Inquire via WhatsApp
              </a>
              <a href={whatsappHref(settings, FEATURED.trialEnquiry)} {...EXTERNAL} className={BTN_LINE}>Boutique Private Trial</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 4 · New arrivals (products.json), with working filter chips
const BADGE_TONE = {
  gold: 'bg-gold-light text-ink',
  sage: 'bg-sage-deep text-sage border border-gold/30',
  default: 'bg-night-high/90 text-gold-light border border-gold/30',
}

function ArrivalCard({ product }) {
  const { settings, categoryBySlug } = useStore()
  const image = product.images?.[0]
  const enquiry = whatsappHref(settings, productEnquiryMessage(settings, product, categoryBySlug[product.categorySlug]?.name))
  return (
    <article className="group flex flex-col border border-gold/20 bg-night-low transition-[border-color,box-shadow] duration-300 hover:border-gold hover:shadow-2xl">
      <div className="relative h-[400px] overflow-hidden">
        {image ? <Photo src={imageUrl(image.url)} alt={image.alt || product.name} position={product.imagePosition} /> : <div className="h-full w-full bg-night-high" />}
        {product.badge && (
          <span className={`absolute left-3 top-3 px-2 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.2em] ${BADGE_TONE[product.badgeTone] || BADGE_TONE.default}`}>{product.badge}</span>
        )}
        {/* Hover/focus shortcut on pointer devices; the same enquiry link is always in the card footer */}
        <div className="absolute inset-0 hidden items-center justify-center bg-night/30 p-4 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:hover)]:flex">
          <a href={enquiry} {...EXTERNAL} tabIndex={-1} aria-hidden="true" className="flex w-full items-center justify-center gap-1.5 bg-gold-light py-3 text-center text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink shadow-xl transition-colors hover:bg-ivory">
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp Enquiry
          </a>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <span className="mb-1 block text-[0.6875rem] font-semibold tracking-[0.22em] text-gold">#{product.productCode}</span>
          <h3 className="font-serif text-xl font-semibold text-ivory transition-colors group-hover:text-gold-light">{product.name}</h3>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-mist">{product.description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-gold/15 pt-3">
          <span className={`${LABEL} !tracking-wider text-sage`}>{product.statusLabel}</span>
          <a href={enquiry} {...EXTERNAL} className={`${ACTION} text-gold-light hover:underline`} aria-label={`Enquire about ${product.name} on WhatsApp`}>Enquire →</a>
        </div>
      </div>
    </article>
  )
}

export function NewArrivalsSection() {
  const { settings } = useStore()
  const { data, loading, error } = useAsync(() => getNewArrivals(4), [])
  const [tag, setTag] = useState(null)
  const ref = useRef(null)
  useReveal(ref, [data?.length])
  const shown = useMemo(() => (data || []).filter((p) => !tag || p.tags?.includes(tag)), [data, tag])
  if (!loading && (error || !data?.length)) return null

  return (
    <section id="new-arrivals" ref={ref} className="relative bg-night-lowest py-20 text-ivory sm:py-28" aria-labelledby="arrivals-title">
      <div className="container-x">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end" data-reveal>
          <div>
            <span className={`${LABEL} mb-2 block text-gold-light`}>{ARRIVALS.eyebrow}</span>
            <h2 id="arrivals-title" className={H_XL}>{ARRIVALS.title}</h2>
            <p className="mt-1 text-[0.9375rem] text-mist">{ARRIVALS.lead}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter new arrivals">
            {ARRIVALS.filters.map((f) => {
              const on = tag === f.tag
              return (
                <button
                  key={f.label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTag(f.tag)}
                  className={`min-h-11 cursor-pointer border px-4 py-2 transition-colors ${ACTION} ${on ? 'border-gold/40 bg-sage-deep text-sage' : 'border-transparent bg-night-mid text-mist hover:text-gold-light'}`}
                >
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="h-[560px] animate-pulse bg-night-low" />)}</div>
        ) : shown.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((p) => <ArrivalCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="border border-gold/20 bg-night-low p-8 text-center text-mist" role="status">No new arrivals in this weave right now — ask us on WhatsApp for the latest pieces.</p>
        )}

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border border-gold/30 bg-night-mid p-8 md:flex-row" data-reveal>
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-gold/40 bg-gold-light/10 text-gold-light"><BookOpen className="h-6 w-6" aria-hidden="true" /></span>
            <div>
              <h3 className="font-serif text-xl font-semibold text-ivory">{ARRIVALS.banner.title}</h3>
              <p className="text-[0.8125rem] text-mist">{ARRIVALS.banner.body}</p>
            </div>
          </div>
          <a href={whatsappHref(settings, ARRIVALS.banner.message)} {...EXTERNAL} className={`${BTN_GOLD} shrink-0 whitespace-nowrap`}>
            {ARRIVALS.banner.cta} <BookOpen className="h-[18px] w-[18px]" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}

// 5 · Craft pillars
const PILLAR_ICONS = { ruler: Ruler, brush: Brush, palette: Palette, concierge: UserCheck }

export function CraftSection() {
  const ref = useSectionReveal()
  return (
    <section id="craft" ref={ref} className="relative overflow-hidden bg-night py-20 text-ivory sm:py-28" aria-labelledby="craft-title">
      <div className="container-x">
        <div className="mx-auto mb-16 max-w-3xl text-center" data-reveal>
          <RuleLabel both className="mb-3 justify-center text-gold-light">{CRAFT.eyebrow}</RuleLabel>
          <h2 id="craft-title" className={H_XL}>{CRAFT.title}</h2>
          <p className="mt-4 text-lg font-light leading-[1.85] text-mist">{CRAFT.lead}</p>
        </div>
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8" data-reveal-stagger>
          {CRAFT.pillars.map((p, i) => {
            const Icon = PILLAR_ICONS[p.icon] || Ruler
            return (
              <li key={p.title} className="flex flex-col border border-gold/20 bg-night-low p-8 transition-colors duration-300 hover:border-gold">
                <span className="mb-6 flex h-12 w-12 items-center justify-center border border-gold/40 bg-night-high text-gold-light"><Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" /></span>
                <span className={`${LABEL} mb-2 text-gold-light`}>Pillar {String(i + 1).padStart(2, '0')}</span>
                <h3 className="mb-3 font-serif text-xl font-semibold text-ivory">{p.title}</h3>
                <p className="text-[0.8125rem] leading-relaxed text-mist">{p.body}</p>
              </li>
            )
          })}
        </ol>
        <div className="mt-12 grid gap-6 md:grid-cols-3" data-reveal-stagger>
          {CRAFT.images.map((img) => (
            <div key={img.src} className="h-64 overflow-hidden border border-gold/20"><Photo {...img} /></div>
          ))}
        </div>
      </div>
    </section>
  )
}

// 6 · Brand story (the nav's "About")
export function StorySection() {
  const ref = useSectionReveal()
  return (
    <section id="about" ref={ref} className="relative border-t border-gold/20 bg-night-lowest py-20 text-ivory sm:py-28" aria-labelledby="story-title">
      <div className="container-x grid items-center gap-16 lg:grid-cols-12">
        <div className="flex flex-col lg:col-span-6">
          <RuleLabel className="mb-4 text-gold-light" data-reveal>{STORY.eyebrow}</RuleLabel>
          <h2 id="story-title" className={`mb-6 ${H_XL}`} data-reveal>
            {STORY.title} <br />
            <span className="italic text-gold-light">{STORY.titleAccent}</span>
          </h2>
          <p className="mb-6 text-lg font-light leading-[1.85] text-mist" data-reveal>
            {STORY.lead.split('SJR – House of Collection').flatMap((part, i) => (i ? [<strong key={i} className="font-normal text-ivory">SJR – House of Collection</strong>, part] : [part]))}
          </p>
          {STORY.paragraphs.map((t) => <p key={t.slice(0, 20)} className="mb-6 text-[0.9375rem] leading-[1.7] text-mist" data-reveal>{t}</p>)}
          <dl className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-gold/20 pt-6" data-reveal>
            {STORY.facts.map((f, i) => (
              <div key={f.value} className="flex items-center gap-8">
                {i > 0 && <span className="hidden h-10 w-px bg-gold/30 sm:block" aria-hidden="true" />}
                <div className="flex flex-col">
                  <dt className="font-serif text-[1.75rem] font-medium text-gold-light">{f.value}</dt>
                  <dd className={`${LABEL} mt-1 !tracking-[0.16em] text-mist`}>{f.label}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative lg:col-span-6" data-reveal>
          <div className="relative h-[420px] border border-gold/30 shadow-2xl sm:h-[540px]">
            <Photo {...STORY.image} />
            <figure className="absolute -bottom-8 -left-8 hidden max-w-xs border border-gold/40 bg-night-high p-6 shadow-2xl sm:block">
              <figcaption className={`${LABEL} !tracking-wider text-gold-light`}>{STORY.vision.label}</figcaption>
              <blockquote className="mt-2 text-[0.8125rem] italic leading-relaxed text-ivory">{STORY.vision.quote}</blockquote>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}

// 7 · Gallery mosaic
const SPAN = { 3: 'lg:col-span-3', 4: 'lg:col-span-4', 5: 'lg:col-span-5' }

export function GallerySection() {
  const ref = useSectionReveal()
  return (
    <section id="gallery" ref={ref} className="relative bg-night py-20 text-ivory sm:py-28" aria-labelledby="gallery-title">
      <div className="container-x">
        <div className="mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-end" data-reveal>
          <div>
            <span className={`${LABEL} mb-2 block text-gold-light`}>{GALLERY.eyebrow}</span>
            <h2 id="gallery-title" className={H_XL}>{GALLERY.title}</h2>
          </div>
          <p className="max-w-md text-[0.8125rem] leading-relaxed text-mist">{GALLERY.lead}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-12" data-reveal-stagger>
          {GALLERY.items.map((g) => (
            <figure key={g.src} className={`group relative overflow-hidden border border-gold/20 ${SPAN[g.span]} ${g.tall ? 'h-[360px] lg:h-[420px]' : 'h-[300px] lg:h-[340px]'}`}>
              <Photo src={g.src} alt={g.alt} position={g.position} className="transition-transform duration-700 group-hover:scale-105" />
              {/* Captions always show on touch screens; on pointer devices they reveal on hover */}
              <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-night/70 to-transparent p-5 transition-opacity duration-300 [@media(hover:hover)]:bg-night/40 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 sm:p-6">
                <span className={`${LABEL} border border-gold/30 bg-night/90 px-3 py-1.5 text-gold-light`}>{g.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

// 8 · Visit, contact and appointment request
function AppointmentForm() {
  const { settings } = useStore()
  const today = new Date().toISOString().slice(0, 10)

  // No server: the request opens WhatsApp with everything filled in, and the visitor sends it.
  const onSubmit = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const date = new Date(`${f.get('date')}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    const notes = String(f.get('notes') || '').trim()
    const message = [`I would like to reserve a private salon session on ${date}.`, notes && `Notes: ${notes}`].filter(Boolean).join('\n')
    const href = whatsappHref(settings, generalEnquiryMessage(settings, { name: f.get('name'), phone: f.get('phone'), topic: f.get('service'), message }))
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  const field = 'w-full min-h-11 border-0 border-b border-gold/40 bg-night-mid px-3 py-2 text-[0.875rem] text-ivory placeholder:text-mist/50 transition-colors focus:border-gold-light focus:outline-none [color-scheme:dark]'
  const label = 'mb-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-gold-light'
  return (
    <div className="border border-gold/25 bg-night-low p-6 shadow-xl sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-gold/15 pb-4">
        <div>
          <h3 className="font-serif text-xl font-semibold text-ivory">{VISIT.form.title}</h3>
          <p className="mt-1 text-[0.8125rem] text-mist">{VISIT.form.lead}</p>
        </div>
        <CalendarCheck className="h-7 w-7 shrink-0 text-gold-light" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <form className="grid gap-6 sm:grid-cols-2" onSubmit={onSubmit}>
        <div className="flex flex-col">
          <label htmlFor="appt-name" className={label}>Client Full Name *</label>
          <input id="appt-name" name="name" type="text" required autoComplete="name" placeholder="e.g. Ananya Rao" className={field} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="appt-phone" className={label}>WhatsApp Number *</label>
          <input id="appt-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" className={field} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="appt-service" className={label}>Service of Interest *</label>
          <select id="appt-service" name="service" required className={field}>
            {VISIT.form.services.map((s) => <option key={s} className="bg-night-high">{s}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="appt-date" className={label}>Preferred Consultation Date *</label>
          <input id="appt-date" name="date" type="date" required min={today} className={field} />
        </div>
        <div className="flex flex-col sm:col-span-2">
          <label htmlFor="appt-notes" className={label}>Bespoke Notes / Wedding Date</label>
          <input id="appt-notes" name="notes" type="text" placeholder="Tell us about the occasion, colour preferences, or specific drape requirements..." className={field} />
        </div>
        <div className="mt-2 sm:col-span-2">
          <button type="submit" className={`${BTN_GOLD} w-full shadow-xl`}>
            {VISIT.form.submit} <BadgeCheck className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
          <p className="mt-3 text-center text-xs text-mist/80">Opens WhatsApp with your details filled in — send the message to place your request.</p>
        </div>
      </form>
    </div>
  )
}

export function VisitSection() {
  const { settings } = useStore()
  const ref = useSectionReveal()
  const [line1, line2, cityLine] = addressLines(settings.address)
  const phone = `+${settings.countryCode} ${formatPhone(settings.phone)}`
  return (
    <section id="visit" ref={ref} className="relative border-t border-gold/20 bg-night-lowest py-20 text-ivory sm:py-28" aria-labelledby="visit-title">
      <div className="container-x">
        <div className="mx-auto mb-16 max-w-2xl text-center" data-reveal>
          <RuleLabel both className="mb-3 justify-center text-gold-light">{VISIT.eyebrow}</RuleLabel>
          <h2 id="visit-title" className={H_XL}>{VISIT.title}</h2>
          <p className="mt-3 text-[0.9375rem] leading-[1.7] text-mist">{VISIT.lead}</p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-6 border border-gold/25 bg-night-low p-6 shadow-xl sm:p-8 lg:col-span-5" data-reveal>
            <div className="border-b border-gold/20 pb-6">
              <p className={`mb-2 flex items-center gap-3 text-gold-light ${ACTION}`}><MapPin className="h-[22px] w-[22px]" aria-hidden="true" /> Location &amp; Address</p>
              <address className="pl-[34px] not-italic">
                <span className="block text-[0.9375rem] font-medium text-ivory">{[line1, line2].filter(Boolean).join(', ')},</span>
                <span className="block text-[0.8125rem] text-mist">{cityLine}{settings.address.postalCode ? ` – ${settings.address.postalCode}` : ''}, {settings.address.country}</span>
              </address>
              <p className="mt-1 pl-[34px] text-xs text-sage">{VISIT.parkingNote}</p>
            </div>
            <div className="border-b border-gold/20 pb-6">
              <p className={`mb-2 flex items-center gap-3 text-gold-light ${ACTION}`}><Clock className="h-[22px] w-[22px]" aria-hidden="true" /> Salon Timings</p>
              {settings.hours?.length ? (
                settings.hours.map((h) => <p key={h.days} className="pl-[34px] text-[0.9375rem] text-ivory">{h.days}: <strong className="font-semibold text-gold-light">{h.time}</strong></p>)
              ) : (
                <p className="pl-[34px] text-[0.9375rem] text-ivory">{settings.hoursNote}</p>
              )}
              <p className="mt-0.5 pl-[34px] text-[0.8125rem] text-mist">{VISIT.hoursNote}</p>
            </div>
            <div className="border-b border-gold/20 pb-6">
              <p className={`mb-2 flex items-center gap-3 text-gold-light ${ACTION}`}><Phone className="h-[22px] w-[22px]" aria-hidden="true" /> Direct Call &amp; WhatsApp</p>
              <a href={telHref(settings)} className="pl-[34px] font-serif text-2xl font-semibold text-gold-light hover:underline">{phone}</a>
              <p className="mt-0.5 pl-[34px] text-[0.8125rem] text-mist">{VISIT.phoneNote}</p>
            </div>
            <a href={whatsappHref(settings, VISIT.conciergeMessage)} {...EXTERNAL} className={`${BTN_SAGE} w-full py-4 shadow-lg`}>
              <WhatsAppIcon className="h-5 w-5" /> {VISIT.conciergeCta}
            </a>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-7" data-reveal>
            <div className="relative h-72 overflow-hidden border border-gold/25 bg-night-mid shadow-xl">
              {/* Stylised map backdrop: a faint street grid, no third-party map embed */}
              <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgb(201_164_92/0.12)_1px,transparent_1px),linear-gradient(90deg,rgb(201_164_92/0.12)_1px,transparent_1px),linear-gradient(35deg,transparent_48%,rgb(165_207_193/0.18)_49%,rgb(165_207_193/0.18)_51%,transparent_52%)] [background-size:44px_44px,44px_44px,100%_100%]" aria-hidden="true" />
              <div className="absolute inset-0 flex items-center justify-center bg-night/60 p-4">
                <div className="flex flex-col items-center border border-gold/60 bg-night-high/95 p-4 text-center shadow-2xl">
                  <MapPin className="mb-1 h-8 w-8 text-gold-light" aria-hidden="true" />
                  <span className={`${ACTION} !tracking-wider text-ivory`}>{settings.storeName}</span>
                  <span className="text-[0.6875rem] uppercase tracking-[0.22em] text-gold-light">{[line1, line2, settings.address.city].filter(Boolean).join(', ')}</span>
                  <a href={mapsDirectionsHref(settings)} {...EXTERNAL} className="mt-3 inline-flex min-h-11 items-center bg-gold-light px-4 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ivory">
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>
            <AppointmentForm />
          </div>
        </div>
      </div>
    </section>
  )
}
