import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/motion'

// Gold muggulu (kolam) ornaments framing a section: the same lotus kolam in all four corners (mirrored), so a section's
// bottom corners and the next section's top corners meet at the boundary as one continuous design, with the arcs and
// S-curve touching the edge at the same points from both sides; plus a sikku chain running down both sides. Each set draws itself as its part of the section scrolls
// into view and un-draws when scrolling back up: stroke dash offsets are scrubbed to the scroll position, so the drawing
// moves forward and backward with the page. Colour follows the section's gold token (bronze on parchment).
// prefers-reduced-motion shows the finished drawings.

const S = 200 // corner drawing box; the corner sits at (0, 0)
const pt = (cx, cy, ang, rad) => `${(cx + Math.cos(ang) * rad).toFixed(1)} ${(cy + Math.sin(ang) * rad).toFixed(1)}`
const ring = (x, y, r) => `M${x + r} ${y} a${r} ${r} 0 1 0 ${-2 * r} 0 a${r} ${r} 0 1 0 ${2 * r} 0`

// Each stroke carries a weight: 'b' bold structure, 'm' medium, 'f' fine detail
const W = { b: 1.5, m: 1.1, f: 0.75 }
const leaf = (cx, cy, a, r, spread = 0.42) => `M${cx} ${cy} Q${pt(cx, cy, a - spread, r * 0.85)} ${pt(cx, cy, a, r)} Q${pt(cx, cy, a + spread, r * 0.85)} ${cx} ${cy}`
const diamond = (x, y, r) => `M${x} ${y - r} L${x + r} ${y} L${x} ${y + r} L${x - r} ${y} Z`

// ---- Corners: layered lotus kolam (used in all four corners, mirrored) ---------------------------------------------
const C = 46 // lotus centre
// Figure-eight sikku knot centred on a point of the outer arc, aligned with the arc's tangent
const sikku = (deg) => {
  const a = (deg * Math.PI) / 180
  const x = Math.cos(a) * 128
  const y = Math.sin(a) * 128
  const t = a + Math.PI / 2 // tangent direction
  const p = (u, v) => `${(x + Math.cos(t) * u + Math.cos(a) * v).toFixed(1)} ${(y + Math.sin(t) * u + Math.sin(a) * v).toFixed(1)}`
  return `M${p(0, 0)} C${p(8, -9)} ${p(14, 0)} ${p(8, 7)} C${p(4, 10)} ${p(0, 4)} ${p(0, 0)} C${p(0, -4)} ${p(-4, -10)} ${p(-8, -7)} C${p(-14, 0)} ${p(-8, 9)} ${p(0, 0)}`
}
const CORNER_STROKES = [
  { d: 'M0 152 A152 152 0 0 0 152 0', w: 'b' }, // double outer arc
  { d: 'M0 144 A144 144 0 0 0 144 0', w: 'f' },
  { d: 'M0 108 A108 108 0 0 0 108 0', w: 'm' }, // double inner arc
  { d: 'M0 101 A101 101 0 0 0 101 0', w: 'f' },
  { d: 'M0 184 C40 184 62 162 62 120 C62 82 82 62 120 62 C162 62 184 40 184 0', w: 'm' }, // flowing S-curve
  { d: 'M0 192 C46 192 70 170 70 126 C70 90 90 70 126 70 C170 70 192 46 192 0', w: 'f' }, // its shadow line
  { d: `M${C} 0 L${C} 10 M0 ${C} L10 ${C}`, w: 'm' }, // stems tying the lotus to the edges
  ...Array.from({ length: 8 }, (_, i) => ({ d: leaf(C, C, (i / 8) * Math.PI * 2, 31), w: 'm' })), // outer petals
  ...Array.from({ length: 8 }, (_, i) => ({ d: leaf(C, C, ((i + 0.5) / 8) * Math.PI * 2, 19, 0.5), w: 'f' })), // inner petals
  // Scalloped ring around the lotus
  { d: Array.from({ length: 16 }, (_, i) => {
      const a0 = (i / 16) * Math.PI * 2
      const a1 = ((i + 1) / 16) * Math.PI * 2
      return `${i ? '' : `M${pt(C, C, a0, 38)} `}Q${pt(C, C, (a0 + a1) / 2, 43)} ${pt(C, C, a1, 38)}`
    }).join(' '), w: 'f' },
  { d: ring(C, C, 8), w: 'm' }, // lotus heart
  ...[14, 34, 56, 76].map((deg) => ({ d: sikku(deg), w: 'f' })), // sikku knots woven along the outer arc
  // Fine spokes radiating between the double arcs, like the ribs of a fan
  ...[8, 19, 30, 41, 49, 60, 71, 82].map((deg) => {
    const a = (deg * Math.PI) / 180
    return { d: `M${pt(0, 0, a, 112)} L${pt(0, 0, a, 140)}`, w: 'f' }
  }),
  // Peacock-feather eye on the diagonal, pointing back toward the corner
  ...[[34, 'm'], [23, 'f'], [13, 'f']].map(([len, w]) => ({ d: leaf(150, 150, (225 * Math.PI) / 180, len, 0.55), w })),
  // Scalloped bands along both outer edges: they touch the section edge, so they close into ovals with the
  // mirrored corner of the neighbouring section
  { d: Array.from({ length: 5 }, (_, i) => `M${156 + i * 9} 0 Q${160.5 + i * 9} 8 ${165 + i * 9} 0`).join(' '), w: 'f' },
  { d: Array.from({ length: 5 }, (_, i) => `M0 ${156 + i * 9} Q8 ${160.5 + i * 9} 0 ${165 + i * 9}`).join(' '), w: 'f' },
]
const CORNER_DOTS = [
  { x: 92, y: 18, k: 'halo' }, { x: 18, y: 92, k: 'halo' }, { x: 128, y: 18, k: 'dia' }, { x: 18, y: 128, k: 'dia' },
  { x: 90, y: 90, k: 'dia' }, { x: 160, y: 30, k: 'dot' }, { x: 30, y: 160, k: 'dot' }, { x: C, y: C, k: 'dot' },
  { x: 132, y: 132, k: 'dot' }, // peacock eye centre
]

