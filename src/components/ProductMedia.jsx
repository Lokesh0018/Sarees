import TextileArt from './TextileArt'

export function sortedImages(product) {
  return [...(product.images || [])].sort(
    (a, b) => Number(b.isPrimary) - Number(a.isPrimary) || (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
  )
}

// Renders a product/category image at a fixed ratio, or textile art when none exists.
export default function ProductMedia({ image, art, seed, alt, eager = false, className = '', sizes = '(min-width: 1024px) 25vw, 50vw' }) {
  if (image?.url) {
    return (
      <img
        src={image.url}
        srcSet={image.srcSet}
        sizes={image.srcSet ? sizes : undefined}
        alt={image.alt || alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : undefined}
        width={image.width || 900}
        height={image.height || 1200}
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }
  return <TextileArt base={art?.base} motif={art?.motif} seed={seed} label={alt} className={`h-full w-full ${className}`} />
}
