import { useEffect, useRef } from 'react'

// Two sarees drawn on a canvas and waved like flags, with zari sparkles and thread wisps on the wind: the cloth is painted once into an offscreen texture (silk grain,
// zari borders with bead chains, temple triangles and mango motifs, flower butis, a peacock pallu and a fringe), then
// each frame redraws it in thin vertical slices displaced by layered sine waves, with fold shading and a travelling
// zari glint. The left edge is held like a flagpole and the ripple grows toward the pallu on the right.
// Runs only while on screen; prefers-reduced-motion gets a single still frame.

const MAROON = ['#3A0F20', '#5A1830', '#4A1428', '#2C0A18']
const EMERALD = ['#0B2A23', '#1D5446', '#123C32', '#06190F']
const GOLD = ['#7E5E22', '#C9A45C', '#E9D3A0', '#A9843E']

// Mango (mangai / paisley) motif centred on (x, y), pointing right
function mango(c, x, y, s, fill, stroke) {
  c.save()
  c.translate(x, y)
  c.beginPath()
  c.moveTo(-s * 0.55, s * 0.15)
  c.bezierCurveTo(-s * 0.6, -s * 0.55, s * 0.35, -s * 0.7, s * 0.55, -s * 0.05)
  c.bezierCurveTo(s * 0.7, s * 0.45, s * 0.1, s * 0.6, -s * 0.15, s * 0.45)
  c.bezierCurveTo(-s * 0.35, s * 0.35, -s * 0.5, s * 0.3, -s * 0.55, s * 0.15)
  c.closePath()
  if (fill) { c.fillStyle = fill; c.fill() }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = Math.max(0.8, s * 0.08); c.stroke() }
  c.beginPath()
  c.arc(-s * 0.05, s * 0.05, s * 0.14, 0, Math.PI * 2)
  c.fillStyle = stroke || MAROON[0]
  c.fill()
  c.restore()
}

// Small four/six-petal flower buti
function flower(c, x, y, r, petals, fill, centre) {
  c.fillStyle = fill
  for (let i = 0; i < petals; i++) {
    const a = (i / petals) * Math.PI * 2
    c.beginPath()
    c.ellipse(x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.6, r * 0.42, r * 0.22, a, 0, Math.PI * 2)
    c.fill()
  }
  c.fillStyle = centre
  c.beginPath()
  c.arc(x, y, r * 0.22, 0, Math.PI * 2)
  c.fill()
}

// Stylised peacock-feather eye for the pallu
function feather(c, x, y, s) {
  const rings = [[GOLD[2], 1], [MAROON[1], 0.72], [GOLD[1], 0.5], ['#1D5446', 0.3]]
  rings.forEach(([col, k]) => {
    c.fillStyle = col
    c.beginPath()
    c.ellipse(x, y, s * 0.42 * k, s * 0.6 * k, 0, 0, Math.PI * 2)
    c.fill()
  })
  c.strokeStyle = GOLD[1]
  c.lineWidth = Math.max(1, s * 0.05)
  c.beginPath()
  c.moveTo(x, y + s * 0.6)
  c.lineTo(x, y + s * 1.1)
  c.stroke()
}

