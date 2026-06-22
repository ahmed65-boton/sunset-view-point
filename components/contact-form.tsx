"use client";

import type React from "react";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Mail, Send, Sparkles } from "lucide-react";

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
import { db } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "nXQldBEXxkP9OvbsA";
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_po9ijq4";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID || "template_tvw22j5";

if (PUBLIC_KEY) {
  emailjs.init(PUBLIC_KEY);
}

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function getStatusClass(status: string) {
  const lower = status.toLowerCase();
  if (lower.includes("failed") || lower.includes("please") || lower.includes("empty")) {
    return "border-destructive/25 bg-destructive/10 text-destructive";
  }
  if (lower.includes("sent")) return "border-primary/25 bg-primary/10 text-primary";
  return "border-border bg-muted/70 text-muted-foreground";
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const message = formData.message.trim();

    if (!name) {
      setStatus("Please enter your name.");
      return;
    }

    if (!isValidEmail(email)) {
      setStatus("Please enter a valid email address.");
      return;
    }

    if (!formData.subject) {
      setStatus("Please select a subject.");
      return;
    }

    if (!message) {
      setStatus("Message cannot be empty.");
      return;
    }

    setLoading(true);
    setStatus("Sending your message...");

    const subjectLabelMap: Record<string, string> = {
      reservation: "Reservation Inquiry",
      event: "Private Event",
      feedback: "Feedback",
      catering: "Catering Services",
      other: "Other",
    };

    const subjectLabel = subjectLabelMap[formData.subject] || "General Inquiry";

    const params = {
      email,
      name,
      title: subjectLabel,
      message: `Phone: ${phone || "Not provided"}\nSubject: ${subjectLabel}\n\n${message}`,
      time: new Date().toLocaleString(),
    };

    try {
      const customerRef = doc(db, "customers", email);

      await setDoc(
        customerRef,
        {
          fullName: name,
          email,
          phone,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await addDoc(collection(customerRef, "contactMessages"), {
        name,
        email,
        phone,
        subject: subjectLabel,
        message,
        createdAt: serverTimestamp(),
        createdAtClient: new Date().toISOString(),
      });

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY);

      setIsSubmitted(true);
      setStatus("Message sent. Please check your inbox or spam folder for a copy.");
      setFormData(initialFormData);
    } catch (err: any) {
      console.error("[ContactForm] submit error:", err);
      setStatus(`Failed to send: ${err?.text || err?.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="overflow-hidden border-primary/25 bg-primary/5 shadow-xl shadow-primary/10">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-5 grid size-18 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <Mail className="h-9 w-9" />
          </div>
          <h3 className="mb-2 text-2xl font-black text-foreground">Message Sent!</h3>
          <p className="mx-auto mb-5 max-w-md text-muted-foreground">Thank you for reaching out. We will get back to you within 24 hours.</p>
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
    <Card className="overflow-hidden shadow-xl shadow-primary/5">
      <CardHeader className="border-b border-border/70 bg-gradient-to-r from-primary/10 to-transparent p-6">
        <CardTitle className="flex items-center gap-3 text-2xl font-black">
          <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </span>
          Send us a message
        </CardTitle>
        <p className="text-sm text-muted-foreground">Share the details and our team will follow up as soon as possible.</p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p><span className="font-bold text-foreground">Tip:</span> Include your preferred date, time, and guest count for faster reservation support.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input id="contact-name" placeholder="Your name" autoComplete="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input id="contact-email" type="email" placeholder="you@example.com" autoComplete="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-phone">Phone (Optional)</Label>
            <Input id="contact-phone" type="tel" placeholder="03xx xxxxxxx" autoComplete="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-subject">Subject</Label>
            <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
              <SelectTrigger id="contact-subject" className="h-11 rounded-xl">
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

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Sending..." : <><Send className="h-5 w-5" /> Send Message</>}
          </Button>

          {status && <p className={cn("rounded-2xl border px-4 py-3 text-sm font-medium", getStatusClass(status))} aria-live="polite">{status}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
