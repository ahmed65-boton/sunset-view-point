import Link from "next/link";
import Image from "next/image";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { format } from "date-fns";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-card/60 backdrop-blur">
      <div className="svp-container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                <Image
                  src="/sunsetlogo.png"
                  alt="Sunset View Point Logo"
                  width={42}
                  height={42}
                  className="size-10 object-contain"
                />
              </span>
              <span>
                <span className="block font-black text-foreground">Sunset View Point</span>
                <span className="text-xs text-muted-foreground">Quetta valley dining</span>
              </span>
            </Link>
            <p className="max-w-sm text-pretty text-sm leading-6 text-muted-foreground">
              Fine dining, traditional favorites, and golden-hour views in one warm hilltop experience.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-foreground">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">Home</Link>
              <Link href="/booking" className="text-sm text-muted-foreground transition-colors hover:text-primary">Menu & Booking</Link>
              <Link href="/contact" className="text-sm text-muted-foreground transition-colors hover:text-primary">Contact Us</Link>
              <Link href="/members" className="text-sm text-muted-foreground transition-colors hover:text-primary">Members</Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-foreground">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="text-sm text-muted-foreground">
                  <p>Sunset Hill Road,</p>
                  <p>Scenic Point, Quetta 87300</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a href="tel:+929876543210" className="text-sm text-muted-foreground transition-colors hover:text-primary">+92 98765 43210</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href="mailto:info@sunsetviewpoint.com" className="text-sm text-muted-foreground transition-colors hover:text-primary">info@sunsetviewpoint.com</a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-foreground">Opening Hours</h3>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><span className="font-medium text-foreground">Mon - Thu:</span> 5:00 PM - 11:00 PM</p>
                <p><span className="font-medium text-foreground">Fri - Sun:</span> 4:30 PM - 11:30 PM</p>
                <p className="pt-1 text-xs font-bold text-primary">Best sunset views: 6:00 PM - 7:30 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/70 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            Copyright {format(new Date(), "yyyy")} Sunset View Point. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">Privacy Policy</Link>
            <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
