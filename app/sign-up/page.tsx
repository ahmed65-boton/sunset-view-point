// app/sign-up/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "@/lib/firebase/client";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
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

    if (formData.password.length < 6) {
      setStatus("Password should be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Creating your account...");

      // 1) Create user in Firebase Auth
      console.log("Trying to sign up:", formData.email);
      console.log("Firebase project:", auth.app.options.projectId);
      console.log("Trying to sign up:", formData.email);

      const userCred = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCred.user;

      // 2) Write user profile to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
        // add more fields later like: name, role, etc.
      });

      setStatus("✅ Account created successfully!");

      // 3) Redirect somewhere (e.g. login page or home)
      router.push("/login"); // change to "/" or "/booking" if you want
    } catch (err: any) {
      console.error(err);

      // handle common Firebase errors nicely
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
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* top navigation bar (same one you use everywhere) */}
      <Navigation />

      <main className="py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Sign Up
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing you up..." : "Sign Up"}
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
