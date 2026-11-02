import { useSeo } from '../hooks/useSeo'
import { useOffscreenPause } from '../hooks/useOffscreenPause'
import Hero from '../sections/Hero'
import {
  CollectionsSection, CraftSection, GallerySection, InnersCollection, IntroSection, JewelleryCollection,
  MarqueeBand, MatchingsCollection, NightiesCollection, PetticoatsCollection, SareesCollection, StitchingCollection,
  StorySection, VisitSection,
} from '../sections/HomeSections'

export default function Home() {
  useSeo({
    description: "SJR – House of Collection, a women's ethnic fashion boutique in MVP Colony, Visakhapatnam. Sarees, blouse stitching, matchings, petticoats, inners, nighties and fancy jewellery.",
    path: '/',
  })
  useOffscreenPause()
  return (
    <>
      <Hero />
      <MarqueeBand />
      <IntroSection />
      <CollectionsSection />
      {/* Two tones only: emerald (default) alternating with warm parchment (light, like the Intro), so the run varies without adding colours */}
      <div className="tone-parchment"><SareesCollection /></div>
      <StitchingCollection />
      <div className="tone-parchment"><MatchingsCollection /></div>
      <PetticoatsCollection />
      <div className="tone-parchment"><InnersCollection /></div>
      <NightiesCollection />
      <div className="tone-parchment"><JewelleryCollection /></div>
      <CraftSection />
      <div className="tone-parchment"><StorySection /></div>
      <GallerySection />
      <div className="tone-parchment"><VisitSection /></div>
    </>
  )
}
