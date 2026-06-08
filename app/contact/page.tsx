import { CalendarDays, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const contactItems = [
  {
    icon: MapPin,
    title: "Address",
    lines: ["Sunset Hill Road", "Scenic Point", "Quetta, Pakistan 87300"],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["+92 98765 43210", "Reservations and inquiries"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["info@sunsetviewpoint.com", "We respond within 24 hours"],
  },
  {
    icon: Clock,
    title: "Opening Hours",
    lines: ["Mon - Thu: 5:00 PM - 11:00 PM", "Fri - Sun: 4:30 PM - 11:30 PM", "Best views: 6:00 PM - 7:30 PM"],
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <section className="relative isolate overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 -z-20">
            <img
              src="/wine-glasses-and-elegant-table-setting.png"
              alt="Elegant table setting with sunset view"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.75),rgba(0,0,0,0.42)),radial-gradient(circle_at_85%_20%,rgba(255,183,77,0.25),transparent_24rem)]" />
          <div className="svp-container text-white">
            <div className="max-w-3xl" data-aos="fade-up">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                <MessageCircle className="h-4 w-4 text-amber-200" /> Contact Sunset View Point
              </span>
              <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">Tell us how we can make your visit better.</h1>
              <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-white/82">
                Reach out for table questions, private events, catering, feedback, or special requests before your visit.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-white text-stone-950 hover:bg-white/90">
                  <a href="tel:+929876543210"><Phone className="h-4 w-4" /> Call Now</a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                  <a href="mailto:info@sunsetviewpoint.com"><Mail className="h-4 w-4" /> Send Email</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="svp-container">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="space-y-6" data-aos="fade-right">
                <div>
                  <span className="section-kicker">Visit details</span>
                  <h2 className="text-balance text-3xl font-black tracking-tight text-foreground">Everything you need before you arrive.</h2>
                  <p className="mt-3 text-pretty text-muted-foreground">
                    Use the form for detailed requests or contact us directly for quick reservation support.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {contactItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <Card key={item.title} className="surface-card" data-aos="fade-up" data-aos-delay={120 + index * 80}>
                        <CardContent className="flex gap-4 p-5">
                          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">{item.title}</h3>
                            <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                              {item.lines.map((line) => <p key={line}>{line}</p>)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Card className="surface-card overflow-hidden py-0" data-aos="fade-up" data-aos-delay="520">
                  <CardContent className="p-0">
                    <div className="h-80 w-full overflow-hidden rounded-2xl bg-muted">
                      <iframe
                        title="Sunset View Point location map"
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d789.0040487625786!2d67.07291918207021!3d30.213563600441265!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ed2df5b4562c0eb%3A0x1731c51bbff6e8e!2sSunset%20View%20Point!5e1!3m2!1sen!2s!4v1756408926211!5m2!1sen!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:sticky lg:top-24" data-aos="fade-left" data-aos-delay="180">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
