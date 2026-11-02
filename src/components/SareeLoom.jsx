import { useEffect, useRef } from 'react'

// Loom weaving, continuous and quiet: a shuttle eases back and forth along a fell line near the bottom while the finished
// cloth rolls smoothly upward above it, like silk taken up on a loom's beam. Below the fell, fine warp threads run down
// to the warp beam and the heddles swap which threads are lifted with every row. The palette is deliberately low contrast
// (emerald-black silk with antique-gold zari) so the cloth reads as a living texture behind the footer text.
// Finished rows live in an offscreen canvas; the visible cloth is offset by the shuttle's progress, so the roll-up is
// seamless with no per-row jumps. Runs only while on screen; prefers-reduced-motion gets the woven cloth as a still.

const CELL = 6 // px per woven cell
const ROW_SECONDS = 1.1 // time for the shuttle to cross once — slow and calm
const FELL = 0.9 // the weaving line sits near the bottom; finished cloth rolls up above it

// Low-contrast emerald and antique-gold silk
const C = {
  gold: '#7A6236', light: '#8C7444', dark: '#4A3A1C',
  maroon: '#0F2A23', deep: '#0A1F19', twill: '#0D251F',
  emerald: '#164A3D', rani: '#23493E', raniLight: '#3E6658',
}

// Small mango (paisley) bitmap, 9 wide x 7 tall; 1 = zari, 2 = eye
const MANGO = [
  '000111000',
  '001111100',
  '011121110',
  '011112110',
  '001111100',
  '000011000',
  '000001000',
]

// Colour of the cell at (col, row): a saree border repeat 56 rows tall
function pattern(c, r) {
  const y = r % 56
  if (y <= 1) return C.light
  if (y === 2) return C.deep
  if (y <= 8) {
    const k = c % 12
    return Math.abs(k - 5.5) <= 5.5 - (y - 3) ? C.gold : C.maroon // temple triangles
  }
  if (y === 9 || y === 17) return C.gold
  if (y <= 16) {
    const d = Math.abs((c % 10) - 5) + Math.abs(y - 13) // diamond chain on emerald
    if (d <= 1) return C.rani
    if (d <= 3) return C.light
    return C.emerald
  }
  if (y === 18) return C.deep
  if (y <= 25) {
    // Mango band, alternate motifs mirrored
    const k = c % 14
    const flip = Math.floor(c / 14) % 2
    const mx = flip ? 8 - (k - 2) : k - 2
    const v = mx >= 0 && mx < 9 ? MANGO[y - 19][mx] : '0'
    return v === '1' ? C.gold : v === '2' ? C.raniLight : C.maroon
  }
  if (y === 26) return C.deep
  if (y <= 28) return C.rani
  if (y === 29) return c % 4 === 0 ? C.light : C.rani
  if (y === 30) return C.gold
  // Body with staggered cross butis and a faint twill
  const by = (y - 31) % 9
  const ox = Math.floor((y - 31) / 9) % 2 ? 0 : 6
  const dx = Math.abs(((c + ox) % 12) - 6)
  const dy = Math.abs(by - 4)
  if ((dx === 0 && dy <= 1) || (dy === 0 && dx <= 1)) return C.light
  return (c + y) % 7 === 0 ? C.twill : C.maroon
}

// One woven cell: base colour, a soft over/under half for the silk texture and a hairline gap
function cell(ctx, x, y, colour, c, r) {
  ctx.fillStyle = colour
  ctx.fillRect(x, y, CELL, CELL - 0.6)
  ctx.fillStyle = (c + r) % 2 ? 'rgba(255,235,200,0.06)' : 'rgba(0,0,0,0.12)'
  ctx.fillRect(x, y, CELL, (CELL - 0.6) / 2)
}

// Smooth start and stop at each selvedge, so the shuttle never jerks at the turn
const ease = (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)