// ---- Sides: a double-line sikku chain with leaves, 40 x 520 -------------------------------------------------------
const SIDE_H = 520
const UNIT = 52
const serpent = (dir, amp) => {
  let d = `M20 0`
  for (let y = 0, k = 0; y < SIDE_H; y += UNIT, k++) {
    const sgn = (k % 2 ? -1 : 1) * dir
    d += ` C${20 + amp * sgn} ${y + 13} ${20 + amp * sgn} ${y + 39} 20 ${y + UNIT}`
  }
  return d
}
const SIDE_STROKES = [
  { d: serpent(1, 18), w: 'm' },
  { d: serpent(-1, 18), w: 'm' },
  { d: serpent(1, 12), w: 'f' }, // inner double line
  { d: serpent(-1, 12), w: 'f' },
  // Leaves sprouting outward from alternate loops
  ...Array.from({ length: SIDE_H / UNIT / 2 }, (_, i) => {
    const y = UNIT * (2 * i) + UNIT / 2
    return { d: `M37 ${y} Q48 ${y - 10} 41 ${y - 19} Q38 ${y - 9} 37 ${y} M3 ${y + UNIT} Q-8 ${y + UNIT - 10} -1 ${y + UNIT - 19} Q2 ${y + UNIT - 9} 3 ${y + UNIT}`, w: 'f' }
  }),
]
const SIDE_DOTS = [
  ...Array.from({ length: SIDE_H / UNIT }, (_, i) => ({ x: 20, y: UNIT * i + UNIT / 2, k: i % 2 ? 'dia' : 'dot' })),
  ...Array.from({ length: SIDE_H / UNIT }, (_, i) => ({ x: i % 2 ? 44 : -4, y: UNIT * i + UNIT / 2, k: 'dot' })),
]

