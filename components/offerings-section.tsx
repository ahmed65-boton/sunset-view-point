import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Utensils, Wine, Gift } from "lucide-react";

const offerings = [
  {
    icon: ChefHat,
    title: "Chef's Specials",
    description:
      "Signature dishes crafted by our award-winning chef using the finest seasonal ingredients and innovative techniques.",
    image: "/gourmet-dish-plated-elegantly-on-white-plate.png",
  },
  {
    icon: Utensils,
    title: "Menu Variety",
    description:
      "From classic favorites to contemporary creations, our diverse menu caters to every palate and dietary preference.",
    image: "/variety-of-elegant-dishes-on-restaurant-table.png",
  },
  {
    icon: Wine,
    title: "Premium Ambience",
    description:
      "Immerse yourself in our sophisticated atmosphere with ambient lighting, comfortable seating, and impeccable service.",
    image: "/elegant-restaurant-dining-room-with-warm-lighting.png",
  },
  {
    icon: Gift,
    title: "Special Offers",
    description:
      "Enjoy exclusive dining experiences with our seasonal promotions, discounts, and special event packages.",
    image: "/wine-glasses-and-elegant-table-setting.png",
  },
];

export function OfferingsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            What We Offer
          </h2>
          <p
            className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Discover the exceptional dining experience that awaits you at Sunset
            View Point, where every detail is crafted to perfection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {offerings.map((offering, index) => {
            const IconComponent = offering.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20"
                data-aos="fade-up"
                data-aos-delay={600 + index * 100}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={offering.image || "/placeholder.svg"}
                      alt={offering.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-primary/90 p-2 rounded-full">
                      <IconComponent className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-3 text-balance">
                      {offering.title}
                    </h3>
                    <p className="text-muted-foreground text-pretty leading-relaxed">
                      {offering.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
