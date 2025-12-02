// D:\CO Laptop Data\sunset-view-point-main\app\booking\page.tsx
import { Navigation } from "@/components/navigation"
import { MenuSection } from "@/components/menu-section"
import { BookingForm } from "@/components/booking-form"

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <section className="relative py-20 bg-muted/30">
          <div className="absolute inset-0">
            <img
              src="/elegant-restaurant-dining-room-with-warm-lighting.png"
              alt="Elegant dining room"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance" data-aos="fade-up">
              Reserve Your Sunset Experienc
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto text-pretty" data-aos="fade-up" data-aos-delay="200">
              Select your favorite dishes and book your perfect dining experience with breathtaking sunset views at
              Sunset View Point.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div data-aos="fade-right" data-aos-delay="400">
                <MenuSection />
              </div>
              <div data-aos="fade-left" data-aos-delay="600">
                <BookingForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
