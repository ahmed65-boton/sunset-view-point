import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sunset, Camera, Music, Utensils } from "lucide-react"
import Link from "next/link"

export function ExperienceSection() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            The Complete Sunset Experience
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            More than just dining - it's a journey for all your senses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {[
            {
              icon: Sunset,
              title: "Golden Hour Dining",
              description:
                "Time your meal perfectly with nature's daily masterpiece. Our sunset timing ensures you never miss the magic.",
              image: "/elegant-restaurant-dining-room-with-warm-lighting.png",
            },
            {
              icon: Camera,
              title: "Instagram-Worthy Views",
              description:
                "Capture memories that last forever with our panoramic sunset views and beautifully plated dishes.",
              image: "/wine-glasses-and-elegant-table-setting.png",
            },
            {
              icon: Music,
              title: "Ambient Atmosphere",
              description:
                "Soft acoustic melodies complement the natural symphony of the evening, creating the perfect ambiance.",
              image: "/elegant-restaurant-interior-with-warm-lighting-and.png",
            },
            {
              icon: Utensils,
              title: "Culinary Artistry",
              description:
                "Each dish is a work of art, crafted to complement the visual feast happening outside your window.",
              image: "/gourmet-dish-plated-elegantly-on-white-plate.png",
            },
          ].map((experience, index) => {
            const IconComponent = experience.icon
            return (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative h-48">
                  <img
                    src={experience.image || "/placeholder.svg"}
                    alt={experience.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 left-4 w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3 text-balance">{experience.title}</h3>
                  <p className="text-muted-foreground text-pretty">{experience.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center" data-aos="fade-up" data-aos-delay="400">
          <Button asChild size="lg" className="text-lg px-8 py-3">
            <Link href="/booking">Reserve Your Sunset Experience</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
