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

// ✅ Firestore imports
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// ✅ Use YOUR db export (adjust path to your project)
import { db } from "@/lib/firebase"; // e.g. export const db = getFirestore(app);

const PUBLIC_KEY = "nXQldBEXxkP9OvbsA";
const SERVICE_ID = "service_po9ijq4";
const TEMPLATE_ID = "template_tvw22j5";

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

    const { name, email, phone, subject, message } = formData;

    // Validation
    if (!email.includes("@") || !email.endsWith(".com")) {
      setStatus("Please enter a valid email (must contain @ and end with .com).");
      return;
    }
    if (!name.trim()) {
      setStatus("Name is required.");
      return;
    }
    if (!message.trim()) {
      setStatus("Message cannot be empty.");
      return;
    }

    setLoading(true);
    setStatus("Sending...");

    const subjectLabelMap: Record<string, string> = {
      reservation: "Reservation Inquiry",
      event: "Private Event",
      feedback: "Feedback",
      catering: "Catering Services",
      other: "Other",
    };

    const subjectLabel =
      subjectLabelMap[subject] || (subject ? subject : "General Inquiry");

    // EmailJS template params
    const params = {
      email,
      name,
      title: subjectLabel || "Thanks for contacting us!",
      message:
        `Phone: ${phone || "Not provided"}\n` +
        `Subject: ${subjectLabel}\n\n` +
        `${message}`,
      time: new Date().toLocaleString(),
    };

    try {
      // ✅ 1) Save to Firestore
      await addDoc(collection(db, "Contact"), {
        name,
        email,
        phone: phone || "",
        subject: subjectLabel,
        message,
        createdAt: serverTimestamp(),
        // optional: keep a client-readable time too
        createdAtClient: new Date().toISOString(),
      });

      // ✅ 2) Send email via EmailJS
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY);

      setIsSubmitted(true);
      setStatus("Sent! Check your inbox/spam folder.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      console.error("[ContactForm] submit error:", err);
      setStatus(`Failed ❌ ${err?.text || err?.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

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
