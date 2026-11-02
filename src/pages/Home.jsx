import { useSeo } from '../hooks/useSeo'
import Hero from '../sections/Hero'
import { CollectionsSection, CraftSection, FeaturedSection, GallerySection, IntroSection, MarqueeBand, NewArrivalsSection, StorySection, VisitSection } from '../sections/HomeSections'

export default function Home() {
  useSeo({
    description: "SJR – House of Collection, a women's ethnic fashion boutique in MVP Colony, Visakhapatnam. Sarees, blouse stitching, matchings, petticoats, inners, nighties and fancy jewellery.",
    path: '/',
  })
  return (
    <>
      <Hero />
      <MarqueeBand />
      <IntroSection />
      <CollectionsSection />
      <FeaturedSection />
      <NewArrivalsSection />
      <CraftSection />
      <StorySection />
      <GallerySection />
      <VisitSection />
    </>
  )
}
