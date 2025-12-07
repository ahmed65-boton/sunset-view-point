// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "@/lib/firebase/client";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: "email" | "password", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");

    // basic validation
    if (!formData.email.includes("@") || !formData.email.endsWith(".com")) {
      setStatus("Please enter a valid email (must contain @ and end with .com).");
      return;
    }

    if (!formData.password.trim()) {
      setStatus("Password is required.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Logging you in...");

      // ✅ Log in existing Firebase user
      const userCred = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      console.log("Logged in user:", userCred.user);

      setStatus("✅ Logged in!");

      // redirect wherever you want after login:
      // home, booking page, admin dashboard, etc.
      router.push("/"); // change to "/booking" or "/admin" if you like
    } catch (err: any) {
      console.error("Login error:", err);

      switch (err.code) {
        case "auth/user-not-found":
          setStatus("No user found with that email. Try signing up first.");
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

      <main className="py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Login
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>

                {/* link to sign up if user doesn't have an account */}
                <Button
                  asChild
                  variant="outline"
                  className="w-full mt-2"
                  type="button"
                >
                  <Link href="/sign-up">Create a new account</Link>
                </Button>

                {status && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    {status}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
