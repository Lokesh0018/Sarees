// Copy and imagery for the home page sections below the hero.
// Edit wording here; the layout lives in src/sections/HomeSections.jsx.
import { imageUrl, pickImage } from '../utils/assets'

// Images live in src/assets/images
const IMG = (name) => imageUrl(`${name}.webp`)

// Scrolling band directly below the hero
export const MARQUEE = {
  label: 'What we offer',
  items: ['Pattu & Handloom Sarees', 'Bespoke Blouse Stitching', 'Designer Matchings', 'Shaper Petticoats', 'Ethnic Inners', 'Cotton Nighties', 'Temple & Kundan Jewellery', 'MVP Colony, Visakhapatnam'],
  // Second row, smaller, drifting the other way
  details: ['Kanchipuram', 'Gadwal', 'Uppada', 'Banarasi', 'Chanderi', 'Festive Organza', 'Pure Zari', 'Maggam Work', 'Aari & Zardosi', 'Kundan', 'Temple Jewellery', 'Muhurtham Drapes'],
}

export const INTRO = {
  eyebrow: 'Sanctuary of Sartorial Excellence',
  title: 'Where Tradition Meets',
  titleAccent: 'Timeless Elegance.',
  lead: 'Every collection at SJR – House of Collection tells an enduring story of sacred craftsmanship, bridal grandeur, and personal individuality. We bridge the timeless heritage of traditional Southern looms with discerning bespoke silhouettes.',
  body: 'From the ceremonial sanctity of royal wedding muhurthams to effortless celebratory evenings, our MVP Colony boutique provides women a private, elevated salon where heirloom silks, bespoke zardosi blouses, and handcrafted jewellery converge in complete harmony.',
  quote: '“A saree is not merely fabric; it is an intimate expression of grace, sculpted memory, and uncompromised dignity.”',
  quoteBy: '— The Master Draper • SJR Visakhapatnam',
  image: { src: IMG('intro-drape'), alt: 'A woman touching the gold zari border of a crimson and emerald handloom saree', position: '60% 40%' },
  stamp: {
    label: 'Authentic Craft',
    title: 'Hand-Spun Pure Silk',
    body: 'Certified genuine Andhra Pradesh & Kanchipuram weaves crafted by multi-generational master weavers.',
  },
  stats: [
    { value: '10,000+', label: 'Custom Brides Styled' },
    { value: '100%', label: 'Pure Certified Silk' },
    { value: 'Atelier', label: 'In-House Tailoring Lab' },
  ],
}

export const COLLECTIONS = {
  eyebrow: 'Curated Wardrobe Departments',
  eyebrowNote: '7 Specialty Lines',
  title: 'Explore Our Collections',
  lead: 'Discover bespoke pieces designed to elevate every celebratory layer—from bridal handlooms to refined inner comfort.',
  aside: 'Boutique Directory',
  // Card copy per category slug; categories without an entry fall back to their name and description.
  cards: {
    sarees: { label: 'Category 01 • Signature Line', title: 'Pattu, Handloom & Organza Sarees', body: 'Pure Kanchipuram, Gadwal, Uppada, Banarasi, and airy festive organzas woven with pure zari for bridal royalty.', cta: 'View Silk Registry', badge: '120+ Drapes in Store' },
    stitching: { label: 'Category 02 • Bespoke Tailoring', title: 'Bespoke Blouse Stitching', body: 'Custom princess-cut blouses, intricate aari and zardosi work, and precision tailoring.', cta: 'Book Tailoring' },
    matchings: { label: 'Category 03', title: 'Designer Matchings', body: 'Contrast dupattas, pure brocades & designer borders.', cta: 'Explore Fabrics' },
    petticoats: { label: 'Category 04', title: 'Shaper Petticoats', body: 'Mermaid shaper silhouettes, satin sheen & pure cottons.', cta: 'View Finishes' },
    inners: { label: 'Category 05', title: 'Ethnic Inners', body: 'Breathable, frictionless undergarments for heavy drapes.', cta: 'View Essentials' },
    nighties: { label: 'Category 06 • Everyday Luxury', title: 'Cotton & Modal Nighties', body: 'Ultra-soft 100% combed cottons, block prints, and breezy daily loungewear.', cta: 'Explore Loungewear' },
    'fancy-jewellery': { label: 'Category 07 • Adornments', title: 'Fancy Temple & Kundan Jewellery', body: 'Statement bridal chokers, gutta pusalu, guttalu haarams & waist odiyanams.', cta: 'View Adornments' },
  },
}

