"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { CalendarDays, Gift, LogOut, ReceiptText, Sparkles, Utensils } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { auth } from "@/lib/firebase/client";

const benefitCards = [
  {
    icon: Gift,
    title: "25% Member Discount",
    description: "Save on selected food items whenever you book while logged in.",
  },
  {
    icon: Utensils,
    title: "Menu Pre-Order",
    description: "Pick dishes before arrival and see your subtotal, discount, and total instantly.",
  },
  {
    icon: CalendarDays,
    title: "Faster Reservations",
    description: "Use a simple booking form with clear date, time, guest count, and request fields.",
  },
  {
    icon: ReceiptText,
    title: "Clear Confirmation",
    description: "Receive an email copy with your booking details and order summary.",
  },
];

export default function MembersPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/login");
        return;
      }

      setUser(firebaseUser);
      setChecking(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="surface-card p-8 text-center">
          <div className="mx-auto mb-4 size-10 animate-pulse rounded-full bg-primary/30" />
          <p className="font-medium text-muted-foreground">Checking membership...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="py-16 md:py-20">
        <div className="svp-container">
          <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-2xl shadow-primary/10" data-aos="fade-up">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,183,77,0.25),transparent_24rem)]" />
            <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:p-10">
              <div>
                <span className="section-kicker"><Sparkles className="mr-2 h-3.5 w-3.5" /> Member dashboard</span>
                <p className="text-sm font-medium text-muted-foreground">
                  Welcome, <span className="font-bold text-foreground">{user.displayName || user.email}</span>
                </p>
                <h1 className="mt-3 max-w-3xl text-balance text-4xl font-black tracking-tight text-foreground md:text-5xl">
                  Your 25% food discount is active.
                </h1>
                <p className="mt-4 max-w-2xl text-pretty leading-7 text-muted-foreground">
                  Stay logged in while booking and the discount is automatically applied to selected menu items in your reservation summary.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:justify-end">
                <Button asChild size="lg">
                  <Link href="/booking"><CalendarDays className="h-5 w-5" /> Book with Discount</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={async () => {
                    await auth.signOut();
                    router.push("/login");
                  }}
                >
                  <LogOut className="h-5 w-5" /> Log out
                </Button>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {benefitCards.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={benefit.title} className="surface-card" data-aos="fade-up" data-aos-delay={120 + index * 80}>
                  <CardContent className="p-6">
                    <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                      <IconComponent className="h-7 w-7" />
                    </div>
                    <h2 className="font-bold text-foreground">{benefit.title}</h2>
                    <p className="mt-3 text-pretty text-sm leading-6 text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <Card className="mt-8 overflow-hidden bg-muted/40" data-aos="fade-up" data-aos-delay="360">
            <CardHeader>
              <CardTitle className="text-2xl font-black">How your discount works</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {[
                ["1", "Stay logged in", "Your member status is detected on the booking page."],
                ["2", "Choose menu items", "Add dishes and drinks from any category."],
                ["3", "Confirm booking", "Your live total shows the 25% discount before submission."],
              ].map(([number, title, detail]) => (
                <div key={title} className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                  <div className="mb-4 grid size-10 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground">{number}</div>
                  <h3 className="font-bold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
