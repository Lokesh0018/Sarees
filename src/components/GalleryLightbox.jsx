import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const LABEL = 'text-[0.6875rem] font-semibold uppercase tracking-[0.22em]'

// Full-screen photo viewer for the gallery. `index` is the open photo (null when closed).
// Built on <dialog> for focus trapping, Escape to close and a top-layer backdrop; arrow keys step through photos.
export default function GalleryLightbox({ items, index, onChange, onClose }) {
  const dialogRef = useRef(null)
  const open = index !== null

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
  useEffect(() => () => { document.documentElement.style.overflow = '' }, [])

  const handleClose = () => {
    document.documentElement.style.overflow = ''
    onClose()
  }
  const step = (d) => onChange((index + d + items.length) % items.length)
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1) }
  }

  const item = open ? items[index] : null
  const navBtn = 'flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center border border-gold/40 bg-night/70 text-gold-light backdrop-blur-md transition-colors hover:border-gold-light hover:bg-gold-light hover:text-ink'

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onKeyDown={onKeyDown}
      onClick={(e) => { if (e.target === dialogRef.current) dialogRef.current.close() }}
      aria-label="Gallery photo viewer"
      className="m-auto h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0 text-ivory backdrop:bg-black/90 backdrop:backdrop-blur-sm"
    >
      {item && (
        <div className="flex h-full flex-col" onClick={(e) => { if (e.target === e.currentTarget) dialogRef.current.close() }}>
          <header className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
            <span className={`${LABEL} text-gold-light`}>
              {String(index + 1).padStart(2, '0')} <span className="text-mist">/ {String(items.length).padStart(2, '0')}</span>
            </span>
            <button type="button" onClick={() => dialogRef.current.close()} className={navBtn} aria-label="Close viewer">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>
          <div className="relative flex min-h-0 flex-1 items-center justify-center gap-3 px-3 sm:gap-6 sm:px-8">
            <button type="button" onClick={() => step(-1)} className={`${navBtn} hidden sm:flex`} aria-label="Previous photo">
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <figure className="flex h-full min-w-0 flex-1 flex-col items-center justify-center">
              <img key={item.src} src={item.src} alt={item.alt} className="max-h-full max-w-full border border-gold/30 object-contain shadow-2xl motion-safe:animate-[fadeIn_0.35s_ease-out]" />
            </figure>
            <button type="button" onClick={() => step(1)} className={`${navBtn} hidden sm:flex`} aria-label="Next photo">
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <footer className="flex items-center justify-between gap-4 px-4 py-5 sm:justify-center sm:px-8">
            <button type="button" onClick={() => step(-1)} className={`${navBtn} sm:hidden`} aria-label="Previous photo">
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="min-w-0 text-center" aria-live="polite">
              <p className="font-serif text-[1.35rem] leading-tight sm:text-[1.6rem]">{item.caption}</p>
              <p className="mt-1 hidden text-[0.8125rem] text-mist sm:block">{item.alt}</p>
            </div>
            <button type="button" onClick={() => step(1)} className={`${navBtn} sm:hidden`} aria-label="Next photo">
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </footer>
        </div>
      )}
    </dialog>
  )
}