export const CRAFT = {
  eyebrow: 'The SJR Atelier Promise',
  title: 'Your Style.',
  titleAccent: 'Our Craft.',
  lead: 'A great ensemble does not end at purchasing a saree—it begins with the architectural perfection of tailoring, blouse sculpting, and fabric harmony.',
  pillars: [
    { icon: 'ruler', stat: '18', statLabel: 'Ergonomic measurements', title: 'Master Cut & Fitting', body: 'Every blouse pattern is individually drafted based on 18 ergonomic measurements to ensure no shoulder slips, perfect armhole comfort, and sculpted bust support.' },
    { icon: 'brush', stat: 'In-House', statLabel: 'Artisan karigars', title: 'Custom Maggam Work', body: 'In-house artisan karigars hand-embed genuine zari wires, kardana stones, freshwater pearls, and zardosi motifs reflecting the saree’s sacred pallu patterns.' },
    { icon: 'palette', stat: '400+', statLabel: 'Silk & cotton hues', title: 'Exact Shade Matching', body: 'Zero compromise on dyes. We stock over 400 silk and cotton hues in petticoats, lining fabrics, and contrast drapes for a seamless monolithic ensemble look.' },
    { icon: 'concierge', stat: 'Private', statLabel: 'Salon suite trials', title: 'Bridal Styling Concierge', body: 'Personal appointment-based trials in our private salon suite with jewellery pairing, pleat preparation, and bespoke muhurtham drape consultations.' },
  ],
  images: [
    { src: IMG('craft-pattern'), alt: 'Artisan hands drafting a blouse pattern with tailoring chalk and rulers on silk', position: '50% 50%', caption: 'Pattern Drafting' },
    { src: IMG('craft-embroidery'), alt: 'Gold zardosi being threaded into crimson silk on an embroidery frame', position: '50% 50%', caption: 'Zardosi Embroidery' },
    { src: IMG('craft-finished-blouse'), alt: 'A finished bridal blouse displayed with temple jewellery on an emerald silk cushion', position: '50% 55%', caption: 'The Finished Blouse' },
  ],
}

export const STORY = {
  eyebrow: 'Our Roots in Visakhapatnam',
  title: 'Crafted With Care.',
  titleAccent: 'Chosen With Love.',
  lead: 'Born out of a deep reverence for Andhra Pradesh’s rich textile legacy, SJR – House of Collection was established in MVP Colony, Visakhapatnam, as an ode to timeless feminine grace.',
  paragraphs: [
    'We recognized that brides and families spent weeks traveling between distant cities to source their muhurtham silks, search elsewhere for master maggam tailors, and scramble for matching inners and jewellery. SJR gathered all these essential crafts under one regal roof.',
    'Today, daughters walk into our salon with their mothers and grandmothers, choosing sarees that will be passed down for generations to come. When you wear SJR, you do not simply wear garments—you wear an enduring heritage of Indian handloom mastery.',
  ],
  facts: [
    { icon: 'pin', value: 'MVP Colony', label: 'Sector 2, Vizag' },
    { icon: 'crown', value: 'Bespoke', label: 'Bridal Sanctuary' },
    { icon: 'badge', value: 'Heirloom', label: 'Certified Silks' },
  ],
  image: { src: IMG('story-boutique'), alt: 'Interior of a boutique with emerald walls, warm gold lighting and wooden saree vitrines', position: '50% 50%' },
  inset: { src: IMG('gallery-loom'), alt: 'A master weaver working gold zari threads on a wooden pit loom', position: '70% 50%' },
  signature: 'SJR – House of Collection',
  vision: { label: 'The Founder’s Vision', quote: '“Every stitch must honor the hand that wove the thread, and every drape must glorify the woman who wears it.”' },
}

