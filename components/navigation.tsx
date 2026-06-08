"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { CalendarDays, Menu, Moon, Sun, UserCircle, X } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/booking", label: "Menu & Booking" },
  { href: "/contact", label: "Contact" },
  { href: "/members", label: "Members" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return onAuthStateChanged(auth, (firebaseUser) => setUser(firebaseUser));
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleLogout = async () => {
    await signOut(auth);
    setIsOpen(false);
    router.push("/login");
    router.refresh();
  };

  const linkClassName = (href: string) =>
    cn(
      "rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground",
      pathname === href && "bg-primary/10 text-primary shadow-sm"
    );

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="svp-container">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="group flex min-w-0 items-center gap-3" onClick={() => setIsOpen(false)}>
            <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary/10 ring-1 ring-primary/15 transition-transform group-hover:scale-105">
              <Image src="/sunsetlogo.png" alt="Sunset View Point Logo" width={44} height={44} className="size-10 object-contain" priority />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-extrabold tracking-tight text-foreground sm:text-lg">Sunset View Point</span>
              <span className="hidden text-xs font-medium text-muted-foreground sm:block">Quetta valley dining</span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-card/70 p-1 shadow-sm backdrop-blur md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClassName(link.href)}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="relative" aria-label="Toggle theme">
              {mounted ? (
                <>
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </>
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {user ? (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <UserCircle className="h-4 w-4" /> Logout
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
            )}

            <Button asChild size="sm">
              <Link href="/booking"><CalendarDays className="h-4 w-4" /> Book Now</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="relative" aria-label="Toggle theme">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen} aria-controls="mobile-navigation">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {isOpen && (
          <div id="mobile-navigation" className="pb-4 md:hidden">
            <div className="surface-card overflow-hidden p-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn("block rounded-2xl px-4 py-3 text-sm font-medium", linkClassName(link.href))}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border/70 pt-3">
                {user ? (
                  <Button type="button" variant="outline" onClick={handleLogout}>Logout</Button>
                ) : (
                  <Button asChild variant="outline"><Link href="/login">Login</Link></Button>
                )}
                <Button asChild><Link href="/booking">Book Now</Link></Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
