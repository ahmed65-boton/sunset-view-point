// D:\CO Laptop Data\sunset-view-point-main\components\booking-form.tsx
"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "lucide-react";

const PUBLIC_KEY = "nXQldBEXxkP9OvbsA";
const SERVICE_ID = "service_po9ijq4";
const TEMPLATE_ID = "template_tvw22j5";

emailjs.init(PUBLIC_KEY);

export function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    specialRequests: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, phone, date, time, guests, specialRequests } = formData;

    if (!email.includes("@") || !email.endsWith(".com")) {
      return setStatus("❌ Please enter a valid email ending with .com.");
    }

    if (!name.trim() || !date || !time || !guests) {
      return setStatus("❌ All fields except special requests are required.");
    }

    setLoading(true);
    setStatus("Sending confirmation email...");

    // Build the message body with full details
    const bookingMessage = `
Booking Details:
-------------------------
Name: ${name}
Phone: ${phone}
Date: ${date}
Time: ${time}
Guests: ${guests}

Special Requests:
${specialRequests || "None"}

We look forward to serving you at Sunset View Point!
    `;

    // MUST MATCH YOUR EMAILJS TEMPLATE VARIABLES EXACTLY
    const params = {
      email,                                 // {{email}}
      name,                                  // {{name}}
      title: "Your Sunset View Point Booking", // {{title}}
      message: bookingMessage,               // {{message}}
      time: new Date().toLocaleString(),     // {{time}}
      date,                                  // {{date}}
      "number of guests": guests,            // {{number of guests}}
    };

    try {
      const res = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        params,
        PUBLIC_KEY
      );

      console.log("EmailJS success:", res);
      setIsSubmitted(true);
      setStatus("✔ Confirmation email sent!");
    } catch (err: any) {
      console.error("EmailJS error:", err);
      setStatus(`❌ Failed to send email. ${err.text || ""}`);
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS SCREEN
  if (isSubmitted) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h3>

          <p className="text-muted-foreground mb-4">
            A confirmation email has been sent to <strong>{formData.email}</strong>.
          </p>

          <div className="bg-card p-4 rounded-lg text-left space-y-2">
            <p><strong>Date:</strong> {formData.date}</p>
            <p><strong>Time:</strong> {formData.time}</p>
            <p><strong>Guests:</strong> {formData.guests}</p>
          </div>

          <Button
            onClick={() => {
              setIsSubmitted(false);
              setStatus("");
            }}
            variant="outline"
            className="mt-4"
          >
            Make Another Booking
          </Button>
        </CardContent>
      </Card>
    );
  }

  // MAIN FORM
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Table Reservation
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* PERSONAL INFORMATION */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Personal Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>
          </div>

          {/* RESERVATION DETAILS */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Reservation Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* DATE */}
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              {/* TIME */}
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Select
                  value={formData.time}
                  onValueChange={(value) => handleInputChange("time", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:30">4:30 PM</SelectItem>
                    <SelectItem value="17:00">5:00 PM</SelectItem>
                    <SelectItem value="17:30">5:30 PM</SelectItem>
                    <SelectItem value="18:00">6:00 PM (Sunset)</SelectItem>
                    <SelectItem value="18:30">6:30 PM (Sunset)</SelectItem>
                    <SelectItem value="19:00">7:00 PM</SelectItem>
                    <SelectItem value="19:30">7:30 PM</SelectItem>
                    <SelectItem value="20:00">8:00 PM</SelectItem>
                    <SelectItem value="20:30">8:30 PM</SelectItem>
                    <SelectItem value="21:00">9:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* NUMBER OF GUESTS */}
              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Select
                  value={formData.guests}
                  onValueChange={(value) => handleInputChange("guests", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* SPECIAL REQUESTS */}
          <div className="space-y-2">
            <Label htmlFor="requests">Special Requests (Optional)</Label>
            <Textarea
              id="requests"
              placeholder="Dietary restrictions, seating preferences..."
              value={formData.specialRequests}
              onChange={(e) => handleInputChange("specialRequests", e.target.value)}
              rows={3}
            />
          </div>

          {/* SUBMIT */}
          <Button type="submit" className="w-full text-lg py-6" disabled={loading}>
            {loading ? "Sending..." : "Confirm Reservation"}
          </Button>

          {status && <p className="text-sm text-muted-foreground">{status}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
