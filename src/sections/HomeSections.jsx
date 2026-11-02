import { useMemo, useRef, useState } from 'react'
import { ArrowRight, BadgeCheck, BookOpen, Brush, CalendarCheck, Clock, MapPin, Palette, Phone, Ruler, UserCheck } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { useAsync } from '../hooks/useAsync'
import { useReveal } from '../utils/motion'
import { getNewArrivals } from '../services/catalog'
import { addressLines, formatPhone, generalEnquiryMessage, mapsDirectionsHref, productEnquiryMessage, telHref, whatsappHref } from '../utils/contact'
import WhatsAppIcon from '../components/WhatsAppIcon'
import { ARRIVALS, COLLECTIONS, CRAFT, FEATURED, GALLERY, INTRO, STORY, VISIT } from '../content/home'

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

function CollectionCard({ category, index }) {
  const { settings } = useStore()
  const card = COLLECTIONS.cards[category.slug] || { label: `Category ${String(index + 1).padStart(2, '0')}`, title: category.name, body: category.description, cta: 'Enquire' }
  const layout = BENTO[index] || BENTO[BENTO.length - 1]
  return (
    <a
      href={whatsappHref(settings, generalEnquiryMessage(settings, { topic: card.title }))}
      {...EXTERNAL}
      className={`group relative flex flex-col justify-end overflow-hidden border border-gold/20 bg-night-low p-6 transition-colors duration-500 hover:border-gold sm:p-8 ${layout.span} ${layout.height}`}
    >
      {category.image && (
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
          <Photo src={category.image} alt="" />
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
        {image ? <Photo src={image.url} alt={image.alt || product.name} position={product.imagePosition} /> : <div className="h-full w-full bg-night-high" />}
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
