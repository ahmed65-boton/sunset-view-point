import { ArrowRight, Camera, Music, Sparkles, Sunset, Utensils } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const experiences = [
  {
    icon: Sunset,
    title: "Golden Hour Dining",
    description: "Plan your table around the best light and enjoy Quetta valley as the sky changes color.",
    image: "/elegant-restaurant-dining-room-with-warm-lighting.png",
  },
  {
    icon: Camera,
    title: "Photo-Friendly Corners",
    description: "Capture memorable photos with scenic views, warm interiors, and beautifully served dishes.",
    image: "/wine-glasses-and-elegant-table-setting.png",
  },
  {
    icon: Music,
    title: "Relaxed Atmosphere",
    description: "A calm setting for friends, families, birthday dinners, and peaceful evening plans.",
    image: "/elegant-restaurant-interior-with-warm-lighting-and.webp",
  },
  {
    icon: Utensils,
    title: "Menu for Every Mood",
    description: "Choose from BBQ, traditional dishes, pizza, brunch, snacks, desserts, and beverages.",
    image: "/gourmet-dish-plated-elegantly-on-white-plate.png",
  },
]

export function ExperienceSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-muted/50 to-transparent" />
      <div className="svp-container">
        <div className="mb-12 grid items-end gap-6 md:grid-cols-[1fr_auto]" data-aos="fade-up">
          <div>
            <span className="section-kicker"><Sparkles className="mr-2 h-3.5 w-3.5" /> The full experience</span>
            <h2 className="max-w-3xl text-balance text-4xl font-black tracking-tight text-foreground md:text-5xl">
              More than dinner - a sunset plan made simple.
            </h2>
          </div>
          <Button asChild variant="outline" size="lg" className="hidden md:inline-flex">
            <Link href="/booking">Book a Table <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {experiences.map((experience, index) => {
            const IconComponent = experience.icon
            return (
              <Card
                key={experience.title}
                className="surface-card group overflow-hidden py-0"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <CardContent className="grid gap-0 p-0 sm:grid-cols-[14rem_1fr]">
                  <div className="relative min-h-56 overflow-hidden sm:min-h-full">
                    <img
                      src={experience.image || "/placeholder.svg"}
                      alt={experience.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:bg-gradient-to-r" />
                  </div>
                  <div className="relative p-6">
                    <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-balance text-xl font-bold text-foreground">{experience.title}</h3>
                    <p className="mt-3 text-pretty text-sm leading-6 text-muted-foreground">{experience.description}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-10 text-center md:hidden" data-aos="fade-up" data-aos-delay="400">
          <Button asChild size="lg">
            <Link href="/booking">Reserve Your Sunset Experience</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
