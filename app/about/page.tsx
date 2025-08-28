import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Users, Clock, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-8">
        {/* Hero Section */}
        <section className="relative py-20 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance" data-aos="fade-up">
              Our Story
            </h1>
            <p className="text-xl text-muted-foreground text-pretty" data-aos="fade-up" data-aos-delay="200">
              A journey of culinary excellence that began with a simple dream
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6" data-aos="fade-right">
                <h2 className="text-3xl font-bold text-foreground text-balance">From Passion to Perfection</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p className="text-pretty">
                    Sunset View Point was born from Chef Marco Antonelli's lifelong passion for authentic Italian cuisine and
                    his vision to create an extraordinary dining experience. After training in the finest kitchens of
                    Tuscany and working alongside Michelin-starred chefs, Marco brought his expertise to create a
                    restaurant that celebrates both tradition and innovation.
                  </p>
                  <p className="text-pretty">
                    Since opening our doors in 2018, we have been committed to sourcing the finest ingredients, from
                    locally-grown organic produce to imported Italian specialties. Every dish tells a story, every meal
                    creates a memory, and every guest becomes part of our extended family.
                  </p>
                  <p className="text-pretty">
                    Our philosophy is simple: exceptional food, warm hospitality, and an atmosphere that makes every
                    occasion special. Whether you're celebrating a milestone or simply enjoying an evening out, Bella
                    Vista provides the perfect backdrop for life's most precious moments.
                  </p>
                </div>
              </div>
              <div className="relative" data-aos="fade-left" data-aos-delay="200">
                <img
                  src="/chef-marco-in-kitchen-preparing-dish.png"
                  alt="Chef Marco Antonelli in the kitchen"
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
                  <div className="text-2xl font-bold">2018</div>
                  <div className="text-sm">Est. Year</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12" data-aos="fade-up">
              <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">What Makes Us Special</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Our commitment to excellence is reflected in every aspect of the Sunset View Point experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Award,
                  title: "Award-Winning",
                  description: "Recognized for culinary excellence and outstanding service",
                },
                {
                  icon: Users,
                  title: "Expert Team",
                  description: "Passionate chefs and service staff dedicated to your experience",
                },
                {
                  icon: Clock,
                  title: "Time-Honored",
                  description: "Traditional techniques combined with modern culinary innovation",
                },
                {
                  icon: Heart,
                  title: "Made with Love",
                  description: "Every dish crafted with care and attention to detail",
                },
              ].map((value, index) => {
                const IconComponent = value.icon
                return (
                  <Card
                    key={index}
                    className="text-center hover:shadow-lg transition-all duration-300"
                    data-aos="fade-up"
                    data-aos-delay={200 + index * 100}
                  >
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 text-balance">{value.title}</h3>
                      <p className="text-sm text-muted-foreground text-pretty">{value.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Awards Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-balance" data-aos="fade-up">
              Recognition & Awards
            </h2>
            <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
              <Badge variant="secondary" className="text-sm py-2 px-4">
                Best Italian Restaurant 2023
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                Wine Spectator Award
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                TripAdvisor Certificate of Excellence
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                OpenTable Diners' Choice
              </Badge>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