function paintSaree(w, h, dpr, BODY = MAROON) {
  const tex = document.createElement('canvas')
  tex.width = Math.round(w * dpr)
  tex.height = Math.round(h * dpr)
  const c = tex.getContext('2d')
  c.scale(dpr, dpr)

  // Silk body with a soft diagonal sheen
  const body = c.createLinearGradient(0, 0, w, h)
  body.addColorStop(0, BODY[0]); body.addColorStop(0.45, BODY[1]); body.addColorStop(1, BODY[2])
  c.fillStyle = body
  c.fillRect(0, 0, w, h)
  for (let x = -h; x < w; x += 110) {
    const g = c.createLinearGradient(x, 0, x + h * 0.6, h)
    g.addColorStop(0, 'rgba(255,220,180,0)'); g.addColorStop(0.5, 'rgba(255,220,180,0.05)'); g.addColorStop(1, 'rgba(255,220,180,0)')
    c.fillStyle = g
    c.fillRect(x, 0, h * 0.6, h)
  }
  // Fine thread grain: faint weft lines with a little random variation
  for (let y = 0; y < h; y += 2) {
    c.fillStyle = `rgba(${Math.random() < 0.5 ? '0,0,0' : '255,210,170'},${0.025 + Math.random() * 0.03})`
    c.fillRect(0, y, w, 1)
  }

  const band = Math.max(26, Math.round(h * 0.17))
  const fringeW = 22
  const clothW = w - fringeW

  // Zari border band (top or bottom). `inner` is the edge facing the body.
  const border = (y, inner) => {
    const g = c.createLinearGradient(0, y, 0, y + band)
    g.addColorStop(0, GOLD[0]); g.addColorStop(0.35, GOLD[2]); g.addColorStop(0.65, GOLD[1]); g.addColorStop(1, GOLD[3])
    c.fillStyle = g
    c.fillRect(0, y, clothW, band)
    // Selvedge stripes
    c.fillStyle = BODY[3]
    c.fillRect(0, y + band * 0.1, clothW, 1.5)
    c.fillRect(0, y + band * 0.9, clothW, 1.5)
    // Rudraksha bead chain near the outer edge
    const beadY = inner === 'down' ? y + band * 0.2 : y + band * 0.8
    for (let x = 4; x < clothW; x += 9) {
      c.fillStyle = BODY[1]
      c.beginPath(); c.arc(x, beadY, 2.2, 0, Math.PI * 2); c.fill()
      c.fillStyle = GOLD[2]
      c.beginPath(); c.arc(x - 0.6, beadY - 0.6, 0.8, 0, Math.PI * 2); c.fill()
    }
    // Running mango motifs along the middle of the band
    const midY = y + band * 0.5
    for (let x = 14, i = 0; x < clothW; x += 30, i++) {
      mango(c, x, midY, band * 0.34, i % 2 ? BODY[1] : BODY[0], GOLD[2])
    }
    // Temple (korvai) triangles stepping into the body, outlined
    const tri = band * 0.5
    const base = inner === 'down' ? y + band : y
    const dir = inner === 'down' ? 1 : -1
    for (let x = 0; x < clothW; x += tri) {
      c.beginPath()
      c.moveTo(x, base)
      c.lineTo(x + tri / 2, base + dir * tri * 0.85)
      c.lineTo(x + tri, base)
      c.closePath()
      c.fillStyle = GOLD[1]
      c.fill()
      c.strokeStyle = BODY[3]
      c.lineWidth = 0.8
      c.stroke()
      // Small inner triangle for the stepped look
      c.beginPath()
      c.moveTo(x + tri * 0.3, base)
      c.lineTo(x + tri / 2, base + dir * tri * 0.45)
      c.lineTo(x + tri * 0.7, base)
      c.closePath()
      c.fillStyle = BODY[1]
      c.fill()
    }
  }
  border(0, 'down')
  border(h - band, 'up')

  // Body butis: alternating flowers and small mangos, plus scattered zari dots
  const top = band * 2.1
  const bottom = h - band * 2.1
  const palluX = clothW * 0.74
  for (let row = 0, y = top; y < bottom; y += 30, row++) {
    for (let x = row % 2 ? 26 : 8, col = 0; x < palluX - 20; x += 38, col++) {
      if ((row + col) % 3 === 0) mango(c, x, y, 9, 'rgba(201,164,92,0.75)', 'rgba(233,211,160,0.9)')
      else flower(c, x, y, 7, (row + col) % 2 ? 6 : 4, 'rgba(227,200,143,0.7)', BODY[0])
    }
  }
  for (let i = 0; i < (palluX * (bottom - top)) / 900; i++) {
    c.fillStyle = `rgba(233,211,160,${0.25 + Math.random() * 0.3})`
    c.fillRect(Math.random() * (palluX - 10), top + Math.random() * (bottom - top), 1.2, 1.2)
  }

  // Pallu: gold divider, a wide zari panel of peacock feathers and big mangos, then striped bands
  c.fillStyle = GOLD[1]
  c.fillRect(palluX, 0, 3, h)
  c.fillRect(palluX + 6, 0, 1.5, h)
  const panelX = palluX + 14
  const panelW = clothW * 0.12
  const pg = c.createLinearGradient(panelX, 0, panelX + panelW, 0)
  pg.addColorStop(0, GOLD[3]); pg.addColorStop(0.5, GOLD[2]); pg.addColorStop(1, GOLD[1])
  c.fillStyle = pg
  c.fillRect(panelX, band, panelW, h - band * 2)
  const step = Math.max(40, (h - band * 2) / 4)
  for (let y = band + step * 0.5, i = 0; y < h - band; y += step, i++) {
    if (i % 2) mango(c, panelX + panelW / 2, y, Math.min(panelW * 0.6, step * 0.55), BODY[1], BODY[3])
    else feather(c, panelX + panelW / 2, y - step * 0.2, Math.min(panelW * 0.7, step * 0.6))
  }
  for (let x = panelX + panelW + 8, i = 0; x < clothW - 4; x += i % 3 ? 12 : 24, i++) {
    c.fillStyle = i % 3 ? 'rgba(201,164,92,0.4)' : 'rgba(233,211,160,0.8)'
    c.fillRect(x, band, i % 3 ? 2.5 : 7, h - band * 2)
  }

  // Fringe: twisted tassels hanging off the free end
  for (let y = 3; y < h - 3; y += 5) {
    c.strokeStyle = y % 10 < 5 ? GOLD[1] : BODY[1]
    c.lineWidth = 1.6
    c.beginPath()
    c.moveTo(clothW, y)
    c.quadraticCurveTo(clothW + fringeW * 0.5, y + 2, clothW + fringeW - 4, y + 1)
    c.stroke()
    c.fillStyle = GOLD[2]
    c.beginPath(); c.arc(clothW + fringeW - 4, y + 1, 1.3, 0, Math.PI * 2); c.fill()
  }
  return tex
}