export const GALLERY = {
  eyebrow: 'Visual Chronicles',
  title: 'A Glimpse Into Our World',
  lead: 'Moments captured within our boutique, bridal celebrations across Andhra Pradesh, and the quiet dignity of the pit loom.',
  // span: columns out of 12 on desktop; tall rows are 420px, short rows 340px
  items: [
    { src: IMG('gallery-bride'), alt: 'A bride smiling during her wedding muhurtham in a mustard and vermillion silk saree', caption: 'Real Brides of SJR • Vizag', span: 5, tall: true, position: '20% 40%' },
    { src: IMG('gallery-jewellery-silk'), alt: 'Kundan earrings and a pearl choker against a deep emerald handloom drape', caption: 'Jewellery & Silk Pairing', span: 4, tall: true, position: '50% 50%' },
    { src: IMG('gallery-loom'), alt: 'A master weaver working gold zari threads on a wooden pit loom', caption: 'Artisan Loom Provenance', span: 3, tall: true, position: '70% 50%' },
    { src: IMG('gallery-threads'), alt: 'Hand-dyed silk threads and dupattas arranged by colour on a display table', caption: 'Color Spectrum Lab', span: 4, position: '50% 60%' },
    { src: IMG('gallery-trial-room'), alt: 'A private trial room with emerald velvet seating, a gilded mirror and saree hangers', caption: 'Private Bridal Salon', span: 4, position: '40% 50%' },
    { src: IMG('gallery-zardosi'), alt: 'Zardosi peacock embroidery in gold bullion thread on a blouse sleeve', caption: 'Maggam Handwork', span: 4, position: '50% 45%' },
  ],
}

export const VISIT = {
  eyebrow: 'Visakhapatnam Flagship',
  title: 'Visit Our Boutique',
  lead: 'Experience the weight of pure silks, consult our master tailors, and enjoy a private bridal draping session at MVP Colony.',
  parkingNote: '(Convenient parking available on-premises)',
  hoursNote: 'Open all 7 days for bridal consultations & fittings.',
  phoneNote: 'Instant response during boutique operating hours.',
  conciergeCta: 'WhatsApp Bridal Concierge',
  conciergeMessage: 'Hello SJR House of Collection, I would like to reserve a bridal consultation.',
  form: {
    title: 'Reserve Your Private Salon Session',
    lead: 'Dedicated stylist & master draper reserved exclusively for your family.',
    services: [
      'Bridal Kanchipuram Trousseau',
      'Bespoke Blouse Tailoring & Maggam',
      'Occasion Handloom Drape Selection',
      'Complete Saree Matching & Jewellery',
    ],
    submit: 'Confirm Reservation Request',
  },
}

export const FOOTER = {
  ribbon: ['Handwoven & Bespoke in Visakhapatnam', 'Regal Indian Couture'],
  concierge: {
    title: 'Client Concierge',
    // Each opens WhatsApp with a matching message (or Maps for directions).
    links: [
      { label: 'Bespoke Bridal Registry', topic: 'Bespoke bridal registry' },
      { label: 'Tailoring Consultation', topic: 'Tailoring consultation' },
      { label: 'Lookbook Catalogue', topic: 'Lookbook catalogue' },
      { label: 'Store Directions', directions: true },
      { label: 'Care & Zari Preservation', topic: 'Saree care and zari preservation' },
    ],
  },
  salon: {
    title: 'Private Salon Service',
    body: 'Reserve an exclusive consultation session with our master drapers and embroidery artisans.',
    cta: 'WhatsApp Bridal Concierge',
  },
  collectionLinks: [
    'Kanchipuram & Gadwal Sarees',
    'Uppada Handlooms',
    'Bridal Stitching & Zardosi Blouses',
    'Designer Matchings',
    'Pure Silk Petticoats',
    'Premium Inners & Nighties',
    'Fancy Temple Jewellery',
  ],
}

