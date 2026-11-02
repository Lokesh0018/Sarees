import { useEffect, useRef, useState } from 'react'
import { Menu, Phone, X } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { useScrolled } from '../hooks/useMedia'
import { generalEnquiryMessage, telHref, whatsappHref } from '../utils/contact'
import { gsap } from '../utils/motion'
import Logo from '../components/Logo'
import WhatsAppIcon from '../components/WhatsAppIcon'

// In-page sections of the single home page.
export const SECTION_LINKS = [
  { href: '#collections', label: 'Collections' },
  { href: '#craft', label: 'Our Craft' },
  { href: '#about', label: 'About' },
  { href: '#visit', label: 'Visit Us' },
]

export default function Header() {
  const { settings } = useStore()
  const scrolled = useScrolled(40)
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const enquiry = whatsappHref(settings, generalEnquiryMessage(settings))

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    if (open && panelRef.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.from(panelRef.current.querySelectorAll('[data-menu-item]'), { y: 24, opacity: 0, duration: 0.7, stagger: 0.05, ease: 'power3.out', delay: 0.1 })
    }
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [open])

  const solid = scrolled || open

  return (
    <>
    <header data-site-header className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500 ${solid ? 'border-gold/15 bg-ink/75 backdrop-blur-md' : 'border-transparent bg-transparent'}`}>
      <div className="container-wide flex h-20 items-center justify-between gap-6 lg:h-[88px]">
        <Logo settings={settings} />

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex xl:gap-10">
          {SECTION_LINKS.map(({ href, label }) => (
            <a key={href} href={href} className="group relative py-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em]">
              <span className="text-ivory/90 transition-colors duration-300 group-hover:text-gold-light">{label}</span>
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold-light transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={enquiry} target="_blank" rel="noopener noreferrer" className="hidden h-11 cursor-pointer items-center gap-2.5 border border-gold/55 px-5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-gold-light transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-ink sm:inline-flex" aria-label="Enquire on WhatsApp">
            <WhatsAppIcon className="h-4 w-4" /> <span className="hidden lg:inline">Enquire</span>
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center text-ivory lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>

      {/* Sibling of <header>: its backdrop-filter would otherwise trap this fixed panel */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className={`fixed inset-x-0 bottom-0 top-20 z-[49] overflow-y-auto bg-emerald-deep transition-[opacity,visibility] duration-500 lg:hidden ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
      >
        <nav aria-label="Mobile" className="container-x flex min-h-full flex-col py-8" onClick={(e) => e.target.closest('a') && setOpen(false)}>
          {SECTION_LINKS.map(({ href, label }) => (
            <div key={href} data-menu-item>
              <a href={href} className="block border-b border-ivory/10 py-4 font-serif text-3xl text-ivory">{label}</a>
            </div>
          ))}
          <div className="mt-auto grid gap-3 pt-10" data-menu-item>
            <a href={enquiry} target="_blank" rel="noopener noreferrer" className="btn-gold w-full"><WhatsAppIcon className="h-4 w-4" /> Enquire on WhatsApp</a>
            <a href={telHref(settings)} className="btn-outline-light w-full"><Phone className="h-4 w-4" /> Call {settings.phone}</a>
          </div>
        </nav>
      </div>
    </>
  )
}
