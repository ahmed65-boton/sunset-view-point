// app/members/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";

import { auth } from "@/lib/firebase/client";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MembersPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        // Not logged in → send to login page
        router.replace("/login?from=/members");
      } else {
        setUser(firebaseUser);
      }
      setChecking(false);
    });

    return () => unsub();
  }, [router]);

  // While we are checking auth
  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Checking membership...</p>
      </div>
    );
  }

  // If somehow no user and not checking (should normally be redirected already)
  if (!user) {
    return null;
  }

  // ✅ Logged-in view
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Members Area
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Welcome, <span className="font-semibold">{user.email}</span> 🎉
              </p>

              <h1 className="text-sm text-muted-foreground">
                <span>Thanks</span> <span>for</span> <span>joining</span> <span>our</span> <span>exclusive</span> <span>members</span>. As a member, you now have access to special discounts, and perks designed just for you. We're excited to have you on board and look forward to providing you with an exceptional experience.<br/>
                 Enjoy your membership!
              </h1>

              <Button
                variant="outline"
                onClick={async () => {
                  await auth.signOut();
                  router.push("/login");
                }}
              >
                Log out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
