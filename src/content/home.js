// Copy and imagery for the home page sections below the hero.
// Edit wording here; the layout lives in src/sections/HomeSections.jsx.

const IMG = (name) => `/media/home/${name}.webp`

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
