import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Copy, Search, X } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { whatsappHref } from '../utils/contact'
import { SHADES, SHADE_FAMILIES, isLightColour } from '../content/shades'
import WhatsAppIcon from './WhatsAppIcon'

const LABEL = 'text-[0.6875rem] font-semibold uppercase tracking-[0.22em]'
const familyName = Object.fromEntries(SHADE_FAMILIES.map((f) => [f.id, f.name]))
// Mid-depth swatch of each family, used as the dot on its filter chip
const familyDot = Object.fromEntries(SHADE_FAMILIES.map((f) => [f.id, SHADES.find((s) => s.family === f.id && s.code.endsWith('3')).hex]))

// Full-screen shade card explorer: filter by family, search by name or code, pick a tone and enquire on WhatsApp.
// Built on <dialog>, which brings focus trapping, Escape to close and a top-layer backdrop.
export default function ShadeFinder({ open, onClose }) {
  const { settings } = useStore()
  const dialogRef = useRef(null)
  const gridRef = useRef(null)
  const scrollRef = useRef(null)
  const [family, setFamily] = useState('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(SHADES[2])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // Native close (Escape, or close() above) always runs through here, so scroll is restored once
  const handleClose = () => {
    document.documentElement.style.overflow = ''
    onClose()
  }
  useEffect(() => () => { document.documentElement.style.overflow = '' }, [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SHADES.filter((s) => (family === 'all' || s.family === family) && (!q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.hex.toLowerCase().includes(q)))
  }, [family, query])

  // A new filter or search starts the grid from the top
  useEffect(() => { scrollRef.current?.scrollTo({ top: 0 }) }, [family, query])

  const counts = useMemo(() => Object.fromEntries(SHADE_FAMILIES.map((f) => [f.id, SHADES.filter((s) => s.family === f.id).length])), [])

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(`${selected.code} ${selected.name}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch { /* clipboard blocked: the code stays visible to copy by hand */ }
  }

  // Arrow keys move through the grid (one tab stop for the whole grid); Enter/Space selects via the button itself
  const onGridKeyDown = (e) => {
    const keys = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 'down', ArrowUp: 'up', Home: 'home', End: 'end' }
    if (!(e.key in keys) || !visible.length) return
    e.preventDefault()
    const cols = getComputedStyle(gridRef.current).gridTemplateColumns.split(' ').length
    const i = Math.max(0, visible.findIndex((s) => s.code === selected.code))
    const step = keys[e.key]
    const next = step === 'down' ? i + cols : step === 'up' ? i - cols : step === 'home' ? 0 : step === 'end' ? visible.length - 1 : i + step
    const target = visible[Math.min(visible.length - 1, Math.max(0, next))]
    setSelected(target)
    const el = gridRef.current.querySelector(`[data-code="${target.code}"]`)
    el?.focus({ preventScroll: true })
    el?.scrollIntoView({ block: 'nearest' })
  }

  const activeInView = visible.some((s) => s.code === selected.code)
  const message = `Hello ${settings.storeName}, I would like to match lining shade ${selected.code} (${selected.name}, ${selected.hex}). Is it available?`
  const ink = isLightColour(selected.hex) ? 'text-[#14231E]' : 'text-white'

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={(e) => { if (e.target === dialogRef.current) dialogRef.current.close() }}
      aria-labelledby="shade-finder-title"
      className="m-auto h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0 text-ivory backdrop:bg-black/75 backdrop:backdrop-blur-sm sm:h-[min(880px,92dvh)] sm:w-[min(1180px,94vw)]"
    >
      <div className="flex h-full flex-col overflow-hidden border-gold/30 bg-night-lowest sm:border">
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-gold/20 px-5 py-4 sm:px-7 sm:py-5">
          <div>
            <span className={`${LABEL} text-gold-light`}>SJR Shade Card</span>
            <h2 id="shade-finder-title" className="mt-1 font-serif text-[1.75rem] leading-tight sm:text-[2.1rem]">{SHADES.length} Lining &amp; Matching Tones</h2>
          </div>
          <button type="button" onClick={() => dialogRef.current.close()} className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border border-gold/30 text-mist transition-colors hover:border-gold-light hover:text-gold-light" aria-label="Close shade card">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        {/* Search and family filters */}
        <div className="flex flex-col gap-3 border-b border-gold/20 px-5 py-4 sm:px-7">
          <label className="relative block max-w-md">
            <span className="sr-only">Search shades by name, code or hex</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search “peacock”, “G124” or “#0F4D3A”"
              className="min-h-11 w-full border border-gold/30 bg-night-mid py-2 pl-9 pr-3 text-[0.9375rem] text-ivory placeholder:text-mist/60 focus:border-gold-light focus:outline-none [color-scheme:dark]"
            />
          </label>
          <div className="shade-rail -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Colour family">
            {[{ id: 'all', name: 'All' }, ...SHADE_FAMILIES].map((f) => {
              const on = family === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFamily(f.id)}
                  className={`inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-2 border px-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] transition-colors ${on ? 'border-gold-light bg-gold-light text-ink' : 'border-gold/25 text-mist hover:border-gold/60 hover:text-ivory'}`}
                >
                  {f.id !== 'all' && <span className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: familyDot[f.id] }} aria-hidden="true" />}
                  {f.name}
                  <span className={on ? 'text-ink/70' : 'text-mist/60'}>{f.id === 'all' ? SHADES.length : counts[f.id]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Grid + detail panel */}
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <div ref={scrollRef} className="shade-scroll min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
            <p className="mb-3 text-[0.8125rem] text-mist" aria-live="polite">
              {visible.length} {visible.length === 1 ? 'shade' : 'shades'}{family !== 'all' && ` in ${familyName[family]}`}{query && ` matching “${query}”`}
            </p>
            {visible.length ? (
              <div
                ref={gridRef}
                role="listbox"
                aria-label="Shades"
                onKeyDown={onGridKeyDown}
                className="grid grid-cols-[repeat(auto-fill,minmax(3.25rem,1fr))] gap-1.5 sm:grid-cols-[repeat(auto-fill,minmax(4rem,1fr))] sm:gap-2"
              >
                {visible.map((s, i) => {
                  const on = s.code === selected.code
                  const focusable = activeInView ? on : i === 0
                  return (
                    <button
                      key={s.code}
                      type="button"
                      role="option"
                      aria-selected={on}
                      aria-label={`${s.name}, ${s.code}`}
                      data-code={s.code}
                      tabIndex={focusable ? 0 : -1}
                      onClick={() => setSelected(s)}
                      title={`${s.code} · ${s.name}`}
                      className={`group relative aspect-square cursor-pointer transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light motion-safe:hover:scale-[1.08] ${on ? 'z-10 ring-2 ring-gold-light ring-offset-2 ring-offset-night-lowest' : ''}`}
                      style={{ backgroundColor: s.hex }}
                    >
                      <span className={`absolute inset-x-0 bottom-0 py-0.5 text-center text-[0.5625rem] font-semibold tracking-wider opacity-0 transition-opacity group-hover:opacity-100 ${on ? 'opacity-100' : ''} ${isLightColour(s.hex) ? 'text-[#14231E]' : 'text-white/90'}`}>{s.code}</span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 border border-dashed border-gold/30 px-6 py-14 text-center">
                <p className="font-serif text-xl">No shade matches “{query}”</p>
                <p className="max-w-sm text-[0.875rem] text-mist">Try a colour family name like “green”, or send us a photo of your saree on WhatsApp and we will match it for you.</p>
                <button type="button" onClick={() => { setQuery(''); setFamily('all') }} className={`${LABEL} mt-2 cursor-pointer text-gold-light hover:underline`}>Clear search</button>
              </div>
            )}
          </div>

          {/* Selected shade */}
          <aside className="shrink-0 border-t border-gold/20 bg-night-low p-5 sm:px-7 lg:w-[22rem] lg:overflow-y-auto lg:[scrollbar-width:thin] lg:[scrollbar-color:rgb(201_164_92/0.5)_transparent] lg:border-l lg:border-t-0 lg:p-7" aria-label="Selected shade">
            <div className="flex gap-4 lg:flex-col">
              {/* Swatch shown against a zari border, the way a lining sits beside the saree */}
              <div className="relative h-24 w-24 shrink-0 overflow-hidden border border-gold/30 lg:h-48 lg:w-full" style={{ backgroundColor: selected.hex }}>
                <span className="absolute inset-y-0 right-0 w-3 bg-[linear-gradient(180deg,#B08A45,#F1DCAA_40%,#C9A45C_60%,#E9D3A0)] lg:w-5" aria-hidden="true" />
                <span className={`absolute bottom-2 left-3 hidden font-serif text-[2.5rem] leading-none lg:block ${ink}`}>{selected.code}</span>
              </div>
              <div className="min-w-0 flex-1">
                <span className={`${LABEL} text-gold-light`}>{familyName[selected.family]}</span>
                <p className="mt-1 font-serif text-[1.6rem] leading-tight">{selected.name}</p>
                <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.8125rem]">
                  <dt className="text-mist">Code</dt><dd className="font-semibold tracking-wider">{selected.code}</dd>
                  <dt className="text-mist">Hex</dt><dd className="font-mono">{selected.hex}</dd>
                </dl>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
              <a href={whatsappHref(settings, message)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 bg-gold-light px-4 text-center text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ivory">
                <WhatsAppIcon className="h-[18px] w-[18px]" /> Enquire this shade
              </a>
              <button type="button" onClick={copyCode} className="inline-flex min-h-12 min-w-12 cursor-pointer items-center justify-center border border-gold/40 px-3 text-gold-light transition-colors hover:border-gold-light" aria-label={copied ? 'Shade code copied' : `Copy shade code ${selected.code}`}>
                {copied ? <Check className="h-5 w-5" aria-hidden="true" /> : <Copy className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
            <p className="mt-4 text-[0.75rem] leading-relaxed text-mist/80">Screen colours are indicative. We confirm every match against your fabric in daylight at the store.</p>
          </aside>
        </div>
      </div>
    </dialog>
  )
}