// ── Dedicated collection sections (between Collections and Craft) ─────────────────────────────────────────
// The four saree photos are stand-ins until the real ones are saved to src/assets/images as
// saree-kanchipuram, saree-gadwal, saree-banarasi and saree-organza (.webp / .jpg / .png). They take over automatically.
const PREFER = (name, fallback) => pickImage(name, fallback)

export const SAREES = {
  id: 'collection-sarees',
  eyebrow: 'Heritage Silk Registry',
  note: '100% Silk Mark Certified',
  title: 'Pattu, Handloom & Fancy Sarees',
  lead: 'Hand-selected heirloom weaves crafted by generational master artisans across Kanchipuram, Gadwal, Uppada, and Banaras.',
  cta: { label: 'Enquire Collection', message: 'Hi SJR House of Collection, I would like to view your Pattu and Handloom Saree catalogue.' },
  items: [
    { image: PREFER('saree-kanchipuram', 'cat-sarees'), alt: 'Pure Kanchipuram Pattu Saree with pure zari brocade and temple border', badge: 'Silk Mark Certified', label: 'Kanchipuram Heritage', title: 'Pure Kanchipuram Pattu', body: 'Heavy 3-ply mulberry silk with 2-gram tested gold zari korvai border.', status: 'Bridal Masterpiece', message: 'Interested in Pure Kanchipuram Bridal Pattu' },
    { image: PREFER('saree-gadwal', 'arrival-emerald-gadwal'), alt: 'Pure Gadwal Silk Handloom Saree with kuttu interlocking zari pallu', badge: 'Handloom Guild', label: 'Gadwal Atelier', title: 'Pure Gadwal Sico & Silk', body: 'Featherweight cotton body seamlessly woven into rich pure silk zari borders.', status: 'Kuttu Technique', message: 'Interested in Pure Gadwal Sico and Silk' },
    { image: PREFER('saree-banarasi', 'arrival-crimson-kanchipuram'), alt: 'Banarasi Katan Brocade silk saree with intricate floral kadwa weaves', badge: 'Katan Silk', label: 'Banaras Weaves', title: 'Banarasi Katan Brocade', body: 'Regal kadwa floral jaal motifs woven in antique silver and sona-rupa zari.', status: 'Festive Royal', message: 'Interested in Banarasi Katan Brocade' },
    { image: PREFER('saree-organza', 'arrival-chanderi-floral'), alt: 'Sheer Tissue Organza Festive Saree with delicate scalloped cutwork and resham embroidery', badge: 'Contemporary Chic', label: 'Festive Delight', title: 'Sheer Tissue Organza', body: 'Airy pure organza enhanced with scalloped zari borders and pastel undertones.', status: 'Light & Ethereal', message: 'Interested in Sheer Tissue Organza Saree' },
  ],
  cardCta: 'Reserve Drape',
}

export const STITCHING = {
  id: 'collection-stitching',
  image: { src: IMG('cat-stitching'), alt: 'Bespoke maggam embroidery artisan handcrafting a bridal blouse with golden zardosi on a frame', position: '60% 50%' },
  caption: { label: 'Bespoke Atelier', title: 'Master Maggam & Aari Craft', body: 'Precision cut, genuine zardosi, French knot detailing, and 18-point anatomic blouse tailoring.' },
  eyebrow: 'In-House Tailoring Atelier',
  title: 'Bespoke Stitching &',
  titleAccent: 'Custom Maggam Work.',
  lead: 'A bridal saree achieves its true magnificence only when complemented by a tailor-made blouse that fits like a second skin. Our master pattern makers sculpt neckline curves, sleeve aesthetics, and back backdrops with mathematical accuracy.',
  features: [
    { icon: 'ruler', title: '18-Point Fitting Formula', body: 'Zero shoulder droop, seamless underarm ease, and custom bust cups.' },
    { icon: 'sparkles', title: 'Heirloom Zardosi Work', body: 'Pure metallic bullion wires, seed pearls, and pallu-matched motifs.' },
    { icon: 'clock', title: 'Express Bridal Timelines', body: 'Priority stitching schedules tailored for tight wedding itineraries.' },
    { icon: 'check', title: 'Perfect Trial Guarantee', body: 'Private trial salon with on-the-spot master adjustments before hand-off.' },
  ],
  primary: { label: 'Book Tailoring Consultation', message: 'Hello SJR House of Collection, I would like to book a blouse stitching and maggam appointment.' },
  secondary: { label: 'WhatsApp Lookbook', message: 'Hi, please share Maggam work patterns and pricing.' },
}