export default function SareeFlag({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let W, H, dpr, raf, visible = false
    let t = 0
    let last = performance.now()
    // Two drapes: an emerald one further back (smaller, slower, offset rhythm) and the maroon one in front
    const cloths = [
      { body: EMERALD, hFrac: 0.52, yFrac: 0.3, amp: 0.7, speed: 1.15, offset: 2.1, alpha: 0.55, tex: null, h: 0 },
      { body: MAROON, hFrac: 0.7, yFrac: 0.58, amp: 1, speed: 1.6, offset: 0, alpha: 1, tex: null, h: 0 },
    ]
    // Zari sparkles riding the wind, and long thread wisps
    const rand = (a, b) => a + Math.random() * (b - a)
    const sparks = Array.from({ length: 46 }, () => ({ x: Math.random(), y: Math.random(), r: rand(0.6, 1.8), v: rand(0.015, 0.05), tw: rand(0, Math.PI * 2) }))
    const wisps = Array.from({ length: 7 }, () => ({ x: Math.random(), y: rand(0.1, 0.9), len: rand(80, 220), v: rand(0.03, 0.07), amp: rand(4, 12), ph: rand(0, 6) }))

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas.clientWidth
      H = canvas.clientHeight
      if (!W || !H) return
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cloths.forEach((c) => {
        c.h = Math.round(H * c.hFrac)
        c.tex = paintSaree(W, c.h, dpr, c.body)
      })
      draw()
    }

    const drawCloth = (c) => {
      const yc = H * c.yFrac
      const slice = 2
      const amp = Math.min(30, H * 0.05) * c.amp
      ctx.globalAlpha = c.alpha
      for (let x = 0; x < W; x += slice) {
        const u = x / W
        const reach = 0.2 + 0.8 * u // anchored at the left, freer toward the pallu
        const phase = x * 0.012 - t * c.speed + c.offset
        const dy = amp * reach * (Math.sin(phase) + 0.35 * Math.sin(x * 0.031 - t * 2.3 + c.offset) + 0.12 * Math.sin(x * 0.07 - t * 3.1))
        const squash = 1 - 0.07 * reach * (1 + Math.cos(phase)) / 2
        const h = c.h * squash
        const y = yc - h / 2 + dy
        ctx.drawImage(c.tex, x * dpr, 0, slice * dpr, c.tex.height, x, y, slice + 0.5, h)
        // Fold shading with sharper creases: light on the crests, deep shadow in the troughs
        const k = Math.cos(phase + 0.6)
        const shade = Math.sign(k) * Math.pow(Math.abs(k), 1.6) * reach
        ctx.fillStyle = shade > 0 ? `rgba(255,236,200,${shade * 0.14})` : `rgba(0,0,0,${-shade * 0.45})`
        ctx.fillRect(x, y, slice + 0.5, h)
        // Gold rim light along the top and bottom edges where the cloth faces the light
        if (shade > 0.15) {
          ctx.fillStyle = `rgba(233,211,160,${shade * 0.5})`
          ctx.fillRect(x, y, slice + 0.5, 1)
          ctx.fillRect(x, y + h - 1, slice + 0.5, 1)
        }
      }
      ctx.globalAlpha = 1
    }

    const draw = () => {
      if (!cloths[0].tex) return
      ctx.clearRect(0, 0, W, H)
      cloths.forEach(drawCloth)
      // Zari glint: a soft band of light travelling across the cloth, kept to the fabric only
      const sweep = ((t * 0.12) % 1.6 - 0.3) * W
      const g = ctx.createLinearGradient(sweep - 160, 0, sweep + 160, H)
      g.addColorStop(0, 'rgba(255,230,180,0)')
      g.addColorStop(0.5, 'rgba(255,230,180,0.14)')
      g.addColorStop(1, 'rgba(255,230,180,0)')
      ctx.save()
      ctx.globalCompositeOperation = 'source-atop'
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)
      ctx.restore()
      // Wind: thin gold thread wisps and twinkling zari sparkles drifting left to right
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      wisps.forEach((w) => {
        const x0 = ((w.x + t * w.v) % 1.3 - 0.15) * W
        const y0 = w.y * H
        const grad = ctx.createLinearGradient(x0, 0, x0 + w.len, 0)
        grad.addColorStop(0, 'rgba(227,200,143,0)')
        grad.addColorStop(0.5, 'rgba(227,200,143,0.18)')
        grad.addColorStop(1, 'rgba(227,200,143,0)')
        ctx.strokeStyle = grad
        ctx.lineWidth = 1
        ctx.beginPath()
        for (let i = 0; i <= 12; i++) {
          const px = x0 + (w.len * i) / 12
          const py = y0 + Math.sin(px * 0.02 - t * 1.4 + w.ph) * w.amp
          i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)
        }
        ctx.stroke()
      })
      sparks.forEach((p) => {
        const x = ((p.x + t * p.v) % 1.05) * W
        const y = p.y * H + Math.sin(t * 0.9 + p.tw * 3) * 10
        const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2.4 + p.tw))
        ctx.fillStyle = `rgba(240,215,160,${a})`
        ctx.beginPath()
        ctx.arc(x, y, p.r, 0, Math.PI * 2)
        ctx.fill()
        if (p.r > 1.4) {
          // Four-point star glint on the larger sparkles
          ctx.fillRect(x - p.r * 2.5, y - 0.3, p.r * 5, 0.6)
          ctx.fillRect(x - 0.3, y - p.r * 2.5, 0.6, p.r * 5)
        }
      })
      ctx.restore()
    }

    const loop = (now) => {
      t += Math.min(0.05, (now - last) / 1000)
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
