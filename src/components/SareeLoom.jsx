import { useEffect, useRef } from 'react'

// Loom weaving: gold warp threads span the canvas while a glowing shuttle carries the weft back and forth, weaving a
// saree border pattern row by row (zari bands, temple triangles, a diamond chain on emerald, a maroon body with butis).
// A reed beats each finished row into place. When the canvas is full the cloth rests, fades and the loom starts over.
// Finished rows are cached in an offscreen canvas, so each frame only draws the row in progress.
// Runs only while on screen; prefers-reduced-motion gets the finished cloth as a still.

const CELL = 6 // px per woven cell
const ROW_SECONDS = 0.32 // time for the shuttle to cross once
const HOLD = 2.5 // seconds the finished cloth rests
const FADE = 1.6 // seconds to fade before restarting

const C = {
  gold: '#C9A45C', light: '#E3C88F', dark: '#8A6828',
  maroon: '#5A1830', deep: '#3A0F20', emerald: '#1D5446', emeraldDeep: '#123C32',
}

// Colour of the cell at (col, row): a saree border repeat 40 rows tall
function pattern(c, r) {
  const y = r % 40
  if (y <= 1) return C.light
  if (y === 2) return C.deep
  if (y <= 8) {
    // Temple triangles pointing down
    const k = c % 12
    const h = y - 3
    return Math.abs(k - 5.5) <= 5.5 - h ? C.gold : C.maroon
  }
  if (y === 9 || y === 17) return C.gold
  if (y <= 16) {
    // Diamond chain on emerald
    const d = Math.abs((c % 10) - 5) + Math.abs(y - 13)
    if (d <= 1) return C.maroon
    if (d <= 3) return C.light
    return C.emerald
  }
  if (y <= 20) return y === 19 && c % 6 === 0 ? C.light : C.maroon
  if (y === 21) return C.deep
  // Body with small cross-shaped butis
  const bx = c % 12
  const by = (y - 22) % 9
  const ox = Math.floor((y - 22) / 9) % 2 ? 0 : 6 // stagger alternate buti rows
  const dx = Math.abs(((bx + ox) % 12) - 6)
  const dy = Math.abs(by - 4)
  if ((dx === 0 && dy <= 1) || (dy === 0 && dx <= 1)) return C.light
  return (c + y) % 7 === 0 ? '#4E1529' : C.maroon
}

// One woven cell: base colour, a lighter "over" half for the twill texture and a hairline gap
function cell(ctx, x, y, colour, c, r) {
  ctx.fillStyle = colour
  ctx.fillRect(x, y, CELL, CELL - 0.6)
  ctx.fillStyle = (c + r) % 2 ? 'rgba(255,235,200,0.10)' : 'rgba(0,0,0,0.12)'
  ctx.fillRect(x, y, CELL, (CELL - 0.6) / 2)
}

export default function SareeLoom({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let W, H, dpr, cols, rows, woven, wctx, raf, visible = false
    let row = 0 // row being woven
    let progress = 0 // 0–1 across the current row
    let phase = 'weave' // weave → hold → fade
    let timer = 0
    let beat = 0 // reed pulse, decays after each row
    let last = performance.now()

    const resetCloth = () => {
      row = 0; progress = 0; phase = 'weave'; timer = 0
      wctx.clearRect(0, 0, W, H)
    }

    const commitRow = (r) => {
      for (let c = 0; c < cols; c++) cell(wctx, c * CELL, r * CELL, pattern(c, r), c, r)
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
      rows = Math.ceil(H / CELL)
      woven = document.createElement('canvas')
      woven.width = Math.round(W * dpr)
      woven.height = Math.round(H * dpr)
      wctx = woven.getContext('2d')
      wctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      resetCloth()
      if (reduced) {
        for (let r = 0; r < rows; r++) commitRow(r)
        row = rows
        phase = 'hold'
      }
      draw()
    }

    const draw = () => {
      if (!woven) return
      ctx.clearRect(0, 0, W, H)
      ctx.globalAlpha = phase === 'fade' ? Math.max(0, 1 - timer / FADE) : 1
      ctx.drawImage(woven, 0, 0, W, H)
      ctx.globalAlpha = 1
      if (phase !== 'weave') return

      const y = row * CELL
      const ltr = row % 2 === 0 // shuttle alternates direction each row
      const done = Math.floor(progress * cols)
      // Cells woven so far in the current row
      for (let i = 0; i < done; i++) {
        const c = ltr ? i : cols - 1 - i
        cell(ctx, c * CELL, y, pattern(c, row), c, row)
      }
      const sx = ltr ? progress * W : (1 - progress) * W

      // Warp threads across the unwoven cloth below, and faintly over the woven part
      for (let c = 0; c < cols; c += 2) {
        const x = c * CELL + CELL / 2
        ctx.fillStyle = c % 4 ? 'rgba(201,164,92,0.22)' : 'rgba(227,200,143,0.38)'
        ctx.fillRect(x, y + CELL, 0.8, H - y)
      }

      // Weft thread trailing back to the selvedge
      ctx.strokeStyle = 'rgba(233,211,160,0.75)'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(ltr ? 0 : W, y + CELL / 2)
      ctx.lineTo(sx, y + CELL / 2)
      ctx.stroke()

      // Reed: a gold bar just below the fell of the cloth that pulses when a row is beaten in
      ctx.fillStyle = `rgba(227,200,143,${0.35 + beat * 0.5})`
      ctx.fillRect(0, y + CELL + 2 - beat * 2, W, 1.5)

      // Shuttle: a glowing boat-shaped bobbin
      const glow = ctx.createRadialGradient(sx, y + CELL / 2, 0, sx, y + CELL / 2, 26)
      glow.addColorStop(0, 'rgba(255,225,160,0.55)')
      glow.addColorStop(1, 'rgba(255,225,160,0)')
      ctx.fillStyle = glow
      ctx.fillRect(sx - 26, y + CELL / 2 - 26, 52, 52)
      ctx.fillStyle = C.light
      ctx.beginPath()
      ctx.ellipse(sx, y + CELL / 2, 11, 3.2, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = C.dark
      ctx.fillRect(sx - 4, y + CELL / 2 - 1, 8, 2)
    }

    const update = (dt) => {
      beat = Math.max(0, beat - dt * 3)
      if (phase === 'weave') {
        progress += dt / ROW_SECONDS
        if (progress >= 1) {
          commitRow(row)
          row++
          progress = 0
          beat = 1
          if (row >= rows) { phase = 'hold'; timer = 0 }
        }
      } else {
        timer += dt
        if (phase === 'hold' && timer >= HOLD) { phase = 'fade'; timer = 0 }
        else if (phase === 'fade' && timer >= FADE) resetCloth()
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
