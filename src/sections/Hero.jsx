import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { useReducedMotion } from '../hooks/useMedia'
import { gsap } from '../utils/motion'
import { generalEnquiryMessage, whatsappHref } from '../utils/contact'
import { LOGO_LARGE } from '../components/Logo'
import WhatsAppIcon from '../components/WhatsAppIcon'

const OFFERINGS = ['Sarees', 'Blouse Stitching', 'Matchings', 'Fancy Jewellery']

// Background film. The files are pre-rendered as a boomerang (forward then
// reversed), so a plain native loop plays front-to-back-to-front seamlessly.
// The poster sits underneath, so a slow or failed video never leaves a gap.
function HeroBackdrop({ hero, reduced, inView }) {
  const [failed, setFailed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef(null)
  // Reduced-motion visitors get the still poster and never download the film.
  const hasVideo = !failed && !reduced && (hero.videoWebm || hero.videoMp4)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true

    if (reduced) {
      video.pause()
      return
    }

    // Try to ensure playback begins cleanly and recovers if paused
    const attemptPlay = () => {
      const promise = video.play()
      if (promise !== undefined) {
        promise.catch(() => {
          // Fallback if browser requires muted guarantee
          video.muted = true
          video.play().catch(() => {})
        })
      }
    }

    // Play only while the hero is on screen and the tab is visible; pause otherwise to save CPU, GPU and battery
    const sync = () => (inView && !document.hidden ? attemptPlay() : video.pause())
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [reduced, inView, hasVideo])

  return (
    <div className="absolute inset-0 -z-10 bg-emerald-deep" aria-hidden="true">
      {hero.poster && <img src={hero.poster} alt="" className="absolute inset-0 h-full w-full object-cover object-center" fetchPriority="high" />}
      {hasVideo && (
        <video
          key={hero.videoWebm || hero.videoMp4}
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${playing ? 'opacity-100' : 'opacity-0'}`}
          autoPlay={!reduced}
          muted
          defaultMuted
          loop
          playsInline
          webkit-playsinline="true"
          preload="auto"
          disablePictureInPicture
          poster={hero.poster || undefined}
          onPlaying={() => setPlaying(true)}
          onPause={() => {
            // Auto-resume if paused unexpectedly while in view (not when the tab is hidden or the hero has scrolled away)
            if (!reduced && inView && !document.hidden && videoRef.current) {
              videoRef.current.play().catch(() => {})
            }
          }}
          // Skipped <source>s (e.g. the mobile file on desktop) also fire "error" here;
          // only a real media error on the video itself means playback has failed.
          onError={(e) => e.currentTarget.error && setFailed(true)}
        >
          {hero.videoWebmMobile && <source src={hero.videoWebmMobile} type="video/webm" media="(max-width: 767px)" />}
          {hero.videoWebm && <source src={hero.videoWebm} type="video/webm" />}
          {hero.videoMp4 && <source src={hero.videoMp4} type="video/mp4" onError={() => setFailed(true)} />}
        </video>
      )}
    </div>
  )
}

export default function Hero() {
  const { settings } = useStore()
  const { hero } = settings
  const reduced = useReducedMotion()
  const rootRef = useRef(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.01 })
    io.observe(rootRef.current)
    return () => io.disconnect()
  }, [])

  // One coordinated entrance; the video plays independently of it.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const header = document.querySelector('[data-site-header]')
        const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } })
        if (header) tl.from(header, { opacity: 0, duration: 0.8 }, 0.2)
        tl.from('[data-mono]', { opacity: 0, y: 14, duration: 1 }, 0.4)
          .fromTo('[data-shine]', { backgroundPosition: '-150% 0' }, { backgroundPosition: '250% 0', duration: 1.8, ease: 'power2.inOut' }, 0.9)
          .from('[data-eyebrow]', { opacity: 0, y: 10, duration: 0.8 }, 0.6)
          .from('[data-line="1"]', { yPercent: 105, duration: 1.1 }, 0.8)
          .from('[data-line="2"]', { yPercent: 105, duration: 1.1 }, 1.0)
          .from('[data-hero-desc]', { opacity: 0, y: 14 }, 1.2)
          .from('[data-hero-cta]', { opacity: 0, y: 14 }, 1.4)
          .from('[data-hero-strip]', { opacity: 0, y: 8 }, 1.6)
        gsap.to('[data-hero-content]', {
          yPercent: -8, opacity: 0.25, ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // Two editorial lines: "Elegance Woven" / "Into Every Moment."
  const words = (hero.heading || '').split(' ').filter(Boolean)
  const split = Math.max(1, Math.floor(words.length / 2))
  const lines = [words.slice(0, split).join(' '), words.slice(split).join(' ')]
  const location = [settings.address?.line2, settings.address?.city].filter(Boolean).join(' · ')

  return (
    <section id="top" ref={rootRef} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-emerald-deep text-ivory" aria-labelledby="hero-title">
      <HeroBackdrop hero={hero} reduced={reduced} inView={inView} />

      {/* Cinematic shading in layers: darker only where text sits, the model's side keeps its own light */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgb(14_18_13/0.85)_0%,rgb(14_18_13/0.78)_25%,rgb(14_18_13/0.4)_45%,rgb(14_18_13/0.06)_65%,transparent_100%)] lg:block" />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-ink/65 via-ink/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 hidden h-[38%] bg-gradient-to-t from-ink/70 via-ink/25 to-transparent lg:block" />
        <div className="absolute inset-x-0 bottom-0 h-[80%] bg-[linear-gradient(to_top,rgb(14_18_13/0.94)_0%,rgb(14_18_13/0.82)_35%,rgb(14_18_13/0.4)_65%,transparent_100%)] lg:hidden" />
      </div>
      <div className="pointer-events-none absolute inset-3 border border-gold/20 sm:inset-5" aria-hidden="true" />

      <div
        data-hero-content
        className="container-wide relative flex flex-1 flex-col pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-[max(6.5rem,14vh)] lg:pb-[clamp(1.75rem,5vh,3.25rem)] lg:pt-[max(7.5rem,15vh)]"
      >
        {/* Text column stops near 46% of the width, so the model (centre to right of the film) stays clear */}
        <div className="mt-auto max-w-[38rem] [text-shadow:0_1px_14px_rgb(14_18_13/0.35)] lg:my-auto lg:max-w-[min(42vw,700px)]">
          <div data-mono className="relative inline-block">
            <img
              src={LOGO_LARGE.src}
              alt=""
              width={LOGO_LARGE.width}
              height={LOGO_LARGE.height}
              fetchPriority="high"
              className="h-[clamp(2.75rem,8vh,5.75rem)] w-auto"
            />
            {/* A single sweep of light across the gold, masked to the logo's shape */}
            <span
              data-shine
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 mix-blend-overlay"
              style={{
                backgroundImage: 'linear-gradient(110deg, transparent 35%, rgba(255,250,230,0.95) 50%, transparent 65%)',
                backgroundSize: '200% 100%',
                backgroundPosition: '-150% 0',
                backgroundRepeat: 'no-repeat',
                WebkitMaskImage: `url(${LOGO_LARGE.src})`,
                maskImage: `url(${LOGO_LARGE.src})`,
                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
              }}
            />
          </div>

          <p data-eyebrow className="mt-[clamp(1rem,3vh,2rem)] flex items-center gap-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gold-light">
            <span className="h-px w-10 shrink-0 bg-gold/70" aria-hidden="true" />
            {location || hero.eyebrow}
          </p>

          <h1
            id="hero-title"
            className="mt-[clamp(0.75rem,2vh,1.25rem)] max-w-[700px] text-[clamp(2.625rem,12vw,3.375rem)] font-normal leading-[1.02] md:text-[clamp(3.25rem,7.5vw,4.5rem)] lg:text-[clamp(3.375rem,min(5.2vw,9.6vh),4.75rem)]"
          >
            {lines.map((line, i) => (
              // Each line slides up inside its own mask; the padding keeps descenders (g, y) unclipped.
              <span key={i} className="-mx-[0.08em] -mb-[0.16em] block overflow-hidden px-[0.08em] pb-[0.16em] text-balance">
                <span data-line={i + 1} className={`block ${i === 1 ? 'italic text-gold-light/95' : ''}`}>{line}</span>
              </span>
            ))}
          </h1>

          <p data-hero-desc className="mt-6 max-w-[560px] text-pretty text-[0.95rem] leading-[1.7] text-ivory/80 sm:mt-7 sm:text-[1.0625rem]">
            {hero.description}
          </p>

          <div data-hero-cta className="mt-[clamp(1.5rem,4vh,2.5rem)] flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href={hero.primaryCta?.to || '#collections'}
              className="group inline-flex min-h-[54px] cursor-pointer items-center justify-center gap-3 border border-gold-light/50 bg-gold px-[30px] text-[0.74rem] font-bold uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:bg-gold-light"
            >
              {hero.primaryCta?.label || 'Explore Collections'}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href={whatsappHref(settings, generalEnquiryMessage(settings))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[54px] cursor-pointer items-center justify-center gap-3 border border-gold/60 px-[30px] text-[0.74rem] font-bold uppercase tracking-[0.14em] text-ivory transition-colors duration-300 hover:border-gold-light hover:bg-emerald-deep/70"
            >
              <WhatsAppIcon className="h-4 w-4 text-gold-light" /> Enquire on WhatsApp
            </a>
          </div>
        </div>

        <ul
          data-hero-strip
          aria-label="What we offer"
          className="mt-[clamp(1.75rem,5vh,3.5rem)] flex flex-wrap items-center gap-x-[18px] gap-y-2 text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-ivory/90 [@media(max-height:600px)]:hidden"
        >
          {OFFERINGS.map((item, i) => (
            // A diamond leads each item, so wrapped lines on phones never start with a stray separator;
            // from sm up the first one hides and the rest read as separators.
            <li key={item} className="flex items-center gap-2.5 sm:gap-[18px]">
              <span className={`h-[5px] w-[5px] shrink-0 rotate-45 bg-gold ${i === 0 ? 'sm:hidden' : ''}`} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
