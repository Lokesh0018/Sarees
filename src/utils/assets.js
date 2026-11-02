// Images in src/assets/images are bundled by Vite, which fingerprints their file names at build time.
// Content and data refer to them by plain file name ("cat-sarees.webp"); this resolves that to the built URL.
const bundled = import.meta.glob('../assets/images/*', { eager: true, import: 'default' })
const byName = Object.fromEntries(Object.entries(bundled).map(([path, url]) => [path.split('/').pop(), url]))

// Full URLs and /public paths pass through unchanged, so data can mix bundled and hosted images.
export const imageUrl = (src) => (src && byName[src]) || src
