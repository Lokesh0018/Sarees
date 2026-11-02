import { useSeo } from '../hooks/useSeo'
import Hero from '../sections/Hero'
import { AboutTeaser, CraftSection, FeaturedCollections, ProductShowcase, PromoBanners, VisitSection } from '../sections/HomeSections'

export default function Home() {
  useSeo({
    description: "SJR – House of Collection, a women's ethnic fashion boutique in MVP Colony, Visakhapatnam. Sarees, blouse stitching, matchings, petticoats, inners, nighties and fancy jewellery.",
    path: '/',
  })
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <ProductShowcase kind="new" />
      <PromoBanners />
      <CraftSection />
      <ProductShowcase kind="featured" />
      <AboutTeaser />
      <VisitSection />
    </>
  )
}
