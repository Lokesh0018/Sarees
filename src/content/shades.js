// SJR shade card for linings and matchings: 10 colour families x 8 base shades x 5 depths = 400 tones.
// Colours are generated from each family's hue band so the card stays easy to extend; replace any entry with a
// measured fabric colour (hex) when the physical shade card is digitised.

const DEPTHS = [
  { name: 'Light', l: 80 },
  { name: 'Soft', l: 66 },
  { name: '', l: 52 }, // the base shade carries no prefix
  { name: 'Deep', l: 38 },
  { name: 'Dark', l: 25 },
]

export const SHADE_FAMILIES = [
  { id: 'reds', name: 'Reds & Maroons', code: 'R', hue: [348, 372], sat: 68, names: ['Kumkum', 'Sindoor', 'Ruby', 'Chilli', 'Maroon', 'Wine', 'Garnet', 'Cherry'] },
  { id: 'pinks', name: 'Pinks', code: 'P', hue: [318, 346], sat: 62, names: ['Rani', 'Magenta', 'Onion', 'Rose', 'Lotus', 'Fuchsia', 'Blush', 'Carnation'] },
  { id: 'oranges', name: 'Oranges & Rust', code: 'O', hue: [12, 32], sat: 70, names: ['Saffron', 'Peach', 'Coral', 'Rust', 'Apricot', 'Copper', 'Tangerine', 'Terracotta'] },
  { id: 'yellows', name: 'Yellows', code: 'Y', hue: [38, 56], sat: 74, names: ['Turmeric', 'Mustard', 'Lemon', 'Mango', 'Marigold', 'Honey', 'Champa', 'Ochre'] },
  { id: 'greens', name: 'Greens', code: 'G', hue: [78, 150], sat: 48, names: ['Parrot', 'Mehendi', 'Pista', 'Olive', 'Leaf', 'Emerald', 'Bottle', 'Jade'] },
  { id: 'teals', name: 'Peacock & Teal', code: 'T', hue: [168, 194], sat: 55, names: ['Rama', 'Peacock', 'Teal', 'Firozi', 'Aqua', 'Sea', 'Lagoon', 'Spruce'] },
  { id: 'blues', name: 'Blues', code: 'B', hue: [200, 236], sat: 58, names: ['Sky', 'Powder', 'Royal', 'Cobalt', 'Sapphire', 'Indigo', 'Navy', 'Ink'] },
  { id: 'purples', name: 'Purples', code: 'V', hue: [256, 300], sat: 42, names: ['Lavender', 'Lilac', 'Mauve', 'Violet', 'Orchid', 'Brinjal', 'Plum', 'Jamun'] },
  { id: 'neutrals', name: 'Neutrals', code: 'N', hue: [28, 44], sat: 12, names: ['Ivory', 'Cream', 'Sandal', 'Beige', 'Taupe', 'Ash', 'Grey', 'Charcoal'] },
  { id: 'metallics', name: 'Zari Metallics', code: 'M', hue: [26, 48], sat: 46, names: ['Champagne', 'Tissue Gold', 'Antique Gold', 'Old Gold', 'Bronze', 'Copper Zari', 'Brass', 'Temple Gold'] },
]

function hslToHex(h, s, l) {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100)
  const f = (n) => {
    const k = (n + h / 30) % 12
    const c = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    return Math.round(c * 255).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase()
}

// Relative luminance, so labels drawn on a swatch can pick dark or light ink
export function isLightColour(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.36
}

export const SHADES = SHADE_FAMILIES.flatMap((fam) =>
  fam.names.flatMap((base, i) => {
    const hue = (fam.hue[0] + ((fam.hue[1] - fam.hue[0]) * i) / (fam.names.length - 1)) % 360
    return DEPTHS.map((depth, j) => ({
      code: `${fam.code}${String(100 + i * DEPTHS.length + j + 1)}`,
      name: depth.name ? `${depth.name} ${base}` : base,
      family: fam.id,
      // Pale and very dark depths lose a little saturation, as dyed cotton does
      hex: hslToHex(hue, Math.max(4, fam.sat - Math.abs(j - 2) * 6), depth.l),
    }))
  }),
)
