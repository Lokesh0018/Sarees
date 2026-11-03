import { useEffect, useRef, useState } from 'react'
import { Phone } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { useScrolled } from '../hooks/useMedia'
import { formatPhone, generalEnquiryMessage, telHref, whatsappHref } from '../utils/contact'
import { gsap } from '../utils/motion'
import Logo from '../components/Logo'
import WhatsAppIcon from '../components/WhatsAppIcon'

// In-page sections of the single home page.
const SECTION_LINKS = [
  { href: '#collections', label: 'Collections' },
  { href: '#craft', label: 'Our Craft' },
  { href: '#about', label: 'About' },
  { href: '#visit', label: 'Visit Us' },
]

// Which section the visitor is reading: the last one whose top has passed 40% of the viewport.
function useActiveSection() {
  const [active, setActive] = useState(null)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.4
      let current = null
      for (const { href } of SECTION_LINKS) {
        const el = document.querySelector(href)
        if (el && el.getBoundingClientRect().top <= line) current = href
      }
      // Past the end of the page the last section counts, even if it is short.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = SECTION_LINKS.at(-1).href
      setActive(current)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])
  return active
}

function MenuIcon({ open }) {
  const bar = 'absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-300 ease-[var(--ease-silk)]'
  return (
    <span className="relative block h-3 w-6" aria-hidden="true">
      <span className={`${bar} top-0 ${open ? 'translate-y-[5.25px] rotate-45' : ''}`} />
      <span className={`${bar} bottom-0 ${open ? '-translate-y-[5.25px] -rotate-45' : 'origin-right scale-x-75'}`} />
    </span>
  )
}

export default function Header() {
  const { settings } = useStore()
  const scrolled = useScrolled(40)
  const active = useActiveSection()
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const toggleRef = useRef(null)
  const enquiry = whatsappHref(settings, generalEnquiryMessage(settings))

  useEffect(() => {
    if (!open) return
    // While the menu is open, the page behind it is out of reach for keyboard and screen readers.
    const behind = document.querySelectorAll('a[href="#main"], #main, footer, [data-float-whatsapp]')
    behind.forEach((el) => { el.inert = true })
    document.body.style.overflow = 'hidden'
    // Wait a frame so the panel has left visibility:hidden, otherwise focus() is ignored.
    const focusFrame = requestAnimationFrame(() => panelRef.current?.querySelector('a')?.focus({ preventScroll: true }))

    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus() }
    }
    window.addEventListener('keydown', onKey)
    const close = () => window.innerWidth >= 1024 && setOpen(false)
    window.addEventListener('resize', close)

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.from(panelRef.current.querySelectorAll('[data-menu-item]'), { y: 20, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out', delay: 0.05 })
    }
    return () => {
      cancelAnimationFrame(focusFrame)
      behind.forEach((el) => { el.inert = false })
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', close)
    }
  }, [open])

  const solid = scrolled || open

  return (
    <>
    <header data-site-header className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500 ${solid ? 'border-gold/15 bg-ink/95 backdrop-blur-md' : 'border-transparent bg-transparent'}`}>
      {/* Three columns on desktop so the links sit on the true centre, whatever the logo and button widths */}
      <div className="container-wide flex h-20 items-center justify-between gap-6 lg:grid lg:h-[88px] lg:grid-cols-[1fr_auto_1fr]">
        <Logo settings={settings} className="justify-self-start" />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-3">
            {SECTION_LINKS.map(({ href, label }) => {
              const current = active === href
              return (
                <li key={href}>
                  <a
                    href={href}
                    aria-current={current ? 'location' : undefined}
                    className="group relative flex h-11 cursor-pointer items-center px-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.14em] xl:px-4"
                  >
                    <span className={`transition-colors duration-300 ${current ? 'text-gold-light' : 'text-ivory/85 group-hover:text-ivory'}`}>{label}</span>
                    <span
                      className={`absolute inset-x-3.5 bottom-1.5 h-px origin-center bg-gold-light transition-transform duration-300 ease-[var(--ease-silk)] xl:inset-x-4 ${current ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1 justify-self-end">
          <a
            href={enquiry}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Enquire on WhatsApp"
            className="hidden h-11 cursor-pointer items-center gap-2.5 border border-gold/55 px-5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-gold-light transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-ink sm:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" /> <span className="hidden lg:inline">Enquire</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2.5 inline-flex h-11 w-11 cursor-pointer items-center justify-center text-ivory transition-colors duration-300 hover:text-gold-light lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>
    </header>

      {/* Sibling of <header>: its backdrop-filter would otherwise trap this fixed panel */}
      <div
        id="mobile-menu"
        ref={panelRef}
        aria-hidden={!open}
        // Visible at once when opening (so focus can land), hidden only after the fade when closing
        className={`fixed inset-x-0 bottom-0 top-20 z-[49] overflow-y-auto bg-ink duration-500 lg:hidden ${open ? 'visible opacity-100 transition-opacity' : 'invisible opacity-0 transition-[opacity,visibility]'}`}
      >
        <nav aria-label="Mobile" className="container-wide flex min-h-full flex-col pb-[max(2rem,env(safe-area-inset-bottom))] pt-6" onClick={(e) => e.target.closest('a') && setOpen(false)}>
          <ul>
            {SECTION_LINKS.map(({ href, label }, i) => {
              const current = active === href
              return (
                <li key={href} data-menu-item>
                  <a
                    href={href}
                    aria-current={current ? 'location' : undefined}
                    className="group flex items-baseline gap-5 border-b border-ivory/10 py-5"
                  >
                    <span className="w-6 font-sans text-[0.7rem] font-semibold tracking-[0.14em] text-gold/70">{String(i + 1).padStart(2, '0')}</span>
                    <span className={`font-serif text-[2rem] leading-none transition-colors duration-300 ${current ? 'italic text-gold-light' : 'text-ivory group-hover:text-gold-light'}`}>{label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
          <div className="mt-auto grid gap-3 pt-10" data-menu-item>
            <a href={enquiry} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[54px] items-center justify-center gap-3 bg-gold px-6 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:bg-gold-light">
              <WhatsAppIcon className="h-4 w-4" /> Enquire on WhatsApp
            </a>
            <a href={telHref(settings)} className="inline-flex min-h-[54px] items-center justify-center gap-3 border border-gold/60 px-6 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-ivory transition-colors duration-300 hover:border-gold-light hover:bg-emerald-deep/70">
              <Phone className="h-4 w-4 text-gold-light" aria-hidden="true" /> Call {formatPhone(settings.phone)}
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}
