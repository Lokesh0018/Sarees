import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { useReducedMotion } from '../hooks/useMedia'
import { gsap } from '../utils/motion'
import { LOGO_LARGE } from '../components/Logo'

// Background film. The files are pre-rendered as a boomerang (forward then
// reversed), so a plain native loop plays front-to-back-to-front seamlessly.
function HeroBackdrop({ hero, reduced, inView }) {
  const [failed, setFailed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef(null)
  // Reduced-motion visitors get the still poster and never download the film.
  const hasVideo = !failed && !reduced && (hero.videoWebm || hero.videoMp4)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (reduced || !inView) video.pause()
    else video.play().catch(() => {})
  }, [reduced, inView, hasVideo])

  return (
    <div className="absolute inset-0 bg-emerald-deep" aria-hidden="true">
      {hero.poster && <img src={hero.poster} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />}
      {hasVideo && (
        <video
          key={hero.videoWebm || hero.videoMp4}
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${playing ? 'opacity-100' : 'opacity-0'}`}
          autoPlay={!reduced}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          poster={hero.poster || undefined}
          onPlaying={() => setPlaying(true)}
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
  const hero = { ...settings.hero }
  const reduced = useReducedMotion()
  const rootRef = useRef(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.01 })
    io.observe(rootRef.current)
    return () => io.disconnect()
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.from('[data-mono]', { opacity: 0, y: 18, scale: 0.94, filter: 'blur(6px)', duration: 1.1, ease: 'power2.out' }, 0)
          .fromTo('[data-shine]', { backgroundPosition: '-150% 0' }, { backgroundPosition: '250% 0', duration: 1.8, ease: 'power2.inOut' }, 0.6)
          .from('[data-eyebrow]', { opacity: 0, letterSpacing: '0.6em', duration: 1 }, 0.35)
          .from('[data-word]', { yPercent: 115, duration: 1.1, stagger: 0.06, ease: 'power4.out' }, 0.45)
          .from('[data-hero-fade]', { opacity: 0, y: 24, duration: 0.9, stagger: 0.1 }, 0.95)
          .from('[data-scroll-cue]', { opacity: 0, duration: 1 }, 1.6)
        gsap.to('[data-hero-content]', {
          yPercent: -12, opacity: 0.2, ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const words = (hero.heading || '').split(' ')

  return (
    <section id="top" ref={rootRef} className="relative flex h-[100svh] min-h-[620px] items-end overflow-hidden bg-emerald-deep text-ivory sm:items-center" aria-labelledby="hero-title">
      <HeroBackdrop hero={hero} reduced={reduced} inView={inView} />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-deep/90 via-emerald-deep/55 to-emerald-deep/10" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-transparent to-emerald-deep/60" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-4 border border-gold/20 sm:inset-6" aria-hidden="true" />

      <div className="container-x relative pb-24 sm:pb-0" data-hero-content>
        <div className="max-w-3xl">
          <div data-mono className="relative inline-block">
            <img
              src={LOGO_LARGE.src}
              alt=""
              width={LOGO_LARGE.width}
              height={LOGO_LARGE.height}
              fetchPriority="high"
              className="h-20 w-auto drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:h-28 lg:h-32"
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
          <p data-eyebrow className="eyebrow mt-6 text-gold sm:mt-8">{hero.eyebrow}</p>
          <h1 id="hero-title" className="mt-5 text-[2.9rem] leading-[0.98] sm:text-7xl lg:text-[5.6rem]">
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span data-word className={`inline-block ${i >= words.length - 2 ? 'italic text-gold-light' : ''}`}>{w}&nbsp;</span>
              </span>
            ))}
          </h1>
          <p data-hero-fade className="mt-7 max-w-xl text-[1.02rem] leading-relaxed text-ivory/80 sm:text-lg">{hero.description}</p>
          <div data-hero-fade className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a href={hero.primaryCta?.to || '#collections'} className="btn-gold group">
              {hero.primaryCta?.label || 'Explore Collections'}
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
            <a href={hero.secondaryCta?.to || '#visit'} className="btn-outline-light">{hero.secondaryCta?.label || 'Contact Our Boutique'}</a>
          </div>
          <p data-hero-fade className="mt-10 font-serif text-xl italic text-gold/90">{settings.tagline}</p>
        </div>
      </div>

      <div data-scroll-cue className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.6rem] uppercase tracking-[0.4em] text-ivory/60 sm:flex" aria-hidden="true">
        Scroll
        <span className="relative h-12 w-px overflow-hidden bg-ivory/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-gold" />
        </span>
      </div>
    </section>
  )
}