export const MATCHINGS = {
  id: 'collection-matchings',
  eyebrow: 'Perfect Tone Synchronization',
  title: 'Designer Matchings & Lining Fabrics',
  lead: 'Over 400 meticulously dyed tones ensuring an exact, seamless colour match for pure silks, sheer georgettes, and heavy bridal borders.',
  items: [
    { icon: 'texture', image: IMG('gallery-threads'), alt: 'Spools of silk thread and folded lining fabrics laid out by shade on a wooden counter', position: '50% 62%', label: 'Breathable Durability', title: '2x2 Pure Cotton Linings', body: 'Pre-shrunk, color-fast, ultra-absorbent 2x2 fine combed cotton linings that preserve luxury silk fabrics against sweat and tension while offering featherweight comfort.', note: '400+ Available Shades', message: 'Enquiring about 2x2 Cotton Linings Matchings' },
    { icon: 'layers', image: IMG('featured-zari-detail'), alt: 'Close-up of a gold zari brocade border with a peacock motif on bottle-green raw silk', position: '55% 50%', label: 'Textured Lustre', title: 'Raw Silk & Brocades', body: 'Contrast raw silk fabrics, authentic Banarasi brocades, and lustrous tissue fabrics curated for contrast sleeves, borders, and designer blouse backs.', note: 'By Meter & Pre-Cut Bits', message: 'Enquiring about Contrast Raw Silk and Brocade' },
    { icon: 'ribbon', image: IMG('cat-matchings'), alt: 'Sheer pastel organza and silk dupattas hanging on a boutique rail beside brocade bundles', position: '72% 50%', label: 'Drape Accents', title: 'Organza & Silk Dupattas', body: 'Embellished scalloped dupattas, banarasi weaves, and lightweight organza veils tailored for double-drape bridal ceremonies and festive ensembles.', note: 'Bespoke Embroidery', message: 'Enquiring about Designer Dupattas' },
  ],
  cardCta: 'Match Shade',
  // Shade card under the header: a sample of the dyed tones kept in-house
  shades: {
    label: 'From the shade card',
    note: 'Explore 400+ tones',
    swatches: [
      { name: 'Kumkum Red', hex: '#9B1B30' }, { name: 'Maroon', hex: '#5E1224' }, { name: 'Rani Pink', hex: '#C2185B' }, { name: 'Onion Pink', hex: '#D89AA0' },
      { name: 'Peach', hex: '#E8A27C' }, { name: 'Turmeric', hex: '#D9A21B' }, { name: 'Mustard', hex: '#B8860B' }, { name: 'Parrot Green', hex: '#6B9E2E' },
      { name: 'Bottle Green', hex: '#0F4D3A' }, { name: 'Peacock Blue', hex: '#0E6E73' }, { name: 'Royal Blue', hex: '#1F3C88' }, { name: 'Navy', hex: '#1A2340' },
      { name: 'Lavender', hex: '#9C8AC4' }, { name: 'Ivory', hex: '#F1E6D2' }, { name: 'Antique Gold', hex: '#B08A45' }, { name: 'Black', hex: '#141414' },
    ],
  },
}

