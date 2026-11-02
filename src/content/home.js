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

export const FEATURED = {
  ribbon: 'Featured Masterpiece Repository',
  code: 'Collection Code: #SJR-PAT-804',
  title: 'Elegance In Every',
  titleAccent: 'Sacred Drape.',
  body: 'Hand-spun on centuries-old pit looms in the heart of Tamil Nadu and Andhra craft colonies, this masterpiece marries unadulterated mulberry silk with 2-gram tested gold zari. Its temple korvai border takes over 180 hours of meticulous hand-interlocking by two master weavers.',
  image: { src: IMG('featured-drape'), alt: 'A model in a rani pink and emerald bridal Kanchipuram silk saree with a heavy gold brocade pallu', position: '50% 30%' },
  detail: { src: IMG('featured-zari-detail'), alt: 'Close-up of gold zari woven into emerald silk with peacock motifs', caption: '2gm Gold Zari Detail' },
  seal: { label: 'Authentic Loom', title: 'Kanchipuram Royal Varam', note: 'Certified Silk Mark' },
  specs: [
    { label: 'Weave Architecture', value: 'Double Warp Pure Kanchi Pattu' },
    { label: 'Zari Composition', value: 'Tested 2-Gram Gold & Silver Zari', tone: 'gold' },
    { label: 'Loom Provenance', value: 'Kanchipuram Heritage Guild' },
    { label: 'Blouse Piece', value: 'Matching Brocade with Sleeve Zari', tone: 'sage' },
  ],
  enquiry: 'Hello SJR House of Collection, I am interested in Featured Bridal Saree SJR-PAT-804',
  trialEnquiry: 'Hello SJR House of Collection, I would like to book a boutique private trial for Featured Bridal Saree SJR-PAT-804',
}

export const ARRIVALS = {
  eyebrow: 'Curated for the Festive Season',
  title: 'New Arrivals',
  lead: 'Fresh from the artisan looms of South India into our MVP Colony vitrines.',
  // Filter chips match a product's `tags` in products.json.
  filters: [
    { label: 'All Drapes', tag: null },
    { label: 'Gadwal', tag: 'gadwal' },
    { label: 'Kanchipuram', tag: 'kanchipuram' },
    { label: 'Blouses', tag: 'blouses' },
  ],
  banner: {
    title: 'Seeking a Specific Saree Colour Palette or Budget?',
    body: 'Our boutique stylists send bespoke video walkthroughs of newly unboxed sarees daily.',
    cta: 'Request Digital Lookbook',
    message: 'Hi SJR Boutique, please share your latest arrivals catalogue.',
  },
}

