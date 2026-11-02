import { useEffect } from 'react'
import { useStore } from '../context/StoreContext'
import { generalEnquiryMessage, whatsappHref } from '../utils/contact'
import { ScrollTrigger } from '../utils/motion'
import WhatsAppIcon from '../components/WhatsAppIcon'
import Header from './Header'
import Footer from './Footer'

export default function SiteLayout({ children }) {
  const { settings } = useStore()

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
        className="fixed bottom-5 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 bg-emerald text-gold shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:scale-105 sm:bottom-8 sm:right-8"
      >
        <WhatsAppIcon className="h-6 w-6" />
      </a>
    </>
  )
}
