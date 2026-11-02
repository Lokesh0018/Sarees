import { useEffect } from 'react'
import { useStore } from '../context/StoreContext'
import { useScrolled } from '../hooks/useMedia'
import { generalEnquiryMessage, whatsappHref } from '../utils/contact'
import { ScrollTrigger } from '../utils/motion'
import WhatsAppIcon from '../components/WhatsAppIcon'
import Header from './Header'
import Footer from './Footer'

export default function SiteLayout({ children }) {
  const { settings } = useStore()
  // On phones the hero's own WhatsApp button sits where this one would, so it waits for a scroll there.
  const showFloat = useScrolled(320)

  // Recalculate reveal positions once late-loading content has settled.
  useEffect(() => {
    const refresh = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => clearTimeout(refresh)
  }, [])

  return (
    <>
      <a href="#main" className="sr-only z-[60] bg-gold px-4 py-2 text-emerald-deep focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <a
        href={whatsappHref(settings, generalEnquiryMessage(settings))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with the boutique on WhatsApp"
        className={`fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-40 flex h-[54px] w-[54px] cursor-pointer items-center justify-center rounded-full border border-gold/60 bg-emerald-deep text-gold-light shadow-[0_12px_30px_-12px_rgb(0_0_0/0.6)] transition-[transform,opacity,visibility,border-color] duration-300 hover:scale-105 hover:border-gold-light sm:bottom-8 sm:right-8 sm:h-[60px] sm:w-[60px] ${showFloat ? 'visible opacity-100' : 'max-sm:invisible max-sm:translate-y-4 max-sm:opacity-0'}`}
      >
        <WhatsAppIcon className="h-6 w-6 sm:h-[26px] sm:w-[26px]" />
      </a>
    </>
  )
}