export const CRAFT = {
  eyebrow: 'The SJR Atelier Promise',
  title: 'Your Style. Our Craft.',
  lead: 'A great ensemble does not end at purchasing a saree—it begins with the architectural perfection of tailoring, blouse sculpting, and fabric harmony.',
  pillars: [
    { icon: 'ruler', title: 'Master Cut & Fitting', body: 'Every blouse pattern is individually drafted based on 18 ergonomic measurements to ensure no shoulder slips, perfect armhole comfort, and sculpted bust support.' },
    { icon: 'brush', title: 'Custom Maggam Work', body: 'In-house artisan karigars hand-embed genuine zari wires, kardana stones, freshwater pearls, and zardosi motifs reflecting the saree’s sacred pallu patterns.' },
    { icon: 'palette', title: 'Exact Shade Matching', body: 'Zero compromise on dyes. We stock over 400 silk and cotton hues in petticoats, lining fabrics, and contrast drapes for a seamless monolithic ensemble look.' },
    { icon: 'concierge', title: 'Bridal Styling Concierge', body: 'Personal appointment-based trials in our private salon suite with jewellery pairing, pleat preparation, and bespoke muhurtham drape consultations.' },
  ],
  images: [
    { src: IMG('craft-pattern'), alt: 'Artisan hands drafting a blouse pattern with tailoring chalk and rulers on silk', position: '50% 50%' },
    { src: IMG('craft-embroidery'), alt: 'Gold zardosi being threaded into crimson silk on an embroidery frame', position: '50% 50%' },
    { src: IMG('craft-finished-blouse'), alt: 'A finished bridal blouse displayed with temple jewellery on an emerald silk cushion', position: '50% 55%' },
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
    { value: 'MVP Colony', label: 'Sector 2, Vizag' },
    { value: 'Bespoke', label: 'Bridal Sanctuary' },
    { value: 'Heirloom', label: 'Certified Silks' },
  ],
  image: { src: IMG('story-boutique'), alt: 'Interior of a boutique with emerald walls, warm gold lighting and wooden saree vitrines', position: '50% 50%' },
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

// ── Dedicated collection sections (between Collections and Featured) ─────────────────────────────────────────
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
    { icon: 'texture', label: 'Breathable Durability', title: '2x2 Pure Cotton Linings', body: 'Pre-shrunk, color-fast, ultra-absorbent 2x2 fine combed cotton linings that preserve luxury silk fabrics against sweat and tension while offering featherweight comfort.', note: '400+ Available Shades', message: 'Enquiring about 2x2 Cotton Linings Matchings' },
    { icon: 'layers', label: 'Textured Lustre', title: 'Raw Silk & Brocades', body: 'Contrast raw silk fabrics, authentic Banarasi brocades, and lustrous tissue fabrics curated for contrast sleeves, borders, and designer blouse backs.', note: 'By Meter & Pre-Cut Bits', message: 'Enquiring about Contrast Raw Silk and Brocade' },
    { icon: 'ribbon', label: 'Drape Accents', title: 'Organza & Silk Dupattas', body: 'Embellished scalloped dupattas, banarasi weaves, and lightweight organza veils tailored for double-drape bridal ceremonies and festive ensembles.', note: 'Bespoke Embroidery', message: 'Enquiring about Designer Dupattas' },
  ],
  cardCta: 'Match Shade',
}

export const PETTICOATS = {
  id: 'collection-petticoats',
  eyebrow: 'Structure & Silhouette',
  note: 'Comfort Sculpting',
  title: 'Shaper Petticoats & Underskirts',
  lead: 'Engineered underskirts and 4-way stretch mermaid shapers designed to hold heavy drapes securely without bulkiness.',
  aside: 'Sizes XS to 3XL',
  items: [
    { label: 'Signature Draping', title: 'Mermaid Saree Shaper', body: 'Four-way micro-stretch fabric that hugs the hips and thighs while flaring at the hem for effortless walking and flawless pleat fall.', points: ['Targeted compression & tummy control', 'Side slit for unrestricted movement', 'Sturdy drawcord supports heavy Kanchi silks'], note: 'Available in 28+ Colours', message: 'I am looking for a Mermaid Saree Shaper' },
    { label: 'Lustrous Glide', title: 'Pure Satin Underskirt', body: 'Heavy satin weave giving an exquisite sheen beneath sheer organzas, net sarees, and chiffon handlooms without clinging.', points: ['Zero static friction with delicate weaves', 'Flared 6-panel classical silhouette', 'Reinforced waist tie cord'], note: 'Gold, Champagne & Silver Tones', message: 'I am looking for a Satin Underskirt' },
    { label: 'Daily Classic', title: 'Pure Cotton Drawstring Skirt', body: 'Traditional 100% fine cotton petticoat crafted with sturdy interlock stitching, double-hemmed bottom, and pre-washed softness.', points: ['100% breathable natural cotton', 'Pre-shrunk color guarantee', 'Ideal for traditional everyday & temple drapes'], note: '100+ Shades In Stock', message: 'I am looking for Cotton Petticoats' },
  ],
  cardCta: 'Enquire Size',
}

