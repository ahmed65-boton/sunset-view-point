import { Card, CardContent } from "@/components/ui/card";
import { BadgePercent, ChefHat, Gift, Utensils } from "lucide-react";

const offerings = [
  {
    icon: ChefHat,
    title: "Chef-Led Favorites",
    description:
      "Freshly prepared BBQ, karahi, handi, brunch, snacks, desserts, and drinks with generous portions for every table.",
    image: "/gourmet-dish-plated-elegantly-on-white-plate.png",
  },
  {
    icon: Utensils,
    title: "Easy Pre-Order Menu",
    description:
      "Browse dishes, search categories, add quantities, and see your total before sending the booking request.",
    image: "/variety-of-elegant-dishes-on-restaurant-table.png",
  },
  {
    icon: BadgePercent,
    title: "Member Discount",
    description:
      "Create a free member account before booking and the 25% discount is applied automatically at checkout.",
    image: "/elegant-restaurant-dining-room-with-warm-lighting.png",
  },
  {
    icon: Gift,
    title: "Occasion Ready",
    description:
      "Add seating preferences, birthday setup notes, dietary needs, or private event details with your reservation.",
    image: "/wine-glasses-and-elegant-table-setting.png",
  },
];

export function OfferingsSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 -z-10 bg-muted/40" />
      <div className="absolute left-0 top-12 -z-10 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="svp-container">
        <div className="mx-auto mb-14 max-w-3xl text-center" data-aos="fade-up">
          <span className="section-kicker">Why guests choose us</span>
          <h2 className="text-balance text-4xl font-black tracking-tight text-foreground md:text-5xl">
            A smoother way to plan a memorable meal.
          </h2>
          <p className="mt-5 text-pretty text-lg leading-8 text-muted-foreground">
            From menu browsing to table confirmation, every step is designed to feel clear, fast, and welcoming.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {offerings.map((offering, index) => {
            const IconComponent = offering.icon;
            return (
              <Card
                key={offering.title}
                className="surface-card group overflow-hidden py-0"
                data-aos="fade-up"
                data-aos-delay={150 + index * 100}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={offering.image || "/placeholder.svg"}
                      alt={offering.title}
                      className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 grid size-12 place-items-center rounded-2xl bg-white/90 text-primary shadow-lg backdrop-blur">
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-balance text-xl font-bold text-foreground">
                      {offering.title}
                    </h3>
                    <p className="mt-3 text-pretty text-sm leading-6 text-muted-foreground">
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
