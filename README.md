# SJR – House of Collection · Website

Boutique website for **SJR – House of Collection**, Plot No. 69, Sector-2, MVP Colony, Visakhapatnam.
*Your Style • Our Craft*

React 19 · Vite 8 · Tailwind CSS 4 · GSAP + ScrollTrigger · Lucide

The site is a **single page**: the home page, with header links that scroll to its sections
(`#collections`, `#craft`, `#about`, `#visit`). Enquiries go to WhatsApp.

This is a **frontend-only** site. All content comes from JSON files in `public/data/`, loaded through one service
layer (`src/services/`), so a REST API can replace the files later without touching the components.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # regenerates sitemap.xml + robots.txt, then builds to dist/
npm run preview    # serve the production build locally
```

Copy `.env.example` to `.env` and set `VITE_SITE_URL` to the live domain before building. It is used for
canonical URLs, Open Graph tags and the sitemap.

| Variable | Purpose | Example |
|---|---|---|
| `VITE_SITE_URL` | Public site URL, no trailing slash | `https://www.sjrhouseofcollection.in` |
| `VITE_DATA_BASE_URL` | Where catalogue JSON is served from | `/data` (default) or `https://api.example.com/public` |

---

## Managing content

The wording of the home page sections below the hero (intro, collection cards, featured piece, craft pillars,
brand story, gallery, visit, footer) lives in `src/content/home.js`. Their images are WebP files in
`public/media/home/`.

Edit the files in `public/data/`. A static deploy only needs the edited file re-uploaded; no rebuild is required


| File | Contents |
|---|---|
| `settings.json` | Store name, tagline, phone, WhatsApp, address, Maps link, opening hours, social links, logo, hero text/video, promo banners, footer text |
| `categories.json` | Categories: name, slug, description, image, order, `isActive`, subcategories |
| `products.json` | Products (see fields below) |

**Product fields:** `id`, `slug`, `name`, `productCode`, `categorySlug`, `subcategorySlug`, `description`,
`price` (or `null` to hide), `availability` (`in_stock` · `on_request` · `out_of_stock`), `isFeatured`,
`isNewArrival`, `isPublished`, `archived`, `displayOrder`, `createdAt`, and `images`:

```json
"images": [
  { "url": "/media/products/emerald-saree-1.webp", "alt": "Emerald silk saree with gold zari border", "isPrimary": true, "displayOrder": 1, "width": 900, "height": 1200 },
  { "url": "/media/products/emerald-saree-2.webp", "alt": "Pallu detail", "displayOrder": 2 }
]
```

The second image appears on hover in product cards. Use **3:4 portrait WebP** images, about 900×1200.
Products and categories without photos show a woven textile pattern instead.

### Sample products
All 16 products in `products.json` are **samples** (`"sample": true`), including the four shown under
New Arrivals. Remove them all with:

```bash
npm run remove-samples
```

### Hero video
The hero background plays a **boomerang** cut of `src/assets/videos/hero.mp4` (the 10 s master). The clip runs
forward, then in reverse, and repeats with no visible jump. It is pre-rendered so a plain native `loop` plays
smoothly; browsers cannot play video backwards smoothly on their own.

| File | Use |
|---|---|
| `public/media/hero.webm` | VP9 1080p, desktop (primary) |
| `public/media/hero-720.webm` | VP9 720p, screens up to 767 px |
| `public/media/hero.mp4` | H.264 1080p fallback for browsers without WebM |
| `public/media/hero-poster.webp` | First frame, shown while loading and for reduced-motion visitors |

The video is muted, has no audio track, and pauses when scrolled out of view. To replace it, put the new master at
`src/assets/videos/hero.mp4` and regenerate (set `N` to the master's frame count):

```bash
N=239
FC="[0:v]split[a][b];[b]reverse,trim=start_frame=1:end_frame=$((N-1)),setpts=PTS-STARTPTS[r];[a][r]concat=n=2:v=1:a=0,format=yuv420p[v]"
ffmpeg -i src/assets/videos/hero.mp4 -filter_complex "$FC" -map "[v]" -an -c:v libvpx-vp9 -crf 33 -b:v 0 -row-mt 1 public/media/hero.webm
ffmpeg -i src/assets/videos/hero.mp4 -filter_complex "$FC;[v]scale=1280:-2[s]" -map "[s]" -an -c:v libvpx-vp9 -crf 35 -b:v 0 -row-mt 1 public/media/hero-720.webm
ffmpeg -i src/assets/videos/hero.mp4 -filter_complex "$FC" -map "[v]" -an -c:v libx264 -preset slow -crf 27 -movflags +faststart public/media/hero.mp4
ffmpeg -i src/assets/videos/hero.mp4 -frames:v 1 -c:v libwebp -quality 80 public/media/hero-poster.webp
```

### Opening hours & social links
Both are empty until confirmed. Set them in `settings.json`:

```json
"hours": [{ "days": "Mon – Sat", "time": "10:00 AM – 9:00 PM" }],
"social": { "instagram": "https://instagram.com/…", "facebook": "", "youtube": "" }
```

### Map
`maps.query` drives the directions link. For an exact pin, paste the shop's Google Maps share link into `maps.placeUrl`.

---

## Project structure

```
public/
  brand/          SJR logo (WebP), favicon, touch icon, Open Graph image
  data/           settings / categories / products JSON
  media/          hero video (WebM/MP4 boomerang), poster; home/ holds the section images (WebP)
  .htaccess       index.html fallback, security and cache headers (Apache / Hostinger)
scripts/          sitemap generator, sample-data remover
src/
  components/     Logo, WhatsAppIcon
  config/         site URL, fallback business details
  content/        home.js: copy for the sections below the hero
  context/        StoreContext (settings + categories)
  hooks/          useAsync, useSeo, useMedia
  layouts/        SiteLayout, Header, Footer
  pages/          Home (the only page)
  sections/       Hero (video + logo reveal), home page sections
  services/       api.js (data fetch + cache), catalog.js (featured / new arrivals)
  styles/         Tailwind theme + design tokens
  utils/          contact.js (WhatsApp / tel / maps), motion.js (GSAP reveals)
```

---

## Deploying to Hostinger (or any static host)

1. Set `VITE_SITE_URL` in `.env`, then `npm run build`.
2. Upload the **contents** of `dist/` to `public_html/` (`.htaccess` is included).
3. Enable SSL (hPanel → Security → SSL) and force HTTPS.
4. Submit `https://your-domain/sitemap.xml` in Google Search Console.

On Netlify, Vercel or Cloudflare Pages, use build command `npm run build` and output directory `dist`.

---

## Notes

- WhatsApp enquiries open `wa.me/919052122474` with a pre-filled, URL-encoded message. The site never claims a
  message was sent; the visitor sends it from WhatsApp.
- Reduced-motion visitors see the still poster instead of the moving video.
