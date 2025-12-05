// D:\CO Laptop Data\sunset-view-point-main\components\contact-form.tsx
"use client";

import type React from "react";
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
import { Mail } from "lucide-react";

const PUBLIC_KEY = "nXQldBEXxkP9OvbsA";
const SERVICE_ID = "service_po9ijq4";
const TEMPLATE_ID = "template_tvw22j5";

// Safe to keep; but we'll ALSO pass PUBLIC_KEY directly to send()
emailjs.init(PUBLIC_KEY);

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("[ContactForm] submit clicked");

    const { name, email, phone, subject, message } = formData;

    // Validation
    if (!email.includes("@") || !email.endsWith(".com")) {
      setStatus("Please enter a valid email (must contain @ and end with .com).");
      console.log("[ContactForm] invalid email:", email);
      return;
    }

    if (!name.trim()) {
      setStatus("Name is required.");
      console.log("[ContactForm] missing name");
      return;
    }

    if (!message.trim()) {
      setStatus("Message cannot be empty.");
      console.log("[ContactForm] missing message");
      return;
    }

    setLoading(true);
    setStatus("Sending...");
    console.log("[ContactForm] sending via EmailJS…");

    // Map subject value to human-friendly label
    const subjectLabelMap: Record<string, string> = {
      reservation: "Reservation Inquiry",
      event: "Private Event",
      feedback: "Feedback",
      catering: "Catering Services",
      other: "Other",
    };

    const subjectLabel =
      subjectLabelMap[subject] || (subject ? subject : "General Inquiry");

    // MUST match your EmailJS template variables: email, name, title, message, time
    const params = {
      email, // To Email: {{email}}
      name,  // From Name: {{name}}
      title: subjectLabel || "Thanks for booking!",
      message:
        `Phone: ${phone || "Not provided"}\n` +
        `Subject: ${subjectLabel}\n\n` +
        `${message}`,
      time: new Date().toLocaleString(), // For {{time}} in your template
    };

    console.log("[ContactForm] params being sent to EmailJS:", params);

    try {
      const res = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        params,
        PUBLIC_KEY // ✅ pass key explicitly
      );
      console.log("[ContactForm] EmailJS success:", res);

      setIsSubmitted(true);
      setStatus("Sent! Check your inbox/spam folder.");

      // Clear fields
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      console.error("[ContactForm] EmailJS error:", err);
      setStatus(`Failed ❌ ${err?.text || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  // Success card (same style as your old component)
  if (isSubmitted) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Message Sent!
          </h3>
          <p className="text-muted-foreground mb-4">
            Thank you for reaching out. We&apos;ll get back to you within 24 hours.
          </p>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setStatus("");
            }}
            variant="outline"
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Form UI
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Send us a Message
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-phone">Phone (Optional)</Label>
            <Input
              id="contact-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-subject">Subject</Label>
            <Select
              value={formData.subject}
              onValueChange={(value) => handleInputChange("subject", value)}
            >
              <SelectTrigger id="contact-subject">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reservation">Reservation Inquiry</SelectItem>
                <SelectItem value="event">Private Event</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="catering">Catering Services</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea
              id="contact-message"
              placeholder="Tell us how we can help you..."
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={5}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>

          {status && (
            <p className="text-sm mt-2 text-muted-foreground">{status}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
