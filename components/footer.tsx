// D:\CO Laptop Data\sunset-view-point-main\components\footer.tsx
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { format } from "date-fns";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/sunsetlogo.png"
                alt="Sunset View Point Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="font-bold text-lg text-foreground">
                Sunset View Point
              </span>
            </Link>
            <p className="text-muted-foreground text-sm text-pretty">
              Experience fine dining with breathtaking sunset views. Where
              exceptional cuisine meets nature's daily masterpiece.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Home
              </Link>
              <Link
                href="/booking"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Book Table
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p>Sunset Hill Road,</p>
                  <p>Scenic Point, Quetta 87300</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a
                  href="tel:+929876543210"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  +92 98765 43210
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a
                  href="mailto:info@sunsetviewpoint.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  info@sunsetviewpoint.com
                </a>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Opening Hours</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <div className="space-y-1">
                    <p>
                      <span className="font-medium">Mon - Thu:</span> 5:00 PM -
                      11:00 PM
                    </p>
                    <p>
                      <span className="font-medium">Fri - Sun:</span> 4:30 PM -
                      11:30 PM
                    </p>
                    <p className="text-xs text-primary font-medium mt-2">
                      Best sunset views: 6:00 PM - 7:30 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {format(new Date(), "yyyy")} Sunset View Point. All rights
              reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
