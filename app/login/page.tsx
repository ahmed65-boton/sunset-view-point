"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { BadgePercent, LockKeyhole, Mail, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/navigation";
import { auth } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function getStatusClass(status: string) {
  const lower = status.toLowerCase();
  if (lower.includes("success")) return "border-primary/25 bg-primary/10 text-primary";
  return "border-destructive/25 bg-destructive/10 text-destructive";
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: "email" | "password", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!isValidEmail(email)) {
      setStatus("Please enter a valid email address.");
      return;
    }

    if (!password.trim()) {
      setStatus("Password is required.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Logging you in...");

      await signInWithEmailAndPassword(auth, email, password);

      setStatus("Logged in successfully.");
      router.push("/members");
      router.refresh();
    } catch (err: any) {
      console.error("[LoginPage] Login error:", err);

      switch (err.code) {
        case "auth/user-not-found":
        case "auth/invalid-credential":
          setStatus("No account matched those details. Check your email/password or sign up.");
          break;
        case "auth/wrong-password":
          setStatus("Incorrect password.");
          break;
        case "auth/too-many-requests":
          setStatus("Too many attempts. Please try again later.");
          break;
        case "auth/invalid-email":
          setStatus("That email address is not valid.");
          break;
        default:
          setStatus("Login failed. Please check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="py-16 md:py-20">
        <div className="svp-container">
          <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative hidden min-h-[42rem] overflow-hidden lg:block">
              <img src="/elegant-restaurant-interior-with-warm-lighting-and.webp" alt="Restaurant ambience" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
              <div className="absolute bottom-0 p-10 text-white">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                  <BadgePercent className="h-4 w-4 text-amber-200" /> Member access
                </span>
                <h1 className="text-balance text-4xl font-black">Login to unlock your 25% food discount.</h1>
                <p className="mt-4 text-pretty text-white/75">Book faster, keep your member discount active, and view your member benefits.</p>
              </div>
            </div>

            <div className="p-6 sm:p-10 lg:p-12">
              <Card className="border-0 bg-transparent py-0 shadow-none">
                <CardHeader className="px-0 pb-8">
                  <span className="section-kicker">Welcome back</span>
                  <CardTitle className="text-3xl font-black tracking-tight md:text-4xl">Login to your account</CardTitle>
                  <p className="text-sm text-muted-foreground">Continue to the members area and book with your discount.</p>
                </CardHeader>

                <CardContent className="px-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-muted-foreground">
                      <div className="flex gap-3">
                        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <p><span className="font-bold text-foreground">Member perk:</span> login before booking to apply 25% off selected food.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          className="pl-11"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          className="pl-11"
                          value={formData.password}
                          onChange={(e) => handleChange("password", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? "Logging in..." : "Login"}
                    </Button>

                    <Button asChild variant="outline" size="lg" className="w-full">
                      <Link href="/sign-up">Create a new account</Link>
                    </Button>

                    {status && <p className={cn("rounded-2xl border px-4 py-3 text-center text-sm font-medium", getStatusClass(status))}>{status}</p>}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
