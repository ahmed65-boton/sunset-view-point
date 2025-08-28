import { Navigation } from "@/components/navigation";
import { ContactForm } from "@/components/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <section className="relative py-20 bg-muted/30">
          <div className="absolute inset-0">
            <img
              src="/wine-glasses-and-elegant-table-setting.png"
              alt="Elegant table setting with sunset view"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance"
              data-aos="fade-up"
            >
              Get in Touch
            </h1>
            <p
              className="text-xl text-white/90 text-pretty"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              We'd love to hear from you. Reach out for reservations, inquiries,
              or just to say hello.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8" data-aos="fade-right">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6 text-balance">
                    Contact Information
                  </h2>
                  <div className="space-y-6">
                    <div
                      className="flex items-start gap-4"
                      data-aos="fade-up"
                      data-aos-delay="200"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Address
                        </h3>
                        <p className="text-muted-foreground">
                          Sunset Hill Road
                          <br />
                          Scenic Point
                          <br />
                          Quetta, Pakistan 87300
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-start gap-4"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Phone
                        </h3>
                        <p className="text-muted-foreground">+92 98765 43210</p>
                        <p className="text-sm text-muted-foreground">
                          For reservations and inquiries
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-start gap-4"
                      data-aos="fade-up"
                      data-aos-delay="400"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Email
                        </h3>
                        <p className="text-muted-foreground">
                          info@sunsetviewpoint.com
                        </p>
                        <p className="text-sm text-muted-foreground">
                          We'll respond within 24 hours
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-start gap-4"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Hours
                        </h3>
                        <div className="text-muted-foreground space-y-1">
                          <p>Monday - Thursday: 5:00 PM - 11:00 PM</p>
                          <p>Friday - Sunday: 4:30 PM - 11:30 PM</p>
                          <p className="text-xs text-primary font-medium mt-2">
                            Best sunset views: 6:00 PM - 7:30 PM
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <Card data-aos="fade-up" data-aos-delay="600">
                  <CardContent className="p-0">
                    <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                      {/* <div className="text-center"> */}
                      {/* <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" /> */}
                      {/* <p className="text-muted-foreground">Interactive Map</p>
                        <p className="text-sm text-muted-foreground">Sunset Hill Road, Quetta</p>
                        <Button variant="outline" className="mt-2 bg-transparent" asChild>
                          <a
                            href="https://maps.google.com/?q=Sunset+Hill+Road+Quetta+Pakistan"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open in Google Maps
                          </a>
                        </Button> */}

                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d789.0040487625786!2d67.07291918207021!3d30.213563600441265!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2s!4v1756408067272!5m2!1sen!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        loading="lazy"
                      ></iframe>
                      {/* </div> */}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div data-aos="fade-left" data-aos-delay="300">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
