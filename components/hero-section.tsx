import { ArrowRight, Clock, MapPin, Sparkles, Star } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

const stats = [
  { label: "Established", value: "2018" },
  { label: "Best view", value: "6-7:30 PM" },
  { label: "Member savings", value: "25%" },
]

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[calc(100vh-5rem)] items-center overflow-hidden">
      <div className="absolute inset-0 -z-20">
        <img
          src="/elegant-restaurant-interior-with-warm-lighting-and.webp"
          alt="Sunset View Point Restaurant Interior"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_25%,rgba(255,183,77,0.35),transparent_28rem),linear-gradient(90deg,rgba(0,0,0,0.78),rgba(0,0,0,0.48),rgba(0,0,0,0.2))]" />

      <div className="svp-container py-20 text-white lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.72fr]">
          <div className="max-w-3xl" data-aos="fade-up" data-aos-delay="150">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm font-semibold text-white shadow-2xl backdrop-blur">
              <Sparkles className="h-4 w-4 text-amber-200" /> Fine dining with Quetta valley views
            </div>

            <h1 className="text-balance text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Reserve a table for the perfect sunset meal.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-white/82 sm:text-xl">
              Enjoy BBQ, traditional favorites, pizza, brunch, desserts, and drinks in a warm setting designed around golden-hour views.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-stone-950 hover:bg-white/90">
                <Link href="/booking">Reserve Your Table <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/#about">Explore Our Story</Link>
              </Button>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {stats.map((item) => (
                <div key={item.label} className="glass-panel rounded-2xl px-4 py-3">
                  <p className="text-xl font-bold text-white sm:text-2xl">{item.value}</p>
                  <p className="mt-1 text-xs font-medium text-white/65">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block" data-aos="fade-left" data-aos-delay="300">
            <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6 text-white">
              <div className="absolute -right-12 -top-12 size-40 rounded-full bg-primary/40 blur-3xl" />
              <div className="relative space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-100">Tonight at SVP</p>
                  <h2 className="mt-3 text-3xl font-bold">Golden hour tables go first.</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                    <Clock className="mt-0.5 h-5 w-5 text-amber-200" />
                    <div>
                      <p className="font-semibold">Arrive before sunset</p>
                      <p className="text-sm text-white/70">Best dining window: 6:00 PM - 7:30 PM.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                    <Star className="mt-0.5 h-5 w-5 text-amber-200" />
                    <div>
                      <p className="font-semibold">Members save more</p>
                      <p className="text-sm text-white/70">Login before booking and get 25% off selected food orders.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                    <MapPin className="mt-0.5 h-5 w-5 text-amber-200" />
                    <div>
                      <p className="font-semibold">Scenic Point, Quetta</p>
                      <p className="text-sm text-white/70">A calm hilltop setting overlooking the valley.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
