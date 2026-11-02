import { useId } from 'react'

// Procedural woven-textile artwork used wherever a real photograph has not
// been supplied yet. Purely decorative: it never pretends to be a product photo.

function isLight(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return 0.299 * r + 0.587 * g + 0.114 * b > 160
}

function hash(str = '') {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return Math.abs(h)
}

const MOTIFS = {
  buta: (c) => (
    <g fill="none" stroke={c} strokeWidth="1.1">
      <path d="M27 46c-8 0-12-7-9-14 3-8 13-11 18-20 2 7 3 14 1 21-2 8-5 13-10 13z" fill={c} fillOpacity="0.16" />
      <path d="M27 40c-4 0-6-4-4-8 2-4 7-6 10-11 1 4 1 8 0 12-1 4-3 7-6 7z" strokeOpacity="0.7" />
      <circle cx="26" cy="35" r="1.8" fill={c} stroke="none" />
      <path d="M52 52l3-3 3 3-3 3z M2 22l3-3 3 3-3 3z" fill={c} fillOpacity="0.55" stroke="none" />
    </g>
  ),
  diamond: (c) => (
    <g fill="none" stroke={c} strokeWidth="0.9">
      <path d="M30 4L56 30 30 56 4 30z" />
      <path d="M30 18L42 30 30 42 18 30z" fill={c} fillOpacity="0.2" />
      <circle cx="30" cy="30" r="1.8" fill={c} />
    </g>
  ),
  stripe: (c) => (
    <g fill={c}>
      <rect x="0" y="0" width="1.2" height="60" opacity="0.8" />
      <rect x="6" y="0" width="0.6" height="60" opacity="0.5" />
      <rect x="22" y="0" width="14" height="60" opacity="0.08" />
      <circle cx="29" cy="15" r="1.4" opacity="0.7" /><circle cx="29" cy="45" r="1.4" opacity="0.7" />
    </g>
  ),
  dots: (c) => (
    <g fill={c}>
      <circle cx="15" cy="15" r="1.6" opacity="0.7" /><circle cx="45" cy="45" r="1.6" opacity="0.7" />
      <circle cx="45" cy="15" r="0.8" opacity="0.45" /><circle cx="15" cy="45" r="0.8" opacity="0.45" />
    </g>
  ),
  floral: (c) => (
    <g fill={c}>
      {[0, 90, 180, 270].map((r) => (
        <ellipse key={r} cx="30" cy="22" rx="4" ry="8" opacity="0.32" transform={`rotate(${r} 30 30)`} />
      ))}
      <circle cx="30" cy="30" r="2.6" opacity="0.9" />
      <circle cx="4" cy="4" r="1.2" opacity="0.5" /><circle cx="56" cy="56" r="1.2" opacity="0.5" />
    </g>
  ),
  stitch: (c) => (
    <g fill="none" stroke={c} strokeWidth="1" strokeDasharray="4 3" opacity="0.7">
      <path d="M0 30h60" /><path d="M30 0v60" />
      <path d="M8 8l44 44" strokeOpacity="0.4" />
    </g>
  ),
  jewel: (c) => (
    <g fill="none" stroke={c} strokeWidth="0.9">
      <circle cx="30" cy="26" r="10" />
      <circle cx="30" cy="26" r="5" fill={c} fillOpacity="0.25" />
      <path d="M22 36q8 14 16 0" />
      {[22, 26, 30, 34, 38].map((x) => <circle key={x} cx={x} cy={44 + (x === 30 ? 3 : 0)} r="1.1" fill={c} stroke="none" />)}
    </g>
  ),
}

export default function TextileArt({ base = '#123C32', motif = 'buta', seed = '', className = '', label }) {
  const uid = useId().replace(/:/g, '')
  const light = isLight(base)
  const ink = light ? '#9E7D3E' : '#C9A45C'
  const h = hash(seed + motif)
  const scale = 0.8 + (h % 5) * 0.08
  const offset = h % 60
  const draw = MOTIFS[motif] || MOTIFS.buta

  return (
    <svg
      className={className}
      viewBox="0 0 300 400"
      preserveAspectRatio="xMidYMid slice"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <pattern id={`p${uid}`} width="60" height="60" patternUnits="userSpaceOnUse" patternTransform={`translate(${offset} ${offset}) scale(${scale})`}>
          {draw(ink)}
        </pattern>
        <linearGradient id={`s${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={light ? 0.35 : 0.12} />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.7" stopColor="#000" stopOpacity={light ? 0.04 : 0.22} />
          <stop offset="1" stopColor="#fff" stopOpacity={light ? 0.15 : 0.06} />
        </linearGradient>
        <pattern id={`b${uid}`} width="20" height="22" patternUnits="userSpaceOnUse">
          <path d="M0 22L10 6 20 22z" fill={ink} fillOpacity="0.85" />
          <path d="M10 13l3 4h-6z" fill={base} />
        </pattern>
      </defs>
      <rect width="300" height="400" fill={base} />
      <rect width="300" height="400" fill={`url(#p${uid})`} />
      {/* Zari border: temple band with fine rules, like the pallu edge of a saree */}
      <g transform="translate(0 318)">
        <rect width="300" height="56" fill={ink} fillOpacity="0.12" />
        <rect y="4" width="300" height="1" fill={ink} />
        <rect y="10" width="300" height="22" fill={`url(#b${uid})`} />
        <rect y="38" width="300" height="2.5" fill={ink} />
        <rect y="46" width="300" height="0.8" fill={ink} fillOpacity="0.7" />
      </g>
      <rect width="300" height="400" fill={`url(#s${uid})`} />
    </svg>
  )
}
