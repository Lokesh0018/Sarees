import { useStore } from '../context/StoreContext'
import { AVAILABILITY } from '../config/site'
import { formatPrice, productEnquiryMessage, whatsappHref } from '../utils/contact'
import ProductMedia, { sortedImages } from './ProductMedia'
import WhatsAppIcon from './WhatsAppIcon'

export function AvailabilityBadge({ status, className = '' }) {
  const info = AVAILABILITY[status] || AVAILABILITY.on_request
  const dot = { emerald: 'bg-emerald-soft', gold: 'bg-gold', muted: 'bg-charcoal/30' }[info.tone]
  return (
    <span className={`inline-flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-charcoal/70 ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {info.label}
    </span>
  )
}

export default function ProductCard({ product, eager = false }) {
  const { settings, categoryBySlug } = useStore()
  const category = categoryBySlug[product.categorySlug]
  const [primary, secondary] = sortedImages(product)
  const price = formatPrice(product.price)

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-ivory-dark">
        <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.045]">
          <ProductMedia image={primary} art={product.art || category?.art} seed={product.productCode} alt={product.name} eager={eager} />
        </div>
        {secondary && (
          <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
            <ProductMedia image={secondary} alt={product.name} />
          </div>
        )}
        <span className="pointer-events-none absolute inset-3 border border-gold/0 transition-colors duration-700 group-hover:border-gold/60" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.isNewArrival && <span className="bg-ivory/95 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-maroon">New</span>}
          {product.sample && <span className="bg-charcoal/70 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-ivory">Sample</span>}
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-maroon">{category?.name}</p>
        <h3 className="mt-1.5 font-serif text-[1.35rem] leading-tight text-emerald">{product.name}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.78rem] text-charcoal/60">
          <span>Code {product.productCode}</span>
          {price && <span className="font-medium text-charcoal">{price}</span>}
        </div>
        <AvailabilityBadge status={product.availability} className="mt-2" />
        <div className="mt-auto grid pt-4">
          <a
            href={whatsappHref(settings, productEnquiryMessage(settings, product, category?.name))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-1.5 bg-emerald text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-emerald-soft"
            aria-label={`Enquire about ${product.name} on WhatsApp`}
          >
            <WhatsAppIcon className="h-4 w-4" /> Enquire
          </a>
        </div>
      </div>
    </article>
  )
}

export function ProductGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <div className="skeleton aspect-[3/4]" />
          <div className="skeleton mt-4 h-3 w-1/3" />
          <div className="skeleton mt-3 h-5 w-3/4" />
          <div className="skeleton mt-3 h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}