export const INNERS = {
  id: 'collection-inners',
  eyebrow: 'Intimate Comfort Foundations',
  note: 'Day-Long Bridal Wear',
  title: 'Ethnic Inners & Intimate Essentials',
  lead: 'Curated foundations engineered for Indian festive drapes: zero show-through, friction-free movement, and supreme breathability under heavy bridal regalia.',
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
    { image: IMG('cat-fancy-jewellery'), alt: 'Antique matte gold Goddess Lakshmi temple choker necklace with kemp stones and pearl droplets', badge: 'Antique Matte Gold', label: 'Choker Suite', title: 'Lakshmi Temple Choker', body: 'Repoussé temple idol motif with rubies, emerald cabochons & matching jhumkas.', note: 'With Matching Earrings', message: 'Enquiry for Lakshmi Temple Choker' },
    { image: IMG('gallery-jewellery-silk'), alt: 'Pearl and kundan necklace with matching earrings on emerald silk', badge: 'Pearl Clusters', label: 'Long Haaram', title: 'Royal Gutta Pusalu Haaram', body: 'Centuries-old Nizam-inspired cluster pearl fringes woven on hand-engraved gold.', note: 'Heritage Wedding Classic', message: 'Enquiry for Gutta Pusalu Haaram' },
    { image: IMG('craft-finished-blouse'), alt: 'Bridal jewellery and a waist belt laid out with an embroidered blouse on emerald silk', badge: 'Bridal Waistbelt', label: 'Oddiyanam Accent', title: 'Nakshi Vaddanam Belt', body: 'Sculpted peacock and floral motifs with adjustable belt chain for snug saree tucking.', note: 'Adjustable Fit', message: 'Enquiry for Nakshi Vaddanam Waist Belt', position: '75% 70%' },
    { image: IMG('gallery-bride'), alt: 'A bride wearing traditional forehead and hair jewellery', badge: 'Hair & Forehead Set', label: 'Bridal Accents', title: 'Maang Tikka & Jada Billalu', body: 'Nine-piece traditional braid jewellery set complete with sun-moon tikkas.', note: 'Full 9-Piece Set', message: 'Enquiry for Maang Tikka and Jada Billalu', position: '45% 25%' },
  ],
  cardCta: 'Enquire',
}

export const DRESS_SETS = {
  id: 'collection-dress-sets',
  eyebrow: 'Ready-To-Wear Couture',
  note: 'Festive Celebrations',
  title: 'Three-Piece Dress Sets & Kurtis',
  lead: 'Effortless festive grandeur: pure chanderi, raw silk and georgette suit ensembles complete with designer pants and hand-embroidered organza dupattas.',
  cta: { label: 'View Dress Lookbook', message: 'Hi SJR House of Collection, please share your Three-Piece Dress Sets Catalogue' },
  items: [
    { image: IMG('dress-anarkali'), alt: 'A bride seated in an emerald silk ensemble with heavy zari and temple jewellery', badge: 'Flared Anarkali', label: '3-Piece Bridal Ensemble', title: 'Royal Zardosi Anarkali Suite', body: '32-kali floor-length flared pure chanderi silk gown with hand-done zardosi yoke, churidar pants, and heavy scalloped border dupatta.', note: 'Sizes: XS – 3XL', message: 'Interested in Royal Zardosi Anarkali Suite', position: '50% 28%' },
    { image: IMG('intro-drape'), alt: 'A woman in a crimson and emerald silk drape with a gold zari border', badge: 'Straight Silhouette', label: 'Festive Prêt', title: 'Festive Straight Kurta Set', body: 'Pure raw silk straight kurta paired with slim cigarette trousers, side pocket utility, and a shimmering banarasi zari border dupatta.', note: 'Ready for Dispatch', message: 'Interested in Festive Straight Kurta Set', position: '60% 40%' },
    { image: IMG('cat-matchings'), alt: 'Festive garments and dupattas hanging in a boutique wardrobe', badge: 'Palazzo Pairing', label: 'Casual Festive', title: 'Embroidered Palazzo Suit', body: 'Breathable georgette tunic with intricate resham thread embroidery, flared wide-leg palazzo bottoms, and lightweight printed stole.', note: 'Boutique Fit Assured', message: 'Interested in Embroidered Palazzo Suit' },
  ],
  cardCta: 'Enquire Set',
}
