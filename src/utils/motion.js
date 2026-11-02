import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

const REDUCED = '(prefers-reduced-motion: reduce)'

/**
 * Scroll-triggered reveals scoped to a container.
 *  [data-reveal]          fades/rises in when it enters the viewport
 *  [data-reveal-stagger]  children reveal in sequence
 *  [data-parallax="0.15"] drifts vertically while scrolling
 * Content stays fully visible when motion is reduced or GSAP fails.
 */
export function useReveal(ref, deps = []) {
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const mm = gsap.matchMedia()
    mm.add(`not ${REDUCED}`, () => {
      root.querySelectorAll('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 36, opacity: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })
      root.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
        gsap.from(group.children, {
          y: 40, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.09,
          scrollTrigger: { trigger: group, start: 'top 85%', once: true },
        })
      })
      root.querySelectorAll('[data-parallax]').forEach((el) => {
        const amount = parseFloat(el.dataset.parallax) || 0.12
        gsap.fromTo(el, { yPercent: -amount * 50 }, {
          yPercent: amount * 50, ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    }, root)
    return () => mm.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
