import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { OfferingsSection } from "@/components/offerings-section"
import { AboutSection } from "@/components/about-section"
import { ExperienceSection } from "@/components/experience-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <OfferingsSection />
        <AboutSection />
        <ExperienceSection />
      </main>
    </div>
  )
}
