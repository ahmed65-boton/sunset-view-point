"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { BadgePercent, LockKeyhole, Mail, Sparkles, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/navigation";
import { auth, db } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function getStatusClass(status: string) {
  const lower = status.toLowerCase();
  if (lower.includes("created")) return "border-primary/25 bg-primary/10 text-primary";
  return "border-destructive/25 bg-destructive/10 text-destructive";
}

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: "name" | "email" | "password", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!name) {
      setStatus("Please enter your name.");
      return;
    }

    if (!isValidEmail(email)) {
      setStatus("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setStatus("Password should be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Creating your account...");

      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        role: "member",
        discountRate: 0.25,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setStatus("Account created. You are now a member.");
      router.push("/members");
      router.refresh();
    } catch (err: any) {
      console.error("[SignUpPage] Signup error:", err);

      switch (err.code) {
        case "auth/email-already-in-use":
          setStatus("This email is already in use. Try logging in instead.");
          break;
        case "auth/invalid-email":
          setStatus("That email address is not valid.");
          break;
        case "auth/weak-password":
          setStatus("Password is too weak. Try something stronger.");
          break;
        default:
          setStatus("Failed to create account. Please try again.");
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
          <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 sm:p-10 lg:p-12">
              <Card className="border-0 bg-transparent py-0 shadow-none">
                <CardHeader className="px-0 pb-8">
                  <span className="section-kicker">Join SVP members</span>
                  <CardTitle className="text-3xl font-black tracking-tight md:text-4xl">Create your member account</CardTitle>
                  <p className="text-sm text-muted-foreground">Sign up once and get your 25% food discount applied when booking.</p>
                </CardHeader>

                <CardContent className="px-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-muted-foreground">
                      <div className="flex gap-3">
                        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <p><span className="font-bold text-foreground">No email verification required:</span> once you are logged in, your booking total updates automatically.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          autoComplete="name"
                          placeholder="Your name"
                          className="pl-11"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="signup-email"
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
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          autoComplete="new-password"
                          placeholder="At least 6 characters"
                          className="pl-11"
                          value={formData.password}
                          onChange={(e) => handleChange("password", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? "Creating account..." : "Sign Up"}
                    </Button>

                    <Button asChild variant="outline" size="lg" className="w-full">
                      <Link href="/login">Already have an account? Login</Link>
                    </Button>

                    {status && <p className={cn("rounded-2xl border px-4 py-3 text-center text-sm font-medium", getStatusClass(status))}>{status}</p>}
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="relative hidden min-h-[44rem] overflow-hidden lg:block">
              <img src="/wine-glasses-and-elegant-table-setting.png" alt="Member dining ambience" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
              <div className="absolute bottom-0 p-10 text-white">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                  <BadgePercent className="h-4 w-4 text-amber-200" /> 25% food discount
                </span>
                <h1 className="text-balance text-4xl font-black">Member bookings are faster and more rewarding.</h1>
                <p className="mt-4 text-pretty text-white/75">Create your account, pick dishes, and reserve your table in a single smooth flow.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
