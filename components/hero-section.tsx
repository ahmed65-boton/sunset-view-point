import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/elegant-restaurant-interior-with-warm-lighting-and.webp"
          alt="Sunset View Point Restaurant Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance" data-aos="fade-up" data-aos-delay="400">
          Experience Fine Dining
          <span className="block text-primary">at Sunset View Point</span>
        </h1>
        <p
          className="text-xl md:text-2xl mb-8 text-pretty max-w-2xl mx-auto opacity-90"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          Indulge in culinary excellence with our chef's signature dishes, crafted with the finest ingredients in an
          elegant atmosphere.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="800">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/booking">Reserve Your Table</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <Link href="/#about">Our Story</Link>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70"
        data-aos="fade-in"
        data-aos-delay="1000"
      >
        <div className="animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
