import { Award, Clock, Heart, MapPinned, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: Award,
    title: "Quality First",
    description: "Fresh ingredients, consistent preparation, and attentive service from kitchen to table.",
  },
  {
    icon: Users,
    title: "Family Friendly",
    description: "Comfortable seating, shareable portions, and a menu that works for groups of all sizes.",
  },
  {
    icon: Clock,
    title: "Sunset Timing",
    description: "Plan your visit around the golden hour and enjoy Quetta valley at its most beautiful.",
  },
  {
    icon: Heart,
    title: "Made with Care",
    description: "Every booking, message, and order note is handled with warm hospitality.",
  },
];

export function AboutSection() {
  return (
    <>
      <section className="py-24" id="about">
        <div className="svp-container">
          <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative order-2 lg:order-1" data-aos="fade-right">
              <div className="absolute -left-5 -top-5 h-full w-full rounded-[2rem] border border-primary/20" />
              <img
                src="/our_story.webp"
                alt="Sunset View Point outdoor dining story"
                className="relative h-[32rem] w-full rounded-[2rem] object-cover shadow-2xl"
              />
              <div className="absolute -bottom-6 left-6 rounded-3xl border border-white/20 bg-card/95 p-5 shadow-2xl backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <MapPinned className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-foreground">2018</div>
                    <div className="text-sm font-medium text-muted-foreground">Serving scenic meals</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2" data-aos="fade-left" data-aos-delay="150">
              <span className="section-kicker">Our story</span>
              <h2 className="text-balance text-4xl font-black tracking-tight text-foreground md:text-5xl">
                A Quetta viewpoint built for food, families, and golden skies.
              </h2>
              <div className="mt-6 space-y-5 text-pretty text-base leading-8 text-muted-foreground">
                <p>
                  Sunset View Point was established in 2018 at a vantage point overlooking the Quetta Valley. Since then, it has become a favorite spot for Cantt residents and visitors looking for a relaxed meal with a memorable view.
                </p>
                <p>
                  Our philosophy is simple: satisfying food, warm hospitality, and an atmosphere that makes every occasion feel special. Whether you are celebrating a milestone or enjoying an evening out, SVP provides the backdrop for meaningful moments.
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["Views", "Valley-facing tables"],
                  ["Menu", "76+ items"],
                  ["Members", "25% discount"],
                ].map(([title, detail]) => (
                  <div key={title} className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
                    <p className="text-lg font-black text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/35 py-24">
        <div className="svp-container">
          <div className="mx-auto mb-12 max-w-3xl text-center" data-aos="fade-up">
            <span className="section-kicker">What makes us special</span>
            <h2 className="text-balance text-3xl font-black tracking-tight text-foreground md:text-4xl">
              Designed around comfort, clarity, and great hospitality.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card
                  key={value.title}
                  className="surface-card text-center"
                  data-aos="fade-up"
                  data-aos-delay={150 + index * 100}
                >
                  <CardContent className="p-6">
                    <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                      <IconComponent className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{value.title}</h3>
                    <p className="mt-3 text-pretty text-sm leading-6 text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
