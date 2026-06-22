"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { onAuthStateChanged, type User } from "firebase/auth";
import { Calendar, CheckCircle2, Clock, MailCheck, ReceiptText, Sparkles, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { auth, db } from "@/lib/firebase/client";
import {
  formatCurrency,
  getMemberDiscount,
  getOrderLines,
  getOrderSubtotal,
  MEMBER_DISCOUNT_RATE,
  type MenuCategory,
  type SelectedMenuItems,
} from "@/lib/menu";
import { cn } from "@/lib/utils";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "nXQldBEXxkP9OvbsA";
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_po9ijq4";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_BOOKING_TEMPLATE_ID || "template_y1yuu56";

if (PUBLIC_KEY) {
  emailjs.init(PUBLIC_KEY);
}

type BookingFormProps = {
  selectedItems: SelectedMenuItems;
  onClearOrder: () => void;
  menuCategories?: MenuCategory[];
};

type BookingFormData = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  specialRequests: string;
};

const initialFormData: BookingFormData = {
  name: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  guests: "",
  specialRequests: "",
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getTodayInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getStatusClass(status: string) {
  const lower = status.toLowerCase();
  if (lower.includes("failed") || lower.includes("please") || lower.includes("invalid") || lower.includes("required")) {
    return "border-destructive/25 bg-destructive/10 text-destructive";
  }
  if (lower.includes("saved") || lower.includes("sent") || lower.includes("confirmed")) {
    return "border-primary/25 bg-primary/10 text-primary";
  }
  return "border-border bg-muted/70 text-muted-foreground";
}

export function BookingForm({ selectedItems, onClearOrder, menuCategories }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => setCurrentUser(user));
  }, []);

  const orderLines = useMemo(() => getOrderLines(selectedItems, menuCategories), [menuCategories, selectedItems]);
  const subtotal = useMemo(() => getOrderSubtotal(selectedItems, menuCategories), [menuCategories, selectedItems]);
  const isMember = Boolean(currentUser);
  const discount = getMemberDiscount(subtotal, isMember);
  const finalTotal = Math.max(0, subtotal - discount);

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const name = formData.name.trim();
    const email = normalizeEmail(formData.email);
    const phone = formData.phone.trim();
    const guests = Number(formData.guests);

    if (!name) return "Please enter your full name.";
    if (!isValidEmail(email)) return "Please enter a valid email address.";
    if (phone.length < 7) return "Please enter a valid phone number.";
    if (!formData.date) return "Please choose a booking date.";
    if (formData.date < getTodayInputValue()) return "Please choose today or a future date.";
    if (!formData.time) return "Please choose a booking time.";
    if (!Number.isInteger(guests) || guests < 1) return "Please select the number of guests.";

    return "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationMessage = validate();
    if (validationMessage) {
      setStatus(validationMessage);
      return;
    }

    const name = formData.name.trim();
    const email = normalizeEmail(formData.email);
    const phone = formData.phone.trim();
    const guests = Number(formData.guests);
    const specialRequests = formData.specialRequests.trim();

    setLoading(true);
    setStatus("Saving your booking and sending confirmation...");

    const orderText = orderLines.length
      ? orderLines
          .map(
            (item) =>
              `${item.name} x ${item.quantity} = ${formatCurrency(item.price)} x ${item.quantity} = ${formatCurrency(
                item.lineTotal
              )}`
          )
          .join("\n")
      : "No food items selected yet.";

    const bookingMessage = `Booking Details:\n-------------------------\nName: ${name}\nPhone: ${phone}\nDate: ${formData.date}\nTime: ${formData.time}\nGuests: ${guests}\n\nOrder:\n${orderText}\n\nSubtotal: ${formatCurrency(subtotal)}\nMember Discount: ${discount > 0 ? `- ${formatCurrency(discount)}` : formatCurrency(0)}\nTotal: ${formatCurrency(finalTotal)}\n\nSpecial Requests:\n${specialRequests || "None"}\n\nWe look forward to serving you at Sunset View Point!`;

    const emailParams = {
      email,
      name,
      title: "Your Sunset View Point Booking",
      message: bookingMessage,
      time: new Date().toLocaleString(),
      date: formData.date,
      "number of guests": guests.toString(),
      total: formatCurrency(finalTotal),
    };

    try {
      const customerRef = doc(db, "customers", email);

      await setDoc(
        customerRef,
        {
          fullName: name,
          email,
          phone,
          userId: currentUser?.uid ?? null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await addDoc(collection(customerRef, "bookings"), {
        fullName: name,
        email,
        phone,
        date: formData.date,
        time: formData.time,
        numberOfGuests: guests,
        specialRequests,
        order: orderLines.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          price: item.price,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        })),
        pricing: {
          subtotal,
          memberDiscountRate: isMember ? MEMBER_DISCOUNT_RATE : 0,
          discount,
          total: finalTotal,
          currency: "PKR",
        },
        isMember,
        userId: currentUser?.uid ?? null,
        createdAt: serverTimestamp(),
      });

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailParams, PUBLIC_KEY);

      setIsSubmitted(true);
      setStatus("Booking saved and confirmation email sent.");
    } catch (err: any) {
      console.error("[BookingForm] Error:", err);
      setStatus(`Booking failed: ${err?.text || err?.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="overflow-hidden border-primary/25 bg-primary/5 shadow-xl shadow-primary/10">
        <CardContent className="p-7 text-center sm:p-8">
          <div className="mx-auto mb-5 grid size-18 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <h3 className="mb-2 text-2xl font-black text-foreground">Booking Confirmed!</h3>
          <p className="mx-auto mb-6 max-w-md text-muted-foreground">
            A confirmation email has been sent to <strong>{normalizeEmail(formData.email)}</strong>.
          </p>

          <div className="space-y-4 rounded-3xl border border-border/70 bg-card p-5 text-left shadow-sm">
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <p><strong>Date:</strong> {formData.date}</p>
              <p><strong>Time:</strong> {formData.time}</p>
              <p><strong>Guests:</strong> {formData.guests}</p>
              <p><strong>Member:</strong> {isMember ? "Yes, 25% discount applied" : "No"}</p>
            </div>

            <div className="border-t border-border/70 pt-4">
              <h4 className="mb-3 flex items-center gap-2 font-bold">
                <ReceiptText className="h-4 w-4 text-primary" /> Order Summary
              </h4>

              {orderLines.length ? (
                <div className="space-y-2">
                  {orderLines.map((item) => (
                    <div key={item.id} className="flex justify-between gap-3 text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span className="font-medium">{formatCurrency(item.lineTotal)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No food items selected.</p>
              )}

              <div className="mt-4 space-y-2 border-t border-border/70 pt-4 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                {isMember && (
                  <div className="flex justify-between text-primary">
                    <span>Member discount 25%</span><span>- {formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-black">
                  <span>Total</span><span>{formatCurrency(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => {
              setFormData(initialFormData);
              setIsSubmitted(false);
              setStatus("");
              onClearOrder();
            }}
            variant="outline"
            className="mt-5"
          >
            Make Another Booking
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-xl shadow-primary/5">
      <CardHeader className="border-b border-border/70 bg-gradient-to-r from-primary/10 to-transparent p-6">
        <CardTitle className="flex items-center gap-3 text-2xl font-black">
          <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Calendar className="h-5 w-5" />
          </span>
          Table Reservation
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Fill in your details. Your selected menu items are saved in the live total.
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-7">
          <div className={cn("rounded-2xl border p-4 text-sm", isMember ? "border-primary/25 bg-primary/10 text-primary" : "border-border bg-muted/50 text-muted-foreground")}>
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold text-foreground">{isMember ? "Member discount active" : "Member discount available"}</p>
                <p>{isMember ? "You are logged in, so 25% off selected food is applied." : "Log in before booking to unlock 25% off selected food."}</p>
              </div>
            </div>
          </div>

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-foreground">Personal information</h3>
              <p className="mt-1 text-sm text-muted-foreground">We will use these details for your confirmation email.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Your name" autoComplete="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="03xx xxxxxxx" autoComplete="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} required />
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-foreground">Reservation details</h3>
              <p className="mt-1 text-sm text-muted-foreground">Golden hour seats are best around 6:00 PM to 7:30 PM.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  min={getTodayInputValue()}
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Select value={formData.time} onValueChange={(value) => handleInputChange("time", value)}>
                  <SelectTrigger id="time" className="h-11 rounded-xl">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="13:00">1:00 PM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="18:00">6:00 PM - sunset pick</SelectItem>
                    <SelectItem value="19:00">7:00 PM - sunset pick</SelectItem>
                    <SelectItem value="20:00">8:00 PM</SelectItem>
                    <SelectItem value="21:00">9:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests">Number of Guests</Label>
              <Select value={formData.guests} onValueChange={(value) => handleInputChange("guests", value)}>
                <SelectTrigger id="guests" className="h-11 rounded-xl">
                  <SelectValue placeholder="Select guests" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, index) => index + 1).map((guestCount) => (
                    <SelectItem key={guestCount} value={guestCount.toString()}>
                      {guestCount} {guestCount === 1 ? "guest" : "guests"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea
              id="specialRequests"
              placeholder="Dietary restrictions, birthday setup, preferred seating..."
              value={formData.specialRequests}
              onChange={(e) => handleInputChange("specialRequests", e.target.value)}
              rows={4}
            />
          </div>

          <Card className="border-primary/20 bg-primary/5 py-0">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-black"><ReceiptText className="h-5 w-5 text-primary" /> Live Total</h3>
                <span className="rounded-full bg-card px-3 py-1 text-xs font-bold text-muted-foreground shadow-sm">
                  {orderLines.length} line{orderLines.length === 1 ? "" : "s"}
                </span>
              </div>

              {orderLines.length ? (
                <div className="space-y-2">
                  {orderLines.map((item) => (
                    <div key={item.id} className="flex justify-between gap-3 text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span className="font-medium">{formatCurrency(item.lineTotal)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-border bg-card/70 p-4 text-sm text-muted-foreground">
                  No food selected yet. You can still reserve a table and order later.
                </p>
              )}

              <div className="space-y-2 border-t border-border/70 pt-4 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                {isMember && (
                  <div className="flex justify-between text-primary"><span>Member discount 25%</span><span>- {formatCurrency(discount)}</span></div>
                )}
                <div className="flex justify-between text-xl font-black"><span>Total</span><span>{formatCurrency(finalTotal)}</span></div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <>Confirming...</>
            ) : (
              <><MailCheck className="h-5 w-5" /> Confirm Booking</>
            )}
          </Button>

          <div className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-2">
            <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Best views: 6:00 PM - 7:30 PM</p>
            <p className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Groups up to 20 guests online</p>
          </div>

          {status && (
            <p className={cn("rounded-2xl border px-4 py-3 text-center text-sm font-medium", getStatusClass(status))} aria-live="polite">
              {status}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
