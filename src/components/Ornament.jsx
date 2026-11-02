// Thin gold divider with a central lozenge, used under section headings.
export default function Ornament({ className = '', tone = 'text-gold' }) {
  return (
    <div className={`flex items-center gap-3 ${tone} ${className}`} aria-hidden="true">
      <span className="h-px w-10 bg-current opacity-60" />
      <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 0l3 7-3 7-3-7z" fill="currentColor" /></svg>
      <span className="h-px w-10 bg-current opacity-60" />
    </div>
  )
}

export function SectionHeading({ eyebrow, title, children, align = 'center', dark = false, className = '' }) {
  const centered = align === 'center'
  return (
    <div className={`${centered ? 'mx-auto text-center' : ''} max-w-2xl ${className}`} data-reveal>
      {eyebrow && <p className={`eyebrow ${dark ? 'text-gold' : 'text-maroon'}`}>{eyebrow}</p>}
      <h2 className={`mt-4 text-4xl leading-[1.05] sm:text-5xl ${dark ? 'text-ivory' : 'text-emerald'}`}>{title}</h2>
      <Ornament className={`mt-6 ${centered ? 'justify-center' : ''}`} />
      {children && <div className={`mt-6 text-[1.02rem] leading-relaxed ${dark ? 'text-ivory/75' : 'text-charcoal/75'}`}>{children}</div>}
    </div>
  )
}
