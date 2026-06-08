"use client";

import { useState } from "react";
import { CalendarCheck, Search, ShoppingBag } from "lucide-react";

import { BookingForm } from "@/components/booking-form";
import { MenuSection } from "@/components/menu-section";
import { Navigation } from "@/components/navigation";
import type { SelectedMenuItems } from "@/lib/menu";

const steps = [
  { icon: Search, title: "Browse", text: "Search dishes or pick a category." },
  { icon: ShoppingBag, title: "Choose", text: "Add items and see totals live." },
  { icon: CalendarCheck, title: "Reserve", text: "Send your table request instantly." },
];

export default function BookingPage() {
  const [selectedItems, setSelectedItems] = useState<SelectedMenuItems>({});

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <section className="relative isolate overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 -z-20">
            <img
              src="/elegant-restaurant-dining-room-with-warm-lighting.png"
              alt="Elegant dining room"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.75),rgba(0,0,0,0.48)),radial-gradient(circle_at_80%_20%,rgba(255,183,77,0.28),transparent_24rem)]" />
          <div className="svp-container text-white">
            <div className="max-w-3xl" data-aos="fade-up">
              <span className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                Menu pre-order + table reservation
              </span>
              <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">
                Reserve your table with your favorite dishes ready in the plan.
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-white/82">
                Select food, drinks, date, time, and guest count in one clear booking flow. Members get an automatic 25% food discount.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3" data-aos="fade-up" data-aos-delay="180">
              {steps.map((step) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.title} className="glass-panel rounded-3xl p-5">
                    <IconComponent className="mb-4 h-6 w-6 text-amber-200" />
                    <h2 className="font-bold text-white">{step.title}</h2>
                    <p className="mt-1 text-sm text-white/70">{step.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="svp-container">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(26rem,0.95fr)] xl:items-start">
              <div data-aos="fade-right" data-aos-delay="150">
                <MenuSection selectedItems={selectedItems} onSelectedItemsChange={setSelectedItems} />
              </div>
              <div className="xl:sticky xl:top-24" data-aos="fade-left" data-aos-delay="220">
                <BookingForm selectedItems={selectedItems} onClearOrder={() => setSelectedItems({})} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
