export const LOGO = { src: '/brand/sjr-logo-sm.webp', width: 360, height: 230 }
export const LOGO_LARGE = { src: '/brand/sjr-logo.webp', width: 720, height: 460 }

// Text fallback, used only if no logo image is configured.
export function Monogram({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="1" y="1" width="62" height="62" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="5" y="5" width="54" height="54" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <text x="32" y="40" textAnchor="middle" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="21" fontWeight="500" letterSpacing="2" fill="currentColor">SJR</text>
    </svg>
  )
}

export default function Logo({ className = '', settings }) {
  const src = settings?.logo ?? LOGO.src
  return (
    <a href="#top" className={`group flex items-center gap-4 ${className}`} aria-label={`${settings?.storeName || 'SJR – House of Collection'} — home`}>
      {src ? (
        <img
          src={src}
          alt=""
          width={LOGO.width}
          height={LOGO.height}
          className="h-[52px] w-auto transition-transform duration-500 group-hover:scale-[1.03] lg:h-[60px]"
        />
      ) : (
        <Monogram className="h-11 w-11 text-gold" />
      )}
      <span className="hidden border-l border-gold/35 py-1 pl-4 text-[0.6rem] font-semibold uppercase leading-[1.7] tracking-[0.34em] text-gold-light min-[400px]:block">
        House of<br />Collection
      </span>
    </a>
  )
}
