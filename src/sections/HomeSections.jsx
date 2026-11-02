import { useRef } from 'react'
import { ArrowRight, MapPin, Phone, Ruler, Palette, Scissors, Sparkles } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { useAsync } from '../hooks/useAsync'
import { useReveal } from '../utils/motion'
import { getFeatured, getNewArrivals } from '../services/catalog'
import { addressLines, formatPhone, generalEnquiryMessage, mapsDirectionsHref, telHref, whatsappHref } from '../utils/contact'
import { SectionHeading } from '../components/Ornament'
import ProductCard, { ProductGridSkeleton } from '../components/ProductCard'
import ProductMedia from '../components/ProductMedia'
import TextileArt from '../components/TextileArt'
import WhatsAppIcon from '../components/WhatsAppIcon'

export function CategoryTile({ category, index, large = false }) {
  const { settings } = useStore()
  return (
    <a
      href={whatsappHref(settings, generalEnquiryMessage(settings, { topic: category.name }))}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block overflow-hidden bg-emerald ${large ? 'aspect-[4/5] sm:aspect-[16/11] lg:aspect-auto lg:h-full' : 'aspect-[4/5]'}`}
    >
      <div className="absolute inset-0 transition-transform duration-[1.6s] ease-[var(--ease-silk)] group-hover:scale-[1.06]">
        <ProductMedia
          image={category.image ? { url: category.image, alt: `${category.name} at SJR – House of Collection` } : null}
          art={category.art}
          seed={category.slug}
          alt=""
          sizes={large ? '(min-width: 1024px) 40vw, 100vw' : '(min-width: 1024px) 20vw, 50vw'}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/95 via-emerald-deep/30 to-transparent transition-opacity duration-700 group-hover:opacity-90" />
      <span className="pointer-events-none absolute inset-3 border border-gold/25 transition-all duration-700 group-hover:inset-4 group-hover:border-gold/70" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-ivory sm:p-7">
        <span className="font-serif text-sm italic text-gold">{String(index + 1).padStart(2, '0')}</span>
        <h3 className={`mt-1 leading-none ${large ? 'text-4xl sm:text-5xl' : 'text-[1.6rem] sm:text-3xl'}`}>{category.name}</h3>
        <p className={`mt-3 max-w-xs text-sm leading-relaxed text-ivory/75 ${large ? '' : 'hidden sm:block'}`}>{category.description}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-gold">
          Enquire <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5" />
        </span>
      </div>
    </a>
  )
}

export function FeaturedCollections() {
  const { settings, categories, status } = useStore()
  const ref = useRef(null)
  useReveal(ref, [categories.length])

  return (
    <section id="collections" ref={ref} className="bg-ivory py-24 sm:py-32" aria-labelledby="collections-title">
      <div className="container-x">
        <SectionHeading eyebrow="The Collections" title={<span id="collections-title">Curated for every drape &amp; occasion</span>}>
          Sarees, stitching, matchings and the finishing touches — all chosen with care at our MVP Colony boutique.
        </SectionHeading>
        {status === 'loading' ? (
          <div className="mt-16 grid grid-cols-2 gap-3 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton aspect-[4/5]" />)}</div>
        ) : (
          <div className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" data-reveal-stagger>
            {categories.map((c, i) => (
              <div key={c.slug} className={i === 0 ? 'col-span-2 lg:col-span-2 lg:row-span-2' : ''}>
                <CategoryTile category={c} index={i} large={i === 0} />
              </div>
            ))}
            <a href={whatsappHref(settings, generalEnquiryMessage(settings))} target="_blank" rel="noopener noreferrer" className="group col-span-2 flex min-h-48 flex-col items-center justify-center border border-emerald/20 p-6 text-center transition-colors hover:border-gold hover:bg-emerald hover:text-ivory">
              <span className="font-serif text-3xl text-emerald transition-colors group-hover:text-ivory">Looking for something else?</span>
              <span className="mt-4 inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-maroon group-hover:text-gold">
                <WhatsAppIcon className="h-3.5 w-3.5" /> Ask us on WhatsApp
              </span>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

export function ProductShowcase({ kind }) {
  const isNew = kind === 'new'
  const { data, loading, error } = useAsync(() => (isNew ? getNewArrivals(8) : getFeatured(8)), [kind])
  const ref = useRef(null)
  useReveal(ref, [data?.length])
  if (!loading && (error || !data?.length)) return null

  return (
    <section id={isNew ? 'new-arrivals' : 'featured'} ref={ref} className={isNew ? 'bg-ivory-dark/60 py-24 sm:py-32' : 'bg-ivory py-24 sm:py-32'} aria-label={isNew ? 'New arrivals' : 'Featured products'}>
      <div className="container-x">
        <SectionHeading align="left" eyebrow={isNew ? 'Just In' : 'Boutique Favourites'} title={isNew ? 'New Arrivals' : 'Featured Pieces'}>
          {isNew ? 'The latest additions to our shelves — enquire early, as pieces move quickly.' : 'Pieces our boutique is proud to recommend this season.'}
        </SectionHeading>
        <div className="mt-14">
          {loading ? <ProductGridSkeleton /> : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4" data-reveal-stagger>
              {data.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export const CRAFT_SERVICES = [
  { icon: Scissors, title: 'Custom Blouse Stitching', body: 'Blouses stitched to your measurements and the design you have in mind.' },
  { icon: Ruler, title: 'Tailoring', body: 'Fitting and finishing for your ethnic wear, handled with care.' },
  { icon: Palette, title: 'Matching Selections', body: 'Blouse fabrics, petticoats and accents matched to your saree.' },
  { icon: Sparkles, title: 'Fabric & Styling Assistance', body: 'Talk to us about fabrics, colours and how to bring a look together.' },
]

export function CraftSection() {
  const { settings } = useStore()
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section id="craft" ref={ref} className="grain relative overflow-hidden bg-emerald py-24 text-ivory sm:py-32" aria-labelledby="craft-title">
      <div className="container-x relative grid items-center gap-16 lg:grid-cols-2">
        <div className="relative order-2 lg:order-1">
          <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden">
            <div data-parallax="0.18" className="absolute -inset-y-[12%] inset-x-0">
              <TextileArt base="#541D32" motif="stitch" seed="craft" className="h-full w-full" />
            </div>
            <span className="pointer-events-none absolute inset-4 border border-gold/50" />
          </div>
          <div className="absolute -bottom-6 right-0 hidden w-48 border border-gold/40 bg-emerald-deep p-6 sm:block lg:-right-6" data-reveal>
            <p className="font-serif text-2xl italic leading-snug text-gold">“{settings.tagline}”</p>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <SectionHeading align="left" dark eyebrow="Our Craft" title={<span id="craft-title">Finished by hand, fitted to you</span>}>
            Beyond the collection, our boutique helps you complete the look — from the blouse to the last matching detail.
          </SectionHeading>
          <ul className="mt-12 grid gap-px bg-gold/20 sm:grid-cols-2" data-reveal-stagger>
            {CRAFT_SERVICES.map(({ icon: Icon, title, body }) => (
              <li key={title} className="bg-emerald p-6">
                <Icon className="h-6 w-6 text-gold" strokeWidth={1.25} />
                <h3 className="mt-4 text-2xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/70">{body}</p>
              </li>
            ))}
          </ul>
          <a href={whatsappHref(settings, generalEnquiryMessage(settings, { topic: 'Blouse stitching' }))} target="_blank" rel="noopener noreferrer" className="btn-outline-light mt-10" data-reveal><WhatsAppIcon className="h-4 w-4" /> Ask about stitching</a>
        </div>
      </div>
    </section>
  )
}

export function AboutTeaser() {
  const ref = useRef(null)
  useReveal(ref)
  return (
    <section id="about" ref={ref} className="bg-ivory py-24 sm:py-32" aria-labelledby="about-title">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionHeading align="left" eyebrow="About SJR" title={<span id="about-title">Tradition, Elegance &amp; Your Personal Style.</span>}>
            <p>SJR – House of Collection is a boutique for women's ethnic fashion in MVP Colony, Visakhapatnam. We bring together sarees, stitching, matchings and fancy jewellery so every look can be chosen, fitted and finished in one place.</p>
          </SectionHeading>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:col-span-6">
          <div className="relative aspect-[3/4] overflow-hidden" data-reveal>
            <div data-parallax="0.12" className="absolute -inset-y-[10%] inset-x-0"><TextileArt base="#123C32" motif="buta" seed="about-a" className="h-full w-full" /></div>
          </div>
          <div className="relative mt-16 aspect-[3/4] overflow-hidden" data-reveal>
            <div data-parallax="0.2" className="absolute -inset-y-[10%] inset-x-0"><TextileArt base="#541D32" motif="diamond" seed="about-b" className="h-full w-full" /></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function PromoBanners() {
  const { settings } = useStore()
  const banners = (settings.banners || []).filter((b) => b.isActive !== false).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
  if (!banners.length) return null
  return (
    <section className="bg-ivory pb-24" aria-label="Promotions">
      <div className={`container-x grid gap-4 ${banners.length > 1 ? 'md:grid-cols-2' : ''}`}>
        {banners.map((b) => (
          <a key={b.title} href={b.ctaUrl || '#collections'} className="group relative block aspect-[16/9] overflow-hidden bg-emerald text-ivory">
            {b.mediaType === 'video'
              ? <video src={b.mediaUrl} muted loop autoPlay playsInline className="absolute inset-0 h-full w-full object-cover" />
              : b.mediaUrl && <img src={b.mediaUrl} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-105" />}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/90 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <h3 className="text-3xl sm:text-4xl">{b.title}</h3>
              {b.description && <p className="mt-2 max-w-md text-sm text-ivory/80">{b.description}</p>}
              {b.ctaText && <span className="mt-4 inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-gold">{b.ctaText} <ArrowRight className="h-3.5 w-3.5" /></span>}
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export function VisitSection() {
  const { settings } = useStore()
  const ref = useRef(null)
  useReveal(ref)
  return (
    <section id="visit" ref={ref} className="relative overflow-hidden bg-maroon-deep py-24 text-ivory sm:py-28" aria-labelledby="visit-title">
      <div className="absolute inset-0 opacity-15" aria-hidden="true"><TextileArt base="#3A1322" motif="jewel" seed="visit" className="h-full w-full" /></div>
      <div className="container-x relative grid gap-12 lg:grid-cols-2 lg:items-center">
        <SectionHeading align="left" dark eyebrow="Visit the Boutique" title={<span id="visit-title">Come see the collection in person</span>}>
          <address className="not-italic">
            {addressLines(settings.address).map((l) => <span key={l} className="block">{l}</span>)}
          </address>
          <p className="mt-4 text-sm text-ivory/60">{settings.hours?.length ? settings.hours.map((h) => `${h.days}: ${h.time}`).join(' · ') : settings.hoursNote}</p>
        </SectionHeading>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3" data-reveal-stagger>
          <a href={whatsappHref(settings, generalEnquiryMessage(settings))} target="_blank" rel="noopener noreferrer" className="btn-gold"><WhatsAppIcon className="h-4 w-4" /> WhatsApp</a>
          <a href={telHref(settings)} className="btn-outline-light"><Phone className="h-4 w-4" /> {formatPhone(settings.phone)}</a>
          <a href={mapsDirectionsHref(settings)} target="_blank" rel="noopener noreferrer" className="btn-outline-light"><MapPin className="h-4 w-4" /> Directions</a>
        </div>
      </div>
    </section>
  )
}