export const PETTICOATS = {
  id: 'collection-petticoats',
  eyebrow: 'Structure & Silhouette',
  note: 'Comfort Sculpting',
  title: 'Shaper Petticoats & Underskirts',
  lead: 'Engineered underskirts and 4-way stretch mermaid shapers designed to hold heavy drapes securely without bulkiness.',
  aside: 'Sizes XS to 3XL',
  items: [
    {
      image: IMG('petticoat-mermaid'), alt: 'Seamless Mermaid Saree Shaper in deep emerald on mannequin', position: '50% 30%',
      badge: '4-Way Sculpt • Seamless Contour', label: 'Signature Draping', spec: 'XS – 3XL | 28+ Shades', code: 'SIR-SHP-01',
      title: 'Mermaid Saree Shaper',
      body: 'Engineered 4-way micro-stretch fabric that hugs the waist and thighs while flaring at the calf for effortless walking and flawless pleat fall.',
      points: ['Targeted compression waistband & tummy contour', 'Side walking slit for completely free movement', 'Zero-chafing breathable moisture-wicking weave', 'Heavy drawcord holds dense bridal Kanchi silks securely'],
      note: 'Available in Boutique', message: 'I am looking for a Mermaid Saree Shaper',
    },
    {
      image: IMG('petticoat-satin'), alt: 'Pure Satin Silk Underskirt in champagne gold on mannequin', position: '50% 30%',
      badge: 'Fluid Sheen • Luminous Fall', label: 'Lustrous Gloss', spec: 'Free Size | 32+ Hues', code: 'SIR-SAT-02',
      title: 'Pure Satin Underskirt',
      body: 'Ultra-luxurious heavyweight duchess satin crafted to prevent see-through visibility beneath diaphanous organzas, chiffons, and delicate tissue silks.',
      points: ['Zero cling, high-density anti-static fluid weave', 'Wide flared hemline for circular pleated movement', 'Dual side zip closure with secure drawstring hold', 'Tailored lining prevents fabric fraying under friction'],
      note: 'Available in Boutique', message: 'I am looking for a Pure Satin Underskirt',
    },
    {
      image: IMG('petticoat-cotton'), alt: 'Pure Cotton 6-Panel Drawstring Petticoat in maroon on mannequin', position: '50% 30%',
      badge: 'Bridal Heavy Support • 6-Panel Cut', label: 'Classic Tradition', spec: 'Custom Lengths | 45+ Tones', code: 'SIR-COT-03',
      title: 'Pure Cotton Drawstring Skirt',
      body: 'Traditional 6-panel silhouette tailored from 100% fine combed poplin cotton, reinforced with interlocking double seams to support dense 2kg bridal pattu sarees.',
      points: ['100% pre-shrunk, skin-friendly combed cotton', 'Wide woven drawcord ribbon prevents waist pinching', 'Tailored 6-panel A-line flare ensures free stride', 'Reinforced bottom hemline for firm pleat foundation'],
      note: 'Available in Boutique', message: 'I am looking for a Pure Cotton Drawstring Petticoat',
    },
  ],
  cardCta: 'Reserve Drape',
}

export const INNERS = {
  id: 'collection-inners',
  eyebrow: 'Intimate Comfort Foundations',
  note: 'Day-Long Bridal Wear',
  title: 'Ethnic Inners & Intimate Essentials',
  lead: 'Curated foundations engineered for Indian festive drapes: zero show-through, friction-free movement, and supreme breathability under heavy bridal regalia.',
  image: { src: IMG('cat-inners'), alt: 'Ivory gift boxes of intimate essentials tied with gold satin ribbon on a boutique counter', position: '50% 55%' },
  promises: ['Zero Show-Through', 'Friction-Free', 'Breathable All Day'],
  privacy: 'Discreet fitting help and plain packaging, always.',
  cta: { label: 'Ask Privately on WhatsApp', message: 'Hello SJR House of Collection, I would like help choosing inners and intimate essentials for my saree.' },
  items: [
    { icon: 'shirt', title: 'Modal Full Slips', body: 'Ultra-soft, antibacterial modal slips that glide smoothly beneath transparent Kurtis, Anarkalis, and sheer georgettes.', note: 'Sizes: S – 3XL' },
    { icon: 'shield', title: 'Anti-Chafing Thigh Guards', body: 'Seamless breathable microfiber shorts preventing thigh rubbing and chafing during long muhurtham ceremonies.', note: 'Moisture-Wicking Tech' },
    { icon: 'cups', title: 'Blouse Foam Cups & Pads', body: 'High-density Italian molded contour cups in tear-drop and round shapes for seamless backless and deep-neck blouses.', note: 'Sizes 30 to 44' },
    { icon: 'flower', title: 'Pure Cotton Camisoles', body: 'Adjustable-strap fine cotton camisoles and tube tops tailored with discreet side darts for spotless festive silhouettes.', note: 'Neutral Nude & Skin Tones' },
  ],
}

