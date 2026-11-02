import { useEffect, useRef } from 'react'

// Silk saree ribbons drifting on the breeze: each ribbon follows a wavy centre line across the canvas and twists as it
// goes, flipping between its front colour and a lighter underside. Gold zari runs along both edges, butis dot the centre,
// and zari sparkles float around them. Runs only while on screen; prefers-reduced-motion gets a single still frame.

const RIBBONS = [
  // front / back colours, centre height (0–1 of canvas), width px, wave amplitude, speeds and twist rate
  { front: '#5A1830', back: '#8A3350', y: 0.32, w: 70, amp: 0.16, speed: 0.55, freq: 0.0042, twist: 0.0055, ph: 0 },
  { front: '#1D5446', back: '#3C7E6B', y: 0.62, w: 58, amp: 0.14, speed: 0.42, freq: 0.0036, twist: 0.0048, ph: 2.2 },
  { front: '#A51E5A', back: '#D25A8C', y: 0.18, w: 40, amp: 0.1, speed: 0.7, freq: 0.0058, twist: 0.0072, ph: 4.1 },
  { front: '#B07A12', back: '#E2B84A', y: 0.82, w: 46, amp: 0.1, speed: 0.6, freq: 0.0049, twist: 0.0064, ph: 1.3 },
]
const ZARI = 'rgba(233,211,160,'

export default function SareeRibbons({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let W, H, dpr, raf, visible = false
    let t = 0
    let last = performance.now()
    const rand = (a, b) => a + Math.random() * (b - a)
    const sparks = Array.from({ length: 40 }, () => ({ x: Math.random(), y: Math.random(), r: rand(0.6, 1.7), v: rand(0.012, 0.04), tw: rand(0, 6.3) }))

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas.clientWidth
      H = canvas.clientHeight
      if (!W || !H) return
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw()
    }

    // Centre line, direction normal and twist for a ribbon at horizontal position x
    const sample = (r, x) => {
      const yc = H * r.y + H * r.amp * (Math.sin(x * r.freq - t * r.speed + r.ph) + 0.4 * Math.sin(x * r.freq * 2.3 - t * r.speed * 1.6 + r.ph * 1.7))
      const twist = Math.cos(x * r.twist - t * r.speed * 0.8 + r.ph)
      return { yc, twist }
    }

    const drawRibbon = (r) => {
      const step = 6
      const scale = Math.min(1, H / 360) // slimmer ribbons on short footers
      const half = (r.w * scale) / 2
      let prev = null
      for (let x = -40; x <= W + 40; x += step) {
        const s = sample(r, x)
        // Normal from the slope so the ribbon keeps its width around curves
        const s2 = sample(r, x + 1)
        const dx = 1, dy = s2.yc - s.yc
        const len = Math.hypot(dx, dy)
        const nx = -dy / len, ny = dx / len
        const hw = half * Math.max(0.06, Math.abs(s.twist))
        const cur = { x, y: s.yc, nx, ny, hw, twist: s.twist }
        if (prev) {
          const face = (prev.twist + cur.twist) / 2
          const light = Math.abs(face)
          // Quad between the previous and current cross-sections
          const ax = prev.x + prev.nx * prev.hw, ay = prev.y + prev.ny * prev.hw
          const bx = cur.x + cur.nx * cur.hw, by = cur.y + cur.ny * cur.hw
          const cx = cur.x - cur.nx * cur.hw, cy = cur.y - cur.ny * cur.hw
          const ex = prev.x - prev.nx * prev.hw, ey = prev.y - prev.ny * prev.hw
          ctx.beginPath()
          ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(cx, cy); ctx.lineTo(ex, ey); ctx.closePath()
          ctx.fillStyle = face >= 0 ? r.front : r.back
          ctx.fill()
          // Shade by how square the ribbon faces the viewer, plus a silk sheen near the turn
          ctx.fillStyle = `rgba(0,0,0,${0.5 * (1 - light)})`
          ctx.fill()
          if (light > 0.85) {
            ctx.fillStyle = `rgba(255,235,205,${(light - 0.85) * 0.9})`
            ctx.fill()
          }
          // Zari borders along both edges (thicker where the ribbon is wide open)
          const bw = Math.max(0.6, 3.2 * light * scale)
          ctx.strokeStyle = `${ZARI}${0.35 + 0.55 * light})`
          ctx.lineWidth = bw
          ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(cx, cy); ctx.stroke()
          // Inner fine zari line
          if (light > 0.3) {
            const k = 0.72
            ctx.strokeStyle = `${ZARI}${0.25 * light})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(prev.x + prev.nx * prev.hw * k, prev.y + prev.ny * prev.hw * k)
            ctx.lineTo(cur.x + cur.nx * cur.hw * k, cur.y + cur.ny * cur.hw * k)
            ctx.moveTo(prev.x - prev.nx * prev.hw * k, prev.y - prev.ny * prev.hw * k)
            ctx.lineTo(cur.x - cur.nx * cur.hw * k, cur.y - cur.ny * cur.hw * k)
            ctx.stroke()
          }
          // Butis along the centre on the front face
          if (face > 0.55 && Math.round(x / step) % 5 === 0) {
            ctx.fillStyle = `${ZARI}${0.75 * light})`
            ctx.beginPath()
            ctx.ellipse(cur.x, cur.y, 2.4 * scale + 0.6, 1.6 * scale * light + 0.4, Math.atan2(dy, dx), 0, Math.PI * 2)
            ctx.fill()
          }
        }
        prev = cur
      }
    }

    const draw = () => {
      if (!W) return
      ctx.clearRect(0, 0, W, H)
      RIBBONS.forEach(drawRibbon)
      // Zari sparkles drifting with the breeze
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      sparks.forEach((p) => {
        const x = ((p.x + t * p.v) % 1.05) * W
        const y = p.y * H + Math.sin(t * 0.9 + p.tw * 3) * 10
        const a = 0.2 + 0.5 * (0.5 + 0.5 * Math.sin(t * 2.4 + p.tw))
        ctx.fillStyle = `rgba(240,215,160,${a})`
        ctx.beginPath()
        ctx.arc(x, y, p.r, 0, Math.PI * 2)
        ctx.fill()
        if (p.r > 1.4) {
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
