import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, Clock, Heart } from "lucide-react";

export function AboutSection() {
  return (
    <>
      {/* Story Section */}
      <section className="py-16 bg-muted/30" id="about">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Our Story
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              A journey of culinary excellence with breathtaking sunset views
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6" data-aos="fade-right">
              <h3 className="text-2xl font-bold text-foreground text-balance">
                From Vision to Reality
              </h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="text-pretty">
                  Sunset View Point (SVP) was established in 2018 at the vantage
                  overlooking complete Quetta Valley. Since then, wthe place has
                  been point of attraction for the Cantt residents. The quallity
                  of meals including fast food and local cuisines prepared at
                  SVP exhibit the cmt of SVP staff to their job.
                </p>
                <p className="text-pretty">
                  Our philosophy is simple: exceptional food, warm hospitality,
                  and an atmosphere that makes every occasion special. Whether
                  you're celebrating a milestone or simply enjoying an evening
                  out, SVP provides the perfect backdrop for life's most
                  precious moments.
                </p>
              </div>
            </div>
            <div className="relative" data-aos="fade-left" data-aos-delay="200">
              <img
                src="/our_story.webp"
                alt="Our Story"
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
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">
              What Makes Us Special
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Our commitment to excellence is reflected in every aspect of the
              Sunset View Point experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Award,
                title: "Award-Winning",
                description:
                  "Recognized for culinary excellence and outstanding sunset dining experience",
              },
              {
                icon: Users,
                title: "Expert Team",
                description:
                  "Passionate chefs and service staff dedicated to creating memorable moments",
              },
              {
                icon: Clock,
                title: "Perfect Timing",
                description:
                  "Strategically timed service to complement the golden hour experience",
              },
              {
                icon: Heart,
                title: "Made with Love",
                description:
                  "Every dish crafted with care and attention to detail",
              },
            ].map((value, index) => {
              const IconComponent = value.icon;
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
                    <h3 className="font-semibold text-foreground mb-2 text-balance">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground text-pretty">
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