export const NIGHTIES = {
  id: 'collection-nighties',
  eyebrow: 'Everyday Tranquillity',
  title: 'Cotton & Modal Nighties',
  titleAccent: '& Bespoke Loungewear.',
  lead: 'Indulge in breathable natural fibers designed for restorative rest and quiet home elegance. Our loungewear collection blends traditional Indian handblock prints with breezy, relaxed modern silhouettes.',
  features: [
    { icon: 'blossom', title: 'Jaipuri Handblock Pure Cotton Gowns', body: '100% combed cotton, authentic floral block motifs, and non-shrink guaranteed color dyes.' },
    { icon: 'waves', title: 'Flowy Modal & Rayon Caftans', body: 'Lustrous featherlight drape with adjustable waist tassels, ideal for warm coastal evenings in Vizag.' },
    { icon: 'zip', title: 'Maternity & Concealed Feeding Zippers', body: 'Thoughtfully integrated invisible side and front zippers designed for new mothers without sacrificing elegance.' },
  ],
  cta: { label: 'Request Nightwear Catalogue', message: 'Please send photos of available Cotton and Modal Nighties' },
  image: { src: IMG('cat-nighties'), alt: 'Soft handblock printed pure cotton nightwear on a wooden rack with warm ambient lighting', position: '55% 50%' },
}

export const JEWELLERY = {
  id: 'collection-jewellery',
  eyebrow: 'Sacred Adornments',
  title: 'Fancy Temple & Kundan Jewellery',
  lead: 'Regal South Indian antique matte gold finish, uncut polki stones, guttapusalu pearls, and bridal waistbands matched precisely to your saree zari.',
  items: [
    { image: IMG('jewellery-lakshmi-choker'), alt: 'Lakshmi Temple Choker Suite on dark emerald silk bust', badge: 'Antique Matte Gold', label: 'Choker Suite', title: 'Lakshmi Temple Choker', body: 'Repoussé temple idol motif with rubies, emerald cabochons & matching jhumkas.', note: 'With Matching Earrings', message: 'Enquiry for Lakshmi Temple Choker' },
    { image: IMG('jewellery-gutta-pusalu-haaram'), alt: 'Royal Gutta Pusalu Haram set displayed on dark emerald silk bust', badge: 'Pearl Clusters', label: 'Long Haaram', title: 'Royal Gutta Pusalu Haaram', body: 'Centuries-old Nizam-inspired cluster pearl fringes woven on hand-engraved gold.', note: 'Heritage Wedding Classic', message: 'Enquiry for Gutta Pusalu Haaram' },
    { image: IMG('jewellery-nakshi-vaddanam'), alt: 'Antique handcrafted Nakshi Vaddanam temple gold waist belt on dark emerald bust', badge: 'Bridal Waistbelt', label: 'Oddiyanam Accent', title: 'Nakshi Vaddanam Belt', body: 'Sculpted peacock and floral motifs with adjustable belt chain for snug saree tucking.', note: 'Adjustable Fit', message: 'Enquiry for Nakshi Vaddanam Waist Belt' },
    { image: IMG('jewellery-maang-tikka-jada-billalu'), alt: 'Temple Maang Tikka and matching Jada Billalu hair ornaments on rich emerald green velvet display', badge: 'Hair & Forehead Set', label: 'Bridal Accents', title: 'Maang Tikka & Jada Billalu', body: 'Nine-piece traditional braid jewellery set complete with sun-moon tikkas.', note: 'Full 9-Piece Set', message: 'Enquiry for Maang Tikka and Jada Billalu' },
  ],
  cardCta: 'Enquire',
}