function Dot({ x, y, k, part }) {
  if (k === 'dia') return <path d={diamond(x, y, 3)} fill="currentColor" stroke="none" data-mg-dot={part} style={{ opacity: 0 }} />
  if (k === 'halo') return (
    <g data-mg-dot={part} style={{ opacity: 0 }}>
      <circle cx={x} cy={y} r="2.2" fill="currentColor" stroke="none" />
      <circle cx={x} cy={y} r="5" fill="none" strokeWidth={W.f} />
    </g>
  )
  return <circle cx={x} cy={y} r="2" fill="currentColor" stroke="none" data-mg-dot={part} style={{ opacity: 0 }} />
}

function Drawing({ viewBox, strokes, dots, className, part }) {
  return (
    <svg viewBox={viewBox} className={`${className} [filter:drop-shadow(0_0_3px_rgb(201_164_92/0.35))]`} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" overflow="visible">
      {strokes.map(({ d, w }, i) => <path key={i} d={d} strokeWidth={W[w]} pathLength="1" data-mg={part} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />)}
      {dots.map((dot, i) => <Dot key={`d${i}`} {...dot} part={part} />)}
    </svg>
  )
}

const CORNER = 'h-28 w-28 sm:h-36 sm:w-36 lg:h-48 lg:w-48 xl:h-52 xl:w-52'

export default function Muggulu() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const all = (sel) => root.querySelectorAll(sel)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(all('[data-mg]'), { strokeDashoffset: 0 })
      gsap.set(all('[data-mg-dot]'), { opacity: 1 })
      return
    }
    const section = root.parentElement
    // Each part draws over its own stretch of the section's scroll, scrubbed both ways
    const parts = [
      { part: 'top', start: 'top 92%', end: 'top 12%' },
      { part: 'side', start: 'top 45%', end: 'bottom 55%' },
      { part: 'bottom', start: 'bottom 98%', end: 'bottom 40%' },
    ]
    const ctx = gsap.context(() => {
      parts.forEach(({ part, start, end }) => {
        const strokes = all(`[data-mg="${part}"]`)
        if (!strokes.length) return
        const tl = gsap.timeline({ scrollTrigger: { trigger: section, start, end, scrub: 0.8 } })
        tl.to(all(`[data-mg-dot="${part}"]`), { opacity: 1, duration: 0.3, stagger: 0.04, ease: 'none' }, 0)
        tl.to(strokes, { strokeDashoffset: 0, duration: 1, stagger: 0.06, ease: 'none' }, 0.1)
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 -z-10 text-gold/60" aria-hidden="true">
      {/* Top corners */}
      <div className="absolute inset-x-0 top-0 flex justify-between">
        <Drawing viewBox={`0 0 ${S} ${S}`} strokes={CORNER_STROKES} dots={CORNER_DOTS} part="top" className={CORNER} />
        <Drawing viewBox={`0 0 ${S} ${S}`} strokes={CORNER_STROKES} dots={CORNER_DOTS} part="top" className={`${CORNER} -scale-x-100`} />
      </div>
      {/* Sides: only where there is margin beside the content */}
      <div className="absolute inset-y-0 left-3 hidden items-center lg:flex">
        <Drawing viewBox={`-8 0 56 ${SIDE_H}`} strokes={SIDE_STROKES} dots={SIDE_DOTS} part="side" className="h-[55%] max-h-[520px] w-auto" />
      </div>
      <div className="absolute inset-y-0 right-3 hidden items-center lg:flex">
        <Drawing viewBox={`-8 0 56 ${SIDE_H}`} strokes={SIDE_STROKES} dots={SIDE_DOTS} part="side" className="h-[55%] max-h-[520px] w-auto -scale-x-100" />
      </div>
      {/* Bottom corners: the top kolam mirrored, so it mirrors the next section's top corners across the boundary */}
      <div className="absolute inset-x-0 bottom-0 flex justify-between">
        <Drawing viewBox={`0 0 ${S} ${S}`} strokes={CORNER_STROKES} dots={CORNER_DOTS} part="bottom" className={`${CORNER} -scale-y-100`} />
        <Drawing viewBox={`0 0 ${S} ${S}`} strokes={CORNER_STROKES} dots={CORNER_DOTS} part="bottom" className={`${CORNER} -scale-100`} />
      </div>
    </div>
  )
}

// Keep ScrollTrigger positions correct when late content (images, fonts) changes the page height
if (typeof window !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh())