export default function SareeLoom({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let W, H, dpr, cols, fellRow, woven, wctx, raf, visible = false
    let row = 0 // pattern row being woven (keeps counting so the pattern continues)
    let filled = 0 // rows held in the cloth canvas, up to fellRow
    let progress = 0 // 0–1 across the current row
    let t = 0
    let last = performance.now()

    const commitRow = () => {
      if (filled >= fellRow) {
        // Roll the finished cloth up by one row
        wctx.save()
        wctx.setTransform(1, 0, 0, 1, 0, 0)
        wctx.globalCompositeOperation = 'copy'
        wctx.drawImage(woven, 0, -Math.round(CELL * dpr))
        wctx.restore()
      } else {
        filled++
      }
      const y = (filled - 1) * CELL
      for (let c = 0; c < cols; c++) cell(wctx, c * CELL, y, pattern(c, row), c, row)
      row++
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas.clientWidth
      H = canvas.clientHeight
      if (!W || !H) return
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(W / CELL)
      fellRow = Math.max(8, Math.min(Math.floor((H * FELL) / CELL), Math.floor((H - 40) / CELL)))
      woven = document.createElement('canvas')
      woven.width = Math.round(W * dpr)
      woven.height = Math.round(H * dpr)
      wctx = woven.getContext('2d')
      wctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      row = 0; filled = 0; progress = 0
      // Start with the cloth already woven up to the fell, so the shuttle works at the bottom from the first frame
      for (let i = 0; i < fellRow; i++) commitRow()
      draw()
    }

    const draw = () => {
      if (!woven) return
      ctx.clearRect(0, 0, W, H)
      // Continuous take-up: the cloth (and the row in progress) glide up by one row over each crossing
      const lift = reduced ? 0 : progress * CELL
      ctx.drawImage(woven, 0, -lift, W, H)

      // A very soft sheen drifting across the finished cloth
      const clothH = filled * CELL - lift
      const sweep = ((t * 0.025) % 1.6 - 0.3) * W
      const sheen = ctx.createLinearGradient(sweep - 260, 0, sweep + 260, clothH)
      sheen.addColorStop(0, 'rgba(255,230,180,0)')
      sheen.addColorStop(0.5, 'rgba(255,230,180,0.045)')
      sheen.addColorStop(1, 'rgba(255,230,180,0)')
      ctx.fillStyle = sheen
      ctx.fillRect(0, 0, W, clothH)

      if (reduced) return
      const y = filled * CELL - lift // the fell
      const ltr = row % 2 === 0 // shuttle alternates direction each row
      const p = ease(progress)
      const done = Math.floor(p * cols)

      // Cells woven so far in the current row
      for (let i = 0; i < done; i++) {
        const c = ltr ? i : cols - 1 - i
        cell(ctx, c * CELL, y, pattern(c, row), c, row)
      }
      const sx = ltr ? p * W : (1 - p) * W

      // Warp threads from the fell down to the warp beam; the heddles swap which half is lifted each row
      const beamY = H - 8
      for (let c = 0; c < cols; c += 2) {
        const lifted = (c / 2 + row) % 2 === 0
        const x = c * CELL + CELL / 2 + (lifted ? 0.6 : -0.6)
        ctx.fillStyle = lifted ? 'rgba(201,164,92,0.26)' : 'rgba(165,207,193,0.1)'
        ctx.fillRect(x, y + CELL, 0.8, beamY - y - CELL)
      }
      // Warp beam
      const beam = ctx.createLinearGradient(0, beamY - 3, 0, beamY + 3)
      beam.addColorStop(0, 'rgba(201,164,92,0.55)'); beam.addColorStop(1, 'rgba(126,94,34,0.55)')
      ctx.fillStyle = beam
      ctx.fillRect(0, beamY - 2, W, 4)

      // Weft thread trailing back to the selvedge
      ctx.strokeStyle = 'rgba(201,164,92,0.45)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(ltr ? 0 : W, y + CELL / 2)
      ctx.lineTo(sx, y + CELL / 2)
      ctx.stroke()

      // Shuttle: a slim antique-gold boat with a faint halo
      const cy = y + CELL / 2
      const glow = ctx.createRadialGradient(sx, cy, 0, sx, cy, 18)
      glow.addColorStop(0, 'rgba(227,200,143,0.22)')
      glow.addColorStop(1, 'rgba(227,200,143,0)')
      ctx.fillStyle = glow
      ctx.fillRect(sx - 18, cy - 18, 36, 36)
      ctx.fillStyle = 'rgba(201,164,92,0.85)'
      ctx.beginPath()
      ctx.ellipse(sx, cy, 12, 3, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    const update = (dt) => {
      t += dt
      progress += dt / ROW_SECONDS
      if (progress >= 1) {
        progress -= 1
        commitRow()
      }
    }

    const loop = (now) => {
      update(Math.min(0.05, (now - last) / 1000))
      last = now
      draw()
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (reduced || raf || !visible || document.hidden) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const stop = () => { cancelAnimationFrame(raf); raf = 0 }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop() })
    io.observe(canvas)
    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
