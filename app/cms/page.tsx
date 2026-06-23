"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarClock,
  Check,
  Download,
  Edit3,
  Eye,
  FileText,
  ImagePlus,
  ListFilter,
  Megaphone,
  Plus,
  RefreshCw,
  Save,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Upload,
  UserCog,
  Utensils,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/navigation";
import { formatCurrency } from "@/lib/menu";
import { cn } from "@/lib/utils";

type StatsWindow = {
  totalBookings: number;
  subtotalMade: number;
  totalMade: number;
};

type DashboardStats = {
  lastDay: StatsWindow;
  lastWeek: StatsWindow;
  lastMonth: StatsWindow;
  lastYear: StatsWindow;
};

type RevenueTrend = { label: string; subtotal: number; total: number; bookings: number };
type TopItem = { name: string; quantity: number; total: number };
type BusiestSlot = { label: string; bookings: number; guests: number };

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
type PaymentStatus = "unpaid" | "paid" | "refunded";
type StaffRole = "owner" | "manager" | "viewer";

type BookingOrderItem = {
  id?: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  lineTotal?: number;
};

type CmsBooking = {
  id: string;
  customerId: string;
  fullName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  numberOfGuests: number;
  specialRequests: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  order: BookingOrderItem[];
  pricing: {
    subtotal: number;
    discount: number;
    total: number;
    memberDiscountRate: number;
    currency: string;
  };
  isMember: boolean;
  createdAt: string | null;
  updatedAt?: string | null;
};

type CmsMenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
};

type CmsSettings = {
  maxGuestsPerSlot: number;
  maxGuestsPerBooking: number;
  openingTime: string;
  closingTime: string;
  bookingIntervalMinutes: number;
  blackoutDates: string[];
  announcementEnabled: boolean;
  announcementText: string;
  announcementHref: string;
};

type CmsPageBlockType = "richText" | "h1" | "imageText" | "cards" | "gallery" | "quote" | "cta" | "divider";
type CmsImagePosition = "left" | "right";

type CmsPageSection = {
  type: CmsPageBlockType;
  eyebrow: string;
  heading: string;
  subheading: string;
  body: string;
  image: string;
  imageAlt: string;
  imagePosition: CmsImagePosition;
  ctaLabel: string;
  ctaHref: string;
};

type CmsPageRecord = {
  id: string;
  title: string;
  slug: string;
  kicker: string;
  description: string;
  heroImage: string;
  isPublished: boolean;
  showInNav: boolean;
  sections: CmsPageSection[];
  createdAt?: string | null;
  updatedAt?: string | null;
};

type CmsStaffRecord = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type CmsAuditLog = {
  id: string;
  action: string;
  target: string;
  actor: string;
  details: Record<string, unknown>;
  createdAt: string | null;
};

type DashboardResponse = {
  ok: boolean;
  message?: string;
  stats: DashboardStats;
  dashboard?: {
    revenueTrend: RevenueTrend[];
    topItems: TopItem[];
    busiestSlots: BusiestSlot[];
  };
  bookings: CmsBooking[];
};

type MenuResponse = {
  ok: boolean;
  message?: string;
  items: CmsMenuItem[];
  categories: string[];
};

type SettingsResponse = { ok: boolean; message?: string; settings: CmsSettings };
type PagesResponse = { ok: boolean; message?: string; pages: CmsPageRecord[] };
type StaffResponse = { ok: boolean; message?: string; staff: CmsStaffRecord[] };
type AuditResponse = { ok: boolean; message?: string; logs: CmsAuditLog[] };

type CmsTab = "overview" | "bookings" | "menu" | "settings" | "pages" | "staff" | "audit";
type PageTemplateKey = "blank" | "about" | "events" | "gallery" | "landing";

const blankStats: DashboardStats = {
  lastDay: { totalBookings: 0, subtotalMade: 0, totalMade: 0 },
  lastWeek: { totalBookings: 0, subtotalMade: 0, totalMade: 0 },
  lastMonth: { totalBookings: 0, subtotalMade: 0, totalMade: 0 },
  lastYear: { totalBookings: 0, subtotalMade: 0, totalMade: 0 },
};

const blankSettings: CmsSettings = {
  maxGuestsPerSlot: 20,
  maxGuestsPerBooking: 15,
  openingTime: "10:00",
  closingTime: "21:00",
  bookingIntervalMinutes: 30,
  blackoutDates: [],
  announcementEnabled: false,
  announcementText: "",
  announcementHref: "",
};

const blankMenuForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  image: "/placeholder.svg?height=108&width=108",
};

const blankPageForm: Omit<CmsPageRecord, "id"> = {
  title: "",
  slug: "",
  kicker: "Sunset View Point",
  description: "",
  heroImage: "/sunset.jpg",
  isPublished: false,
  showInNav: true,
  sections: [
    {
      type: "h1",
      eyebrow: "New page",
      heading: "Write a big headline here",
      subheading: "Add a short intro that feels like the home page hero.",
      body: "",
      image: "",
      imageAlt: "",
      imagePosition: "right",
      ctaLabel: "Book now",
      ctaHref: "/booking",
    },
    {
      type: "richText",
      eyebrow: "Details",
      heading: "Section heading",
      subheading: "",
      body: "Write the main page text here. Use blank lines to create paragraphs.",
      image: "",
      imageAlt: "",
      imagePosition: "right",
      ctaLabel: "",
      ctaHref: "",
    },
  ],
};

const blankStaffForm = {
  name: "",
  email: "",
  role: "viewer" as StaffRole,
  isActive: true,
};

const statCards: Array<{ key: keyof DashboardStats; title: string; subtitle: string }> = [
  { key: "lastDay", title: "Last day", subtitle: "Rolling 24 hours" },
  { key: "lastWeek", title: "Last week", subtitle: "Rolling 7 days" },
  { key: "lastMonth", title: "Last month", subtitle: "Rolling 30 days" },
  { key: "lastYear", title: "Last year", subtitle: "Rolling 365 days" },
];

const bookingStatuses: BookingStatus[] = ["pending", "confirmed", "cancelled", "completed"];
const paymentStatuses: PaymentStatus[] = ["unpaid", "paid", "refunded"];
const staffRoles: StaffRole[] = ["owner", "manager", "viewer"];

const pageBlockTypes: CmsPageBlockType[] = ["h1", "richText", "imageText", "cards", "gallery", "quote", "cta", "divider"];
const pageBlockLabels: Record<CmsPageBlockType, string> = {
  h1: "Home-style H1",
  richText: "Text section",
  imageText: "Image + text",
  cards: "Cards grid",
  gallery: "Image gallery",
  quote: "Quote / highlight",
  cta: "Call to action",
  divider: "Divider / spacer",
};

const pageTemplateLabels: Record<PageTemplateKey, string> = {
  blank: "Blank builder",
  about: "About / story",
  events: "Private events",
  gallery: "Gallery",
  landing: "Promo landing",
};

function makePageTemplate(template: PageTemplateKey): Omit<CmsPageRecord, "id"> {
  if (template === "about") {
    return {
      ...blankPageForm,
      title: "Our Story",
      slug: "our-story",
      kicker: "About Sunset View Point",
      description: "Warm dining, valley views, and familiar flavours served with care.",
      heroImage: "/our_story.webp",
      sections: [
        { ...makePageBlock("h1"), eyebrow: "Welcome", heading: "A hilltop dining experience made for families, friends, and golden-hour views.", subheading: "Use this section for your main about-page headline.", body: "Edit this text to tell the story of Sunset View Point, what makes the place special, and what guests should expect when they visit.", ctaLabel: "Book a table", ctaHref: "/booking" },
        { ...makePageBlock("imageText"), eyebrow: "Our place", heading: "Comfort food with a scenic view", body: "Add your restaurant story here. You can talk about the location, the menu, the service style, and why people come back.", image: "/sunset.jpg", imageAlt: "Sunset View Point view", imagePosition: "left" },
        { ...makePageBlock("cards"), eyebrow: "Why visit", heading: "What guests love", subheading: "Replace these cards with your real highlights.", body: "Family friendly | Comfortable dining for families and groups | Book now | /booking | /sunset.jpg\nScenic views | Enjoy Quetta valley views with your meal | Contact us | /contact | /svp.jpg\nFresh favourites | Traditional favourites and crowd-pleasing dishes | See menu | /booking | /tikk.jpg" },
        { ...makePageBlock("cta"), eyebrow: "Visit us", heading: "Plan your next meal at Sunset View Point", subheading: "Reserve your table online or contact us for group bookings.", ctaLabel: "Book now", ctaHref: "/booking" },
      ],
    };
  }

  if (template === "events") {
    return {
      ...blankPageForm,
      title: "Private Events",
      slug: "private-events",
      kicker: "Events at Sunset View Point",
      description: "Host birthdays, family dinners, corporate meals, and special gatherings with a valley-view backdrop.",
      heroImage: "/sunset.jpg",
      sections: [
        { ...makePageBlock("h1"), eyebrow: "Celebrate", heading: "A warm setting for birthdays, dinners, and special gatherings.", subheading: "Customize this page with your event details, packages, and booking instructions.", ctaLabel: "Ask about events", ctaHref: "/contact" },
        { ...makePageBlock("cards"), eyebrow: "Event types", heading: "Perfect for", subheading: "Add or remove lines to change the cards.", body: "Birthday dinners | Make birthdays feel special with a table setup and menu favourites | Enquire | /contact | /sunset.jpg\nFamily gatherings | Comfortable group dining for family meals and reunions | Book now | /booking | /svp.jpg\nCorporate meals | Host team dinners and client meals with scenic views | Contact us | /contact | /elegant-restaurant-dining-room-with-warm-lighting.png" },
        { ...makePageBlock("imageText"), eyebrow: "Planning", heading: "Tell guests how event booking works", body: "Use this block for minimum notice, group size guidance, menu options, deposits, decoration rules, or contact instructions.", image: "/variety-of-elegant-dishes-on-restaurant-table.png", imageAlt: "Restaurant table", imagePosition: "right", ctaLabel: "Contact us", ctaHref: "/contact" },
        { ...makePageBlock("quote"), eyebrow: "Tip", heading: "Groups larger than 15 should contact us first.", body: "This helps staff confirm seating and timing before the guest arrives." },
        { ...makePageBlock("cta"), eyebrow: "Ready?", heading: "Start planning your event", subheading: "Send us your date, time, guest count, and any special requests.", ctaLabel: "Contact us", ctaHref: "/contact" },
      ],
    };
  }

  if (template === "gallery") {
    return {
      ...blankPageForm,
      title: "Gallery",
      slug: "gallery",
      kicker: "Sunset View Point Photos",
      description: "A look at the views, dining area, and food at Sunset View Point.",
      heroImage: "/svp.jpg",
      sections: [
        { ...makePageBlock("h1"), eyebrow: "Photos", heading: "See the view, the food, and the atmosphere before you visit.", subheading: "Upload your own images or paste public image paths below.", ctaLabel: "Book now", ctaHref: "/booking" },
        { ...makePageBlock("gallery"), eyebrow: "Gallery", heading: "Moments from Sunset View Point", subheading: "Add one image URL per line.", body: "/sunset.jpg\n/svp.jpg\n/variety-of-elegant-dishes-on-restaurant-table.png\n/elegant-restaurant-dining-room-with-warm-lighting.png" },
        { ...makePageBlock("cta"), eyebrow: "Visit", heading: "Come experience it in person", subheading: "Reserve your table and enjoy the view.", ctaLabel: "Book now", ctaHref: "/booking" },
      ],
    };
  }

  if (template === "landing") {
    return {
      ...blankPageForm,
      title: "Special Offer",
      slug: "special-offer",
      kicker: "Limited Time",
      description: "Create a focused promotional page for an offer, event, or seasonal menu.",
      heroImage: "/sunset.jpg",
      sections: [
        { ...makePageBlock("h1"), eyebrow: "Featured", heading: "Write a strong offer headline here", subheading: "Use this page for promotions, seasonal specials, or announcements.", body: "Add the main details guests need to know: dates, timing, price, terms, and how to book.", ctaLabel: "Book now", ctaHref: "/booking" },
        { ...makePageBlock("cards"), eyebrow: "Includes", heading: "Offer highlights", body: "Highlight one | Explain the first benefit | Book | /booking | /sunset.jpg\nHighlight two | Explain the second benefit | Contact | /contact | /svp.jpg\nHighlight three | Explain the third benefit | Learn more | /contact" },
        { ...makePageBlock("cta"), eyebrow: "Do not miss it", heading: "Reserve before slots fill up", subheading: "Use the booking form or contact us for help.", ctaLabel: "Book now", ctaHref: "/booking" },
      ],
    };
  }

  return { ...blankPageForm, sections: normalizePageBlocks(blankPageForm.sections) };
}

function makePageBlock(type: CmsPageBlockType = "richText"): CmsPageSection {
  const base: CmsPageSection = {
    type,
    eyebrow: "",
    heading: "",
    subheading: "",
    body: "",
    image: "",
    imageAlt: "",
    imagePosition: "right",
    ctaLabel: "",
    ctaHref: "",
  };

  if (type === "h1") {
    return { ...base, eyebrow: "Featured", heading: "Big page headline", subheading: "Short supporting text under the headline.", ctaLabel: "Book now", ctaHref: "/booking" };
  }
  if (type === "richText") {
    return { ...base, eyebrow: "Details", heading: "Section heading", body: "Write your page text here. Use blank lines for paragraphs." };
  }
  if (type === "imageText") {
    return { ...base, eyebrow: "Experience", heading: "Image and text section", body: "Explain this part of the page here.", image: "/sunset.jpg", imageAlt: "Sunset View Point" };
  }
  if (type === "cards") {
    return { ...base, eyebrow: "Highlights", heading: "Cards section", subheading: "Add one card per line below.", body: "Card title | Card text | Button label | /booking | /sunset.jpg\nSecond card | More details | Learn more | /contact" };
  }
  if (type === "gallery") {
    return { ...base, eyebrow: "Gallery", heading: "Photo gallery", subheading: "Add one image URL per line in the body box.", body: "/sunset.jpg" };
  }
  if (type === "quote") {
    return { ...base, eyebrow: "Highlight", heading: "A short standout message", body: "Use this for a quote, promise, special note, or important announcement." };
  }
  if (type === "cta") {
    return { ...base, eyebrow: "Ready?", heading: "Book your table today", subheading: "Reserve your visit to Sunset View Point.", ctaLabel: "Book now", ctaHref: "/booking" };
  }
  return { ...base, heading: "Divider" };
}

function normalizePageBlocks(sections: unknown): CmsPageSection[] {
  if (!Array.isArray(sections)) return [];
  return sections.map((section) => {
    const raw = (section ?? {}) as Partial<CmsPageSection> & { type?: string };
    const type = pageBlockTypes.includes(raw.type as CmsPageBlockType) ? (raw.type as CmsPageBlockType) : "richText";
    return {
      ...makePageBlock(type),
      ...raw,
      type,
      eyebrow: String(raw.eyebrow ?? ""),
      heading: String(raw.heading ?? ""),
      subheading: String(raw.subheading ?? ""),
      body: String(raw.body ?? ""),
      image: String(raw.image ?? ""),
      imageAlt: String(raw.imageAlt ?? ""),
      imagePosition: raw.imagePosition === "left" ? "left" : "right",
      ctaLabel: String(raw.ctaLabel ?? ""),
      ctaHref: String(raw.ctaHref ?? ""),
    };
  });
}

function pageBlockHelp(type: CmsPageBlockType) {
  if (type === "cards") return "Cards: one card per line. Format: Title | Text | Button label | /link | optional image";
  if (type === "gallery") return "Gallery: add one image URL per line. Uploaded images can be pasted here.";
  if (type === "h1") return "Home-style H1: use this for a big headline block inside the page.";
  if (type === "imageText") return "Image + text: upload or paste an image URL, then write text beside it.";
  if (type === "quote") return "Quote: use heading for the quote title and body for the quote text.";
  if (type === "cta") return "Call to action: heading, short text, and a button.";
  if (type === "divider") return "Divider: creates visual breathing room between blocks.";
  return "Text section: heading plus fully customizable paragraphs.";
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "No timestamp";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "No timestamp";
  return dt.toLocaleString();
}

function formatSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getStatusClass(status: string) {
  const lower = status.toLowerCase();
  if (lower.includes("saved") || lower.includes("loaded") || lower.includes("added") || lower.includes("removed") || lower.includes("uploaded")) {
    return "border-primary/25 bg-primary/10 text-primary";
  }
  if (lower.includes("loading") || lower.includes("saving") || lower.includes("uploading")) {
    return "border-border bg-muted/70 text-muted-foreground";
  }
  return "border-destructive/25 bg-destructive/10 text-destructive";
}

function getBookingBadgeClass(value: BookingStatus) {
  if (value === "confirmed" || value === "completed") return "border-primary/25 bg-primary/10 text-primary";
  if (value === "cancelled") return "border-destructive/25 bg-destructive/10 text-destructive";
  return "border-border bg-muted text-muted-foreground";
}

function getPaymentBadgeClass(value: PaymentStatus) {
  if (value === "paid") return "border-primary/25 bg-primary/10 text-primary";
  if (value === "refunded") return "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  return "border-border bg-muted text-muted-foreground";
}

function recalculateOrder(order: BookingOrderItem[]) {
  return order.map((item) => ({
    ...item,
    price: Number(item.price || 0),
    quantity: Math.max(1, Number(item.quantity || 1)),
    lineTotal: Number(item.price || 0) * Math.max(1, Number(item.quantity || 1)),
  }));
}

function downloadBlob(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function SelectField<T extends string>({
  value,
  values,
  onChange,
  label,
}: {
  value: T;
  values: T[];
  onChange: (value: T) => void;
  label?: string;
}) {



  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
      className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {values.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}

function MiniBar({ label, value, max, caption }: { label: string; value: number; max: number; caption: string }) {
  const width = max > 0 ? Math.max(6, Math.round((value / max) * 100)) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="truncate font-bold text-foreground">{label}</span>
        <span className="shrink-0 text-xs text-muted-foreground">{caption}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default function CmsPage() {
  const [tokenInput, setTokenInput] = useState("");
  const [cmsToken, setCmsToken] = useState("");
  const [activeTab, setActiveTab] = useState<CmsTab>("overview");
  const [stats, setStats] = useState<DashboardStats>(blankStats);
  const [revenueTrend, setRevenueTrend] = useState<RevenueTrend[]>([]);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [busiestSlots, setBusiestSlots] = useState<BusiestSlot[]>([]);
  const [bookings, setBookings] = useState<CmsBooking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [orderDraft, setOrderDraft] = useState<BookingOrderItem[]>([]);
  const [specialRequestsDraft, setSpecialRequestsDraft] = useState("");
  const [bookingStatusDraft, setBookingStatusDraft] = useState<BookingStatus>("pending");
  const [paymentStatusDraft, setPaymentStatusDraft] = useState<PaymentStatus>("unpaid");
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingDateFilter, setBookingDateFilter] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<BookingStatus | "all">("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | "all">("all");
  const [menuItems, setMenuItems] = useState<CmsMenuItem[]>([]);
  const [menuDrafts, setMenuDrafts] = useState<Record<number, CmsMenuItem>>({});
  const [newMenuItem, setNewMenuItem] = useState(blankMenuForm);
  const [settingsDraft, setSettingsDraft] = useState<CmsSettings>(blankSettings);
  const [blackoutInput, setBlackoutInput] = useState("");
  const [pages, setPages] = useState<CmsPageRecord[]>([]);
  const [pageDrafts, setPageDrafts] = useState<Record<string, CmsPageRecord>>({});
  const [newPage, setNewPage] = useState<Omit<CmsPageRecord, "id">>(blankPageForm);
  const [staff, setStaff] = useState<CmsStaffRecord[]>([]);
  const [staffDrafts, setStaffDrafts] = useState<Record<string, CmsStaffRecord>>({});
  const [newStaff, setNewStaff] = useState(blankStaffForm);
  const [auditLogs, setAuditLogs] = useState<CmsAuditLog[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = window.sessionStorage.getItem("svp_cms_token") || "";
    if (storedToken) {
      setTokenInput(storedToken);
      setCmsToken(storedToken);
    }
  }, []);

  const selectedBooking = useMemo(
    () => bookings.find((booking) => booking.id === selectedBookingId) ?? bookings[0] ?? null,
    [bookings, selectedBookingId]
  );

  const filteredBookings = useMemo(() => {
    const search = bookingSearch.trim().toLowerCase();
    return bookings.filter((booking) => {
      const haystack = [booking.fullName, booking.email, booking.phone, booking.date, booking.time, booking.status, booking.paymentStatus]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !search || haystack.includes(search);
      const matchesDate = !bookingDateFilter || booking.date === bookingDateFilter;
      const matchesStatus = bookingStatusFilter === "all" || booking.status === bookingStatusFilter;
      const matchesPayment = paymentStatusFilter === "all" || booking.paymentStatus === paymentStatusFilter;
      return matchesSearch && matchesDate && matchesStatus && matchesPayment;
    });
  }, [bookings, bookingDateFilter, bookingSearch, bookingStatusFilter, paymentStatusFilter]);

  const groupedMenuItems = useMemo(() => {
    const groups = new Map<string, CmsMenuItem[]>();
    menuItems.forEach((item) => {
      const current = groups.get(item.category) ?? [];
      current.push(item);
      groups.set(item.category, current);
    });
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [menuItems]);

  const loadDashboard = async (token = cmsToken) => {
    if (!token) return;

    setLoading(true);
    setStatus("Loading CMS data...");

    try {
      const headers = { "x-cms-token": token };
      const [dashboardRes, menuRes, settingsRes, pagesRes, staffRes, auditRes] = await Promise.all([
        fetch("/api/cms/dashboard", { headers }),
        fetch("/api/cms/menu", { headers }),
        fetch("/api/cms/settings", { headers }),
        fetch("/api/cms/pages", { headers }),
        fetch("/api/cms/staff", { headers }),
        fetch("/api/cms/audit", { headers }),
      ]);

      const dashboardData = (await dashboardRes.json()) as DashboardResponse;
      const menuData = (await menuRes.json()) as MenuResponse;
      const settingsData = (await settingsRes.json()) as SettingsResponse;
      const pagesData = (await pagesRes.json()) as PagesResponse;
      const staffData = (await staffRes.json()) as StaffResponse;
      const auditData = (await auditRes.json()) as AuditResponse;

      if (!dashboardRes.ok || !dashboardData.ok) throw new Error(dashboardData.message || "Dashboard load failed.");
      if (!menuRes.ok || !menuData.ok) throw new Error(menuData.message || "Menu load failed.");
      if (!settingsRes.ok || !settingsData.ok) throw new Error(settingsData.message || "Settings load failed.");
      if (!pagesRes.ok || !pagesData.ok) throw new Error(pagesData.message || "Pages load failed.");
      if (!staffRes.ok || !staffData.ok) throw new Error(staffData.message || "Staff load failed.");
      if (!auditRes.ok || !auditData.ok) throw new Error(auditData.message || "Audit load failed.");

      setStats(dashboardData.stats ?? blankStats);
      setRevenueTrend(dashboardData.dashboard?.revenueTrend ?? []);
      setTopItems(dashboardData.dashboard?.topItems ?? []);
      setBusiestSlots(dashboardData.dashboard?.busiestSlots ?? []);
      setBookings(dashboardData.bookings ?? []);
      setSelectedBookingId((current) => current || dashboardData.bookings?.[0]?.id || "");
      setMenuItems(menuData.items ?? []);
      setMenuDrafts(Object.fromEntries((menuData.items ?? []).map((item) => [item.id, { ...item }])));
      setSettingsDraft({ ...blankSettings, ...(settingsData.settings ?? {}) });
      setBlackoutInput((settingsData.settings?.blackoutDates ?? []).join("\n"));
      const normalizedPages = (pagesData.pages ?? []).map((page) => ({ ...page, sections: normalizePageBlocks(page.sections) }));
      setPages(normalizedPages);
      setPageDrafts(Object.fromEntries(normalizedPages.map((page) => [page.id, { ...page }])));
      setStaff(staffData.staff ?? []);
      setStaffDrafts(Object.fromEntries((staffData.staff ?? []).map((member) => [member.id, { ...member }])));
      setAuditLogs(auditData.logs ?? []);
      setStatus("CMS data loaded.");
    } catch (err: any) {
      setStatus(err?.message || "CMS load failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cmsToken) {
      void loadDashboard(cmsToken);
    }
  }, [cmsToken]);

  useEffect(() => {
    if (selectedBooking) {
      setOrderDraft(recalculateOrder(selectedBooking.order || []));
      setSpecialRequestsDraft(selectedBooking.specialRequests || "");
      setBookingStatusDraft(selectedBooking.status || "pending");
      setPaymentStatusDraft(selectedBooking.paymentStatus || "unpaid");
    }
  }, [selectedBooking]);

  const unlockCms = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = tokenInput.trim();
    if (!trimmed) {
      setStatus("Enter your CMS passcode.");
      return;
    }
    window.sessionStorage.setItem("svp_cms_token", trimmed);
    setCmsToken(trimmed);
  };

  const updateOrderItem = (index: number, field: keyof BookingOrderItem, value: string) => {
    setOrderDraft((current) =>
      recalculateOrder(
        current.map((item, itemIndex) => {
          if (itemIndex !== index) return item;
          if (field === "price" || field === "quantity") return { ...item, [field]: Number(value) };
          return { ...item, [field]: value };
        })
      )
    );
  };

  const removeOrderItem = (index: number) => {
    setOrderDraft((current) => recalculateOrder(current.filter((_, itemIndex) => itemIndex !== index)));
  };

  const addOrderItem = () => {
    setOrderDraft((current) => recalculateOrder([...current, { name: "New item", description: "", price: 0, quantity: 1 }]));
  };

  const saveBookingOrder = async () => {
    if (!selectedBooking) return;

    setLoading(true);
    setStatus("Saving booking...");

    try {
      const res = await fetch(`/api/cms/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-cms-token": cmsToken },
        body: JSON.stringify({
          customerId: selectedBooking.customerId,
          order: recalculateOrder(orderDraft),
          specialRequests: specialRequestsDraft,
          status: bookingStatusDraft,
          paymentStatus: paymentStatusDraft,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) throw new Error(data.message || "Booking save failed.");

      setStatus("Booking saved.");
      await loadDashboard();
    } catch (err: any) {
      setStatus(err?.message || "Booking save failed.");
    } finally {
      setLoading(false);
    }
  };

  const updateMenuDraft = (itemId: number, field: keyof CmsMenuItem, value: string | boolean) => {
    setMenuDrafts((current) => ({
      ...current,
      [itemId]: {
        ...current[itemId],
        [field]: field === "price" || field === "sortOrder" ? Number(value) : value,
      },
    }));
  };

  const uploadImage = async (file: File, onUrl: (url: string) => void, folder = "cms") => {
    setLoading(true);
    setStatus("Uploading image...");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);
      const res = await fetch("/api/cms/uploads", {
        method: "POST",
        headers: { "x-cms-token": cmsToken },
        body: form,
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Image upload failed.");
      onUrl(String(data.url));
      setStatus("Image uploaded. Save the item/page to apply it.");
    } catch (err: any) {
      setStatus(err?.message || "Image upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const saveMenuItem = async (itemId: number) => {
    const draft = menuDrafts[itemId];
    if (!draft) return;

    setLoading(true);
    setStatus("Saving menu item...");

    try {
      const res = await fetch(`/api/cms/menu/${itemId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-cms-token": cmsToken },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Menu item save failed.");

      setStatus("Menu item saved.");
      await loadDashboard();
    } catch (err: any) {
      setStatus(err?.message || "Menu item save failed.");
    } finally {
      setLoading(false);
    }
  };

  const removeMenuItem = async (itemId: number) => {
    setLoading(true);
    setStatus("Removing menu item...");

    try {
      const res = await fetch(`/api/cms/menu/${itemId}`, {
        method: "DELETE",
        headers: { "x-cms-token": cmsToken },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Menu item remove failed.");

      setStatus("Menu item removed.");
      await loadDashboard();
    } catch (err: any) {
      setStatus(err?.message || "Menu item remove failed.");
    } finally {
      setLoading(false);
    }
  };

  const addMenuItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus("Adding menu item...");

    try {
      const res = await fetch("/api/cms/menu", {
        method: "POST",
        headers: { "content-type": "application/json", "x-cms-token": cmsToken },
        body: JSON.stringify({ ...newMenuItem, price: Number(newMenuItem.price) }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Menu item add failed.");

      setNewMenuItem(blankMenuForm);
      setStatus("Menu item added.");
      await loadDashboard();
    } catch (err: any) {
      setStatus(err?.message || "Menu item add failed.");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    setStatus("Saving settings...");
    try {
      const blackoutDates = blackoutInput
        .split(/\n|,/)
        .map((date) => date.trim())
        .filter(Boolean);
      const payload = { ...settingsDraft, blackoutDates };
      const res = await fetch("/api/cms/settings", {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-cms-token": cmsToken },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Settings save failed.");
      setStatus("Settings saved.");
      await loadDashboard();
    } catch (err: any) {
      setStatus(err?.message || "Settings save failed.");
    } finally {
      setLoading(false);
    }
  };

  const addPage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus("Adding page...");
    try {
      const res = await fetch("/api/cms/pages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-cms-token": cmsToken },
        body: JSON.stringify({ ...newPage, slug: formatSlug(newPage.slug || newPage.title), sections: normalizePageBlocks(newPage.sections) }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Page add failed.");
      setNewPage(blankPageForm);
      setStatus("Page added.");
      await loadDashboard();
    } catch (err: any) {
      setStatus(err?.message || "Page add failed.");
    } finally {
      setLoading(false);
    }
  };

  const updatePageDraft = <K extends keyof CmsPageRecord>(pageId: string, field: K, value: CmsPageRecord[K]) => {
    setPageDrafts((current) => ({
      ...current,
      [pageId]: {
        ...current[pageId],
        [field]: value,
      },
    }));
  };

  const updatePageSection = (pageId: string, index: number, patch: Partial<CmsPageSection>) => {
    setPageDrafts((current) => {
      const page = current[pageId];
      if (!page) return current;
      const sections = normalizePageBlocks(page.sections);
      sections[index] = { ...sections[index], ...patch };
      if (patch.type) sections[index] = { ...makePageBlock(patch.type), ...sections[index], type: patch.type };
      return { ...current, [pageId]: { ...page, sections } };
    });
  };

  const addPageSection = (pageId: string, type: CmsPageBlockType = "richText") => {
    setPageDrafts((current) => {
      const page = current[pageId];
      if (!page) return current;
      return { ...current, [pageId]: { ...page, sections: [...normalizePageBlocks(page.sections), makePageBlock(type)] } };
    });
  };

  const removePageSection = (pageId: string, index: number) => {
    setPageDrafts((current) => {
      const page = current[pageId];
      if (!page) return current;
      return { ...current, [pageId]: { ...page, sections: normalizePageBlocks(page.sections).filter((_, itemIndex) => itemIndex !== index) } };
    });
  };

  const movePageSection = (pageId: string, index: number, direction: -1 | 1) => {
    setPageDrafts((current) => {
      const page = current[pageId];
      if (!page) return current;
      const sections = normalizePageBlocks(page.sections);
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= sections.length) return current;
      const [block] = sections.splice(index, 1);
      sections.splice(nextIndex, 0, block);
      return { ...current, [pageId]: { ...page, sections } };
    });
  };

  const updateNewPageSection = (index: number, patch: Partial<CmsPageSection>) => {
    setNewPage((current) => {
      const sections = normalizePageBlocks(current.sections);
      sections[index] = { ...sections[index], ...patch };
      if (patch.type) sections[index] = { ...makePageBlock(patch.type), ...sections[index], type: patch.type };
      return { ...current, sections };
    });
  };

  const addNewPageSection = (type: CmsPageBlockType = "richText") => {
    setNewPage((current) => ({ ...current, sections: [...normalizePageBlocks(current.sections), makePageBlock(type)] }));
  };

  const removeNewPageSection = (index: number) => {
    setNewPage((current) => ({ ...current, sections: normalizePageBlocks(current.sections).filter((_, itemIndex) => itemIndex !== index) }));
  };

  const moveNewPageSection = (index: number, direction: -1 | 1) => {
    setNewPage((current) => {
      const sections = normalizePageBlocks(current.sections);
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= sections.length) return current;
      const [block] = sections.splice(index, 1);
      sections.splice(nextIndex, 0, block);
      return { ...current, sections };
    });
  };

  const duplicateNewPageSection = (index: number) => {
    setNewPage((current) => {
      const sections = normalizePageBlocks(current.sections);
      const source = sections[index];
      if (!source) return current;
      const clone = { ...source, heading: source.heading ? `${source.heading} copy` : source.heading };
      sections.splice(index + 1, 0, clone);
      return { ...current, sections };
    });
  };

  const duplicatePageSection = (pageId: string, index: number) => {
    setPageDrafts((current) => {
      const page = current[pageId];
      if (!page) return current;
      const sections = normalizePageBlocks(page.sections);
      const source = sections[index];
      if (!source) return current;
      const clone = { ...source, heading: source.heading ? `${source.heading} copy` : source.heading };
      sections.splice(index + 1, 0, clone);
      return { ...current, [pageId]: { ...page, sections } };
    });
  };

  const applyNewPageTemplate = (template: PageTemplateKey) => {
    const prepared = makePageTemplate(template);
    setNewPage({
      ...prepared,
      slug: formatSlug(prepared.slug || prepared.title),
      sections: normalizePageBlocks(prepared.sections),
    });
    setStatus(`Loaded ${pageTemplateLabels[template]} template. Edit it, then click Add page.`);
  };

  const duplicatePage = async (pageId: string) => {
    const draft = pageDrafts[pageId];
    if (!draft) return;
    setLoading(true);
    setStatus("Duplicating page...");
    try {
      const copySlug = formatSlug(`${draft.slug || draft.title}-copy-${Date.now().toString().slice(-4)}`);
      const res = await fetch("/api/cms/pages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-cms-token": cmsToken },
        body: JSON.stringify({
          ...draft,
          id: undefined,
          title: `${draft.title || "Untitled page"} copy`,
          slug: copySlug,
          isPublished: false,
          showInNav: false,
          sections: normalizePageBlocks(draft.sections),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Page duplicate failed.");
      setStatus("Page duplicated as a draft.");
      await loadDashboard();
    } catch (err: any) {
      setStatus(err?.message || "Page duplicate failed.");
    } finally {
      setLoading(false);
    }
  };

  const savePage = async (pageId: string) => {
    const draft = pageDrafts[pageId];
    if (!draft) return;
    setLoading(true);
    setStatus("Saving page...");
    try {
      const res = await fetch(`/api/cms/pages/${pageId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-cms-token": cmsToken },
        body: JSON.stringify({ ...draft, slug: formatSlug(draft.slug || draft.title), sections: normalizePageBlocks(draft.sections) }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Page save failed.");
      setStatus("Page saved.");
      await loadDashboard();
    } catch (err: any) {
      setStatus(err?.message || "Page save failed.");
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (pageId: string) => {
    const draft = pageDrafts[pageId];
    const pageLabel = draft?.title || draft?.slug || "this page";
    if (!window.confirm(`Permanently delete ${pageLabel}? This removes it from Firestore and cannot be undone.`)) return;

    setLoading(true);
    setStatus("Deleting page permanently...");
    try {
      const res = await fetch(`/api/cms/pages/${pageId}`, {
        method: "DELETE",
        headers: { "x-cms-token": cmsToken },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Page delete failed.");
      setStatus("Page permanently deleted.");
      await loadDashboard();
    } catch (err: any) {
      setStatus(err?.message || "Page delete failed.");
    } finally {
      setLoading(false);
    }
  };

  const addStaff = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus("Adding staff member...");
    try {
      const res = await fetch("/api/cms/staff", {
        method: "POST",
        headers: { "content-type": "application/json", "x-cms-token": cmsToken },
        body: JSON.stringify(newStaff),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Staff add failed.");
      setNewStaff(blankStaffForm);
      setStatus("Staff member added.");
      await loadDashboard();
    } catch (err: any) {
      setStatus(err?.message || "Staff add failed.");
    } finally {
      setLoading(false);
    }
  };

  const updateStaffDraft = <K extends keyof CmsStaffRecord>(staffId: string, field: K, value: CmsStaffRecord[K]) => {
    setStaffDrafts((current) => ({ ...current, [staffId]: { ...current[staffId], [field]: value } }));
  };

  const saveStaff = async (staffId: string) => {
    const draft = staffDrafts[staffId];
    if (!draft) return;
    setLoading(true);
    setStatus("Saving staff member...");
    try {
      const res = await fetch(`/api/cms/staff/${staffId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-cms-token": cmsToken },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Staff save failed.");
      setStatus("Staff member saved.");
      await loadDashboard();
    } catch (err: any) {
      setStatus(err?.message || "Staff save failed.");
    } finally {
      setLoading(false);
    }
  };

  const setStaffActive = async (staffId: string, isActive: boolean) => {
    setLoading(true);
    setStatus(isActive ? "Reactivating staff member..." : "Setting staff member inactive...");
    try {
      const res = await fetch(`/api/cms/staff/${staffId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-cms-token": cmsToken },
        body: JSON.stringify({ isActive }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Staff status update failed.");
      setStatus(isActive ? "Staff member reactivated." : "Staff member set inactive.");
      await loadDashboard();
    } catch (err: any) {
      setStatus(err?.message || "Staff status update failed.");
    } finally {
      setLoading(false);
    }
  };

  const removeStaff = async (staffId: string) => {
    const member = staffDrafts[staffId] ?? staff.find((item) => item.id === staffId);
    const label = member?.name || member?.email || "this staff member";
    if (!window.confirm(`Permanently delete ${label}? This removes the staff record completely.`)) return;

    setLoading(true);
    setStatus("Permanently deleting staff member...");
    try {
      const res = await fetch(`/api/cms/staff/${staffId}`, {
        method: "DELETE",
        headers: { "x-cms-token": cmsToken },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Staff delete failed.");
      setStatus("Staff member permanently deleted.");
      await loadDashboard();
    } catch (err: any) {
      setStatus(err?.message || "Staff delete failed.");
    } finally {
      setLoading(false);
    }
  };

  const exportBookings = (format: "csv" | "xls") => {
    const rows = filteredBookings.map((booking) => ({
      Name: booking.fullName,
      Email: booking.email,
      Phone: booking.phone,
      Date: booking.date,
      Time: booking.time,
      Guests: booking.numberOfGuests,
      Status: booking.status,
      Payment: booking.paymentStatus,
      Subtotal: booking.pricing.subtotal,
      Discount: booking.pricing.discount,
      Total: booking.pricing.total,
      Created: formatDateTime(booking.createdAt),
      Requests: booking.specialRequests,
    }));

    if (format === "csv") {
      const headers = Object.keys(rows[0] ?? { Name: "", Email: "", Phone: "", Date: "", Time: "", Guests: "", Status: "", Payment: "", Subtotal: "", Discount: "", Total: "", Created: "", Requests: "" });
      const csv = [headers.map(csvEscape).join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header as keyof typeof row])).join(","))].join("\n");
      downloadBlob("svp-bookings.csv", csv, "text/csv;charset=utf-8");
      return;
    }

    const headers = Object.keys(rows[0] ?? { Name: "", Email: "", Phone: "", Date: "", Time: "", Guests: "", Status: "", Payment: "", Subtotal: "", Discount: "", Total: "", Created: "", Requests: "" });
    const html = `<!doctype html><html><head><meta charset="utf-8" /></head><body><table><thead><tr>${headers
      .map((header) => `<th>${header}</th>`)
      .join("")}</tr></thead><tbody>${rows
      .map((row) => `<tr>${headers.map((header) => `<td>${String(row[header as keyof typeof row] ?? "").replace(/</g, "&lt;")}</td>`).join("")}</tr>`)
      .join("")}</tbody></table></body></html>`;
    downloadBlob("svp-bookings.xls", html, "application/vnd.ms-excel;charset=utf-8");
  };

  const localOrderSubtotal = orderDraft.reduce((sum, item) => sum + Number(item.lineTotal || 0), 0);
  const localDiscount = selectedBooking ? Math.round(localOrderSubtotal * selectedBooking.pricing.memberDiscountRate) : 0;
  const localTotal = Math.max(0, localOrderSubtotal - localDiscount);
  const maxTrendTotal = Math.max(0, ...revenueTrend.map((item) => item.total));
  const maxTopItemTotal = Math.max(0, ...topItems.map((item) => item.total));
  const maxSlotGuests = Math.max(0, ...busiestSlots.map((item) => item.guests));

  const tabItems: Array<{ key: CmsTab; label: string; icon: typeof BarChart3 }> = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "bookings", label: "Bookings", icon: ShoppingBag },
    { key: "menu", label: "Menu", icon: Utensils },
    { key: "settings", label: "Availability", icon: Settings },
    { key: "pages", label: "Pages", icon: FileText },
    { key: "staff", label: "Staff", icon: UserCog },
    { key: "audit", label: "Audit log", icon: ShieldCheck },
  ];

  const renderPageBlockEditor = ({
    blocks,
    onUpdate,
    onAdd,
    onRemove,
    onMove,
    onDuplicate,
    uploadFolder,
  }: {
    blocks: CmsPageSection[];
    onUpdate: (index: number, patch: Partial<CmsPageSection>) => void;
    onAdd: (type: CmsPageBlockType) => void;
    onRemove: (index: number) => void;
    onMove: (index: number, direction: -1 | 1) => void;
    onDuplicate: (index: number) => void;
    uploadFolder: string;
  }) => {
    const normalizedBlocks = normalizePageBlocks(blocks);

    return (
      <div className="space-y-4 rounded-3xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-lg font-black text-foreground">Full page builder blocks</h3>
            <p className="text-sm text-muted-foreground">
              Build the whole white page area with H1 blocks, text, images, cards, galleries, quotes, and CTA sections.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {pageBlockTypes.map((type) => (
              <Button key={type} type="button" variant="outline" size="sm" onClick={() => onAdd(type)}>
                <Plus className="h-4 w-4" /> {pageBlockLabels[type]}
              </Button>
            ))}
          </div>
        </div>

        {!normalizedBlocks.length && (
          <div className="rounded-2xl border border-dashed border-primary/30 bg-card p-6 text-center text-sm text-muted-foreground">
            No blocks yet. Add a Home-style H1 or Text section to start building this page.
          </div>
        )}

        {normalizedBlocks.map((block, index) => (
          <div key={`${index}-${block.type}`} className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Block {index + 1}</Badge>
                <select
                  value={block.type}
                  onChange={(event) => onUpdate(index, { type: event.target.value as CmsPageBlockType })}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm font-bold shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {pageBlockTypes.map((type) => (
                    <option key={type} value={type}>{pageBlockLabels[type]}</option>
                  ))}
                </select>
                <span className="text-xs text-muted-foreground">{pageBlockHelp(block.type)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => onMove(index, -1)} disabled={index === 0}>Move up</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => onMove(index, 1)} disabled={index === normalizedBlocks.length - 1}>Move down</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => onDuplicate(index)}>Duplicate</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => onRemove(index)}><Trash2 className="h-4 w-4" /> Remove</Button>
              </div>
            </div>

            {block.type === "divider" ? (
              <div className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
                Divider block. It adds breathing room/separation on the public page.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Small label / eyebrow</Label>
                    <Input value={block.eyebrow} onChange={(event) => onUpdate(index, { eyebrow: event.target.value })} placeholder="Private Events" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>{block.type === "h1" ? "H1-style headline" : "Heading"}</Label>
                    <Input value={block.heading} onChange={(event) => onUpdate(index, { heading: event.target.value })} placeholder="Write a strong page heading" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Subheading</Label>
                  <Input value={block.subheading} onChange={(event) => onUpdate(index, { subheading: event.target.value })} placeholder="Short supporting line under the heading" />
                </div>

                <div className="space-y-2">
                  <Label>{block.type === "cards" ? "Cards content" : block.type === "gallery" ? "Gallery image URLs" : "Body text"}</Label>
                  <Textarea
                    value={block.body}
                    onChange={(event) => onUpdate(index, { body: event.target.value })}
                    rows={block.type === "h1" || block.type === "cta" ? 3 : 7}
                    placeholder={block.type === "cards" ? "Title | Text | Button label | /link | /image.jpg" : block.type === "gallery" ? "/image-one.jpg\n/image-two.jpg" : "Write fully customizable text here..."}
                  />
                </div>

                {(block.type === "imageText" || block.type === "gallery") && (
                  <div className="grid gap-4 md:grid-cols-[1fr_12rem] md:items-end">
                    <div className="space-y-2">
                      <Label>{block.type === "gallery" ? "Main/extra image URL" : "Image URL"}</Label>
                      <Input value={block.image} onChange={(event) => onUpdate(index, { image: event.target.value })} placeholder="/sunset.jpg or uploaded URL" />
                    </div>
                    <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border/70 px-3 text-sm font-bold hover:bg-muted">
                      <Upload className="h-4 w-4" /> Upload image
                      <input type="file" accept="image/*" className="hidden" onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          void uploadImage(
                            file,
                            (url) => onUpdate(index, block.type === "gallery" ? { body: [block.body, url].filter(Boolean).join("\n") } : { image: url }),
                            uploadFolder
                          );
                        }
                        event.currentTarget.value = "";
                      }} />
                    </label>
                    <div className="space-y-2">
                      <Label>Image alt text</Label>
                      <Input value={block.imageAlt} onChange={(event) => onUpdate(index, { imageAlt: event.target.value })} placeholder="Describe the image" />
                    </div>
                    <div className="space-y-2">
                      <Label>Image side</Label>
                      <select value={block.imagePosition} onChange={(event) => onUpdate(index, { imagePosition: event.target.value as CmsImagePosition })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                        <option value="left">left</option>
                        <option value="right">right</option>
                      </select>
                    </div>
                    {block.image && <img src={block.image} alt="" className="h-28 w-full rounded-2xl border border-border/70 object-cover md:col-span-2" />}
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Button label</Label>
                    <Input value={block.ctaLabel} onChange={(event) => onUpdate(index, { ctaLabel: event.target.value })} placeholder="Book now" />
                  </div>
                  <div className="space-y-2">
                    <Label>Button link</Label>
                    <Input value={block.ctaHref} onChange={(event) => onUpdate(index, { ctaHref: event.target.value })} placeholder="/booking" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="py-12 md:py-16">
        <div className="svp-container space-y-8">
          <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card p-6 shadow-xl shadow-primary/10 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,183,77,0.22),transparent_24rem)]" />
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="section-kicker"><BarChart3 className="mr-2 h-3.5 w-3.5" /> CMS dashboard</span>
                <h1 className="mt-3 text-balance text-4xl font-black tracking-tight text-foreground md:text-5xl">
                  Restaurant operations, content, and pages.
                </h1>
                <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-muted-foreground">
                  Manage booking statuses, payments, menu images, availability, staff roles, audit history, dashboard reports, and fully customizable themed pages.
                </p>
              </div>

              <form onSubmit={unlockCms} className="grid gap-3 rounded-3xl border border-border/70 bg-background/70 p-4 shadow-sm sm:min-w-80">
                <Label htmlFor="cms-token">CMS passcode</Label>
                <Input
                  id="cms-token"
                  type="password"
                  value={tokenInput}
                  onChange={(event) => setTokenInput(event.target.value)}
                  placeholder="CMS_ACCESS_TOKEN"
                />
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    <Check className="h-4 w-4" /> Unlock
                  </Button>
                  <Button type="button" variant="outline" onClick={() => loadDashboard()} disabled={!cmsToken || loading}>
                    <RefreshCw className="h-4 w-4" /> Refresh
                  </Button>
                </div>
              </form>
            </div>
          </section>

          {status && <p className={cn("rounded-2xl border px-4 py-3 text-sm font-medium", getStatusClass(status))}>{status}</p>}

          <div className="flex flex-wrap gap-2 rounded-2xl border border-border/70 bg-card p-2 shadow-sm">
            {tabItems.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                type="button"
                variant={activeTab === key ? "default" : "ghost"}
                onClick={() => setActiveTab(key)}
                className="rounded-xl"
              >
                <Icon className="h-4 w-4" /> {label}
              </Button>
            ))}
          </div>

          {activeTab === "overview" && (
            <section className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => {
                  const windowStats = stats[card.key] ?? blankStats[card.key];
                  return (
                    <Card key={card.key} className="surface-card">
                      <CardContent className="p-6">
                        <div className="mb-5 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-foreground">{card.title}</p>
                            <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                          </div>
                          <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                            <CalendarClock className="h-5 w-5" />
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Bookings</span>
                            <span className="font-black text-foreground">{windowStats.totalBookings}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Subtotal made</span>
                            <span className="font-black text-foreground">{formatCurrency(windowStats.subtotalMade)}</span>
                          </div>
                          <div className="flex justify-between gap-4 border-t border-border/70 pt-3">
                            <span className="text-muted-foreground">Total made</span>
                            <span className="font-black text-primary">{formatCurrency(windowStats.totalMade)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                <Card className="surface-card">
                  <CardHeader>
                    <CardTitle className="text-2xl font-black">Revenue chart</CardTitle>
                    <p className="text-sm text-muted-foreground">Last 7 days, based on booking creation date.</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {revenueTrend.map((item) => (
                      <MiniBar key={item.label} label={item.label} value={item.total} max={maxTrendTotal} caption={`${formatCurrency(item.total)} · ${item.bookings} bookings`} />
                    ))}
                    {!revenueTrend.length && <p className="text-sm text-muted-foreground">No revenue data yet.</p>}
                  </CardContent>
                </Card>

                <Card className="surface-card">
                  <CardHeader>
                    <CardTitle className="text-2xl font-black">Top-selling items</CardTitle>
                    <p className="text-sm text-muted-foreground">Sorted by total item sales.</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {topItems.map((item) => (
                      <MiniBar key={item.name} label={item.name} value={item.total} max={maxTopItemTotal} caption={`${item.quantity} sold · ${formatCurrency(item.total)}`} />
                    ))}
                    {!topItems.length && <p className="text-sm text-muted-foreground">No item sales yet.</p>}
                  </CardContent>
                </Card>

                <Card className="surface-card">
                  <CardHeader>
                    <CardTitle className="text-2xl font-black">Busiest slots</CardTitle>
                    <p className="text-sm text-muted-foreground">The dates and times with the most guests.</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {busiestSlots.map((item) => (
                      <MiniBar key={item.label} label={item.label} value={item.guests} max={maxSlotGuests} caption={`${item.guests} guests · ${item.bookings} bookings`} />
                    ))}
                    {!busiestSlots.length && <p className="text-sm text-muted-foreground">No busy slots yet.</p>}
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {activeTab === "bookings" && (
            <section className="space-y-6">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-black"><ListFilter className="h-5 w-5" /> Search, filter, and export bookings</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 lg:grid-cols-[1fr_11rem_11rem_11rem_auto_auto] lg:items-end">
                  <div className="space-y-2">
                    <Label>Search name, phone, email</Label>
                    <Input value={bookingSearch} onChange={(event) => setBookingSearch(event.target.value)} placeholder="Search bookings..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input value={bookingDateFilter} onChange={(event) => setBookingDateFilter(event.target.value)} placeholder="YYYY-MM-DD" />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <select value={bookingStatusFilter} onChange={(event) => setBookingStatusFilter(event.target.value as BookingStatus | "all")} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                      <option value="all">all</option>
                      {bookingStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Payment</Label>
                    <select value={paymentStatusFilter} onChange={(event) => setPaymentStatusFilter(event.target.value as PaymentStatus | "all")} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                      <option value="all">all</option>
                      {paymentStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                  <Button type="button" variant="outline" onClick={() => exportBookings("csv")}>
                    <Download className="h-4 w-4" /> CSV
                  </Button>
                  <Button type="button" variant="outline" onClick={() => exportBookings("xls")}>
                    <Download className="h-4 w-4" /> Excel
                  </Button>
                </CardContent>
              </Card>

              <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1.1fr)]">
                <Card className="surface-card overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-2xl font-black">Bookings</CardTitle>
                    <p className="text-sm text-muted-foreground">Showing {filteredBookings.length} of {bookings.length} booking records.</p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-[42rem] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredBookings.map((booking) => (
                            <TableRow
                              key={booking.id}
                              className={cn("cursor-pointer", selectedBooking?.id === booking.id && "bg-primary/10")}
                              onClick={() => setSelectedBookingId(booking.id)}
                            >
                              <TableCell>
                                <p className="font-bold text-foreground">{booking.fullName || booking.email}</p>
                                <p className="text-xs text-muted-foreground">{booking.phone || formatDateTime(booking.createdAt)}</p>
                              </TableCell>
                              <TableCell>
                                <p>{booking.date}</p>
                                <p className="text-xs text-muted-foreground">{booking.time} · {booking.numberOfGuests} guests</p>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <span className={cn("rounded-full border px-2 py-1 text-xs font-bold", getBookingBadgeClass(booking.status))}>{booking.status}</span>
                                  <span className={cn("rounded-full border px-2 py-1 text-xs font-bold", getPaymentBadgeClass(booking.paymentStatus))}>{booking.paymentStatus}</span>
                                </div>
                              </TableCell>
                              <TableCell className="font-black text-primary">{formatCurrency(booking.pricing.total)}</TableCell>
                            </TableRow>
                          ))}
                          {!filteredBookings.length && (
                            <TableRow>
                              <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                                No bookings match these filters.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <Card className="surface-card">
                  <CardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <CardTitle className="text-2xl font-black">Edit booking</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Change booking status, payment status, order items, quantities, and special requests.
                        </p>
                      </div>
                      {selectedBooking?.isMember && <Badge variant="secondary">Member discount</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {selectedBooking ? (
                      <>
                        <div className="grid gap-3 rounded-2xl border border-border/70 bg-muted/35 p-4 text-sm sm:grid-cols-2">
                          <p><strong>Customer:</strong> {selectedBooking.fullName || selectedBooking.email}</p>
                          <p><strong>Phone:</strong> {selectedBooking.phone || "Not provided"}</p>
                          <p><strong>Date:</strong> {selectedBooking.date} at {selectedBooking.time}</p>
                          <p><strong>Guests:</strong> {selectedBooking.numberOfGuests}</p>
                          <p><strong>Created:</strong> {formatDateTime(selectedBooking.createdAt)}</p>
                          <p><strong>Updated:</strong> {formatDateTime(selectedBooking.updatedAt)}</p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Booking status</Label>
                            <SelectField value={bookingStatusDraft} values={bookingStatuses} onChange={setBookingStatusDraft} label="Booking status" />
                          </div>
                          <div className="space-y-2">
                            <Label>Payment status</Label>
                            <SelectField value={paymentStatusDraft} values={paymentStatuses} onChange={setPaymentStatusDraft} label="Payment status" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="booking-special-requests">Special requests</Label>
                          <Textarea
                            id="booking-special-requests"
                            value={specialRequestsDraft}
                            onChange={(event) => setSpecialRequestsDraft(event.target.value)}
                            rows={3}
                          />
                        </div>

                        <div className="space-y-4">
                          {orderDraft.map((item, index) => (
                            <div key={`${item.id ?? "new"}-${index}`} className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                              <div className="grid gap-3 md:grid-cols-[1fr_7rem_6rem_auto] md:items-end">
                                <div className="space-y-2">
                                  <Label>Name</Label>
                                  <Input value={item.name} onChange={(event) => updateOrderItem(index, "name", event.target.value)} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Price</Label>
                                  <Input type="number" min="0" value={item.price} onChange={(event) => updateOrderItem(index, "price", event.target.value)} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Qty</Label>
                                  <Input type="number" min="1" value={item.quantity} onChange={(event) => updateOrderItem(index, "quantity", event.target.value)} />
                                </div>
                                <Button type="button" variant="outline" onClick={() => removeOrderItem(index)}>
                                  <Trash2 className="h-4 w-4" /> Remove
                                </Button>
                              </div>
                              <div className="mt-3 space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                  value={item.description || ""}
                                  onChange={(event) => updateOrderItem(index, "description", event.target.value)}
                                  rows={2}
                                />
                              </div>
                              <p className="mt-3 text-right text-sm font-bold text-primary">Line total: {formatCurrency(item.lineTotal || 0)}</p>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="grid gap-1 text-sm sm:grid-cols-3 sm:gap-6">
                            <p><span className="text-muted-foreground">Subtotal:</span> <strong>{formatCurrency(localOrderSubtotal)}</strong></p>
                            <p><span className="text-muted-foreground">Discount:</span> <strong>{formatCurrency(localDiscount)}</strong></p>
                            <p><span className="text-muted-foreground">Total:</span> <strong className="text-primary">{formatCurrency(localTotal)}</strong></p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button type="button" variant="outline" onClick={addOrderItem}>
                              <Plus className="h-4 w-4" /> Add item
                            </Button>
                            <Button type="button" onClick={saveBookingOrder} disabled={loading}>
                              <Save className="h-4 w-4" /> Save booking
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="rounded-2xl border border-border/70 p-6 text-center text-sm text-muted-foreground">
                        Select a booking to edit its order items.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </section>
            </section>
          )}

          {activeTab === "menu" && (
            <section className="space-y-6">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="text-2xl font-black">Add menu item</CardTitle>
                  <p className="text-sm text-muted-foreground">Upload an image instead of typing /image.jpg manually.</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addMenuItem} className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_8rem_auto] xl:items-end">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={newMenuItem.name} onChange={(event) => setNewMenuItem((current) => ({ ...current, name: event.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Input value={newMenuItem.category} onChange={(event) => setNewMenuItem((current) => ({ ...current, category: event.target.value }))} placeholder="BBQ, Pizza, Drinks..." required />
                    </div>
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input type="number" min="0" value={newMenuItem.price} onChange={(event) => setNewMenuItem((current) => ({ ...current, price: event.target.value }))} required />
                    </div>
                    <Button type="submit" disabled={loading}>
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Textarea value={newMenuItem.description} onChange={(event) => setNewMenuItem((current) => ({ ...current, description: event.target.value }))} rows={2} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Image URL</Label>
                      <Input value={newMenuItem.image} onChange={(event) => setNewMenuItem((current) => ({ ...current, image: event.target.value }))} placeholder="Upload or paste image URL" />
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border/70 px-3 py-2 text-sm font-bold hover:bg-muted">
                        <Upload className="h-4 w-4" /> Upload image
                        <input type="file" accept="image/*" className="hidden" onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) void uploadImage(file, (url) => setNewMenuItem((current) => ({ ...current, image: url })), "menu");
                          event.currentTarget.value = "";
                        }} />
                      </label>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {groupedMenuItems.map(([category, items]) => (
                <Card key={category} className="surface-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-black">
                      {category}
                      <Badge variant="secondary">{items.length} items</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => {
                      const draft = menuDrafts[item.id] ?? item;
                      return (
                        <div key={item.id} className={cn("rounded-2xl border border-border/70 bg-card p-4 shadow-sm", !draft.isActive && "opacity-60")}>
                          <div className="grid gap-3 lg:grid-cols-[1fr_12rem_8rem_7rem_auto] lg:items-end">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input value={draft.name} onChange={(event) => updateMenuDraft(item.id, "name", event.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Category</Label>
                              <Input value={draft.category} onChange={(event) => updateMenuDraft(item.id, "category", event.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Price</Label>
                              <Input type="number" min="0" value={draft.price} onChange={(event) => updateMenuDraft(item.id, "price", event.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Sort</Label>
                              <Input type="number" value={draft.sortOrder} onChange={(event) => updateMenuDraft(item.id, "sortOrder", event.target.value)} />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button type="button" onClick={() => saveMenuItem(item.id)} disabled={loading}>
                                <Save className="h-4 w-4" /> Save
                              </Button>
                              <Button type="button" variant="outline" onClick={() => removeMenuItem(item.id)} disabled={loading}>
                                <Trash2 className="h-4 w-4" /> Remove
                              </Button>
                            </div>
                          </div>

                          <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1fr_12rem]">
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea value={draft.description || ""} onChange={(event) => updateMenuDraft(item.id, "description", event.target.value)} rows={2} />
                            </div>
                            <div className="space-y-2">
                              <Label>Image URL</Label>
                              <Input value={draft.image || ""} onChange={(event) => updateMenuDraft(item.id, "image", event.target.value)} />
                              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border/70 px-3 py-2 text-sm font-bold hover:bg-muted">
                                <ImagePlus className="h-4 w-4" /> Upload
                                <input type="file" accept="image/*" className="hidden" onChange={(event) => {
                                  const file = event.target.files?.[0];
                                  if (file) void uploadImage(file, (url) => updateMenuDraft(item.id, "image", url), "menu");
                                  event.currentTarget.value = "";
                                }} />
                              </label>
                            </div>
                            <div className="space-y-3">
                              {draft.image && <img src={draft.image} alt="" className="h-24 w-full rounded-2xl object-cover" />}
                              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <input
                                  type="checkbox"
                                  checked={draft.isActive}
                                  onChange={(event) => updateMenuDraft(item.id, "isActive", event.target.checked)}
                                />
                                Active on booking menu
                              </label>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </section>
          )}

          {activeTab === "settings" && (
            <section className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="text-2xl font-black">Availability settings</CardTitle>
                  <p className="text-sm text-muted-foreground">These values control slot capacity and block unavailable dates.</p>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Max guests per slot</Label>
                      <Input type="number" min="1" value={settingsDraft.maxGuestsPerSlot} onChange={(event) => setSettingsDraft((current) => ({ ...current, maxGuestsPerSlot: Number(event.target.value) }))} />
                      <p className="text-xs text-muted-foreground">Total people allowed in the same time slot. Recommended: 20.</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Max guests per booking</Label>
                      <Input type="number" min="1" value={settingsDraft.maxGuestsPerBooking} onChange={(event) => setSettingsDraft((current) => ({ ...current, maxGuestsPerBooking: Number(event.target.value) }))} />
                      <p className="text-xs text-muted-foreground">Largest group one customer can book. Recommended: 15.</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Booking interval minutes</Label>
                      <Input type="number" min="15" value={settingsDraft.bookingIntervalMinutes} onChange={(event) => setSettingsDraft((current) => ({ ...current, bookingIntervalMinutes: Number(event.target.value) }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Opening time</Label>
                      <Input type="time" value={settingsDraft.openingTime} onChange={(event) => setSettingsDraft((current) => ({ ...current, openingTime: event.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Closing time</Label>
                      <Input type="time" value={settingsDraft.closingTime} onChange={(event) => setSettingsDraft((current) => ({ ...current, closingTime: event.target.value }))} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Blackout dates</Label>
                    <Textarea value={blackoutInput} onChange={(event) => setBlackoutInput(event.target.value)} rows={8} placeholder="2026-06-30&#10;2026-07-01" />
                    <p className="text-xs text-muted-foreground">Use YYYY-MM-DD. Add one date per line or separate with commas.</p>
                  </div>

                  <div className="rounded-3xl border border-primary/20 bg-primary/5 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Megaphone className="h-4 w-4 text-primary" />
                      <h3 className="font-black text-foreground">Wild card: site announcement bar</h3>
                    </div>
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <input type="checkbox" checked={settingsDraft.announcementEnabled} onChange={(event) => setSettingsDraft((current) => ({ ...current, announcementEnabled: event.target.checked }))} />
                        Show announcement at the top of the site
                      </label>
                      <div className="space-y-2">
                        <Label>Announcement text</Label>
                        <Input value={settingsDraft.announcementText} onChange={(event) => setSettingsDraft((current) => ({ ...current, announcementText: event.target.value }))} placeholder="Closed for a private event tonight" />
                      </div>
                      <div className="space-y-2">
                        <Label>Optional link</Label>
                        <Input value={settingsDraft.announcementHref} onChange={(event) => setSettingsDraft((current) => ({ ...current, announcementHref: event.target.value }))} placeholder="/booking or /contact" />
                      </div>
                    </div>
                  </div>

                  <Button type="button" onClick={saveSettings} disabled={loading}>
                    <Save className="h-4 w-4" /> Save settings
                  </Button>
                </CardContent>
              </Card>

              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="text-2xl font-black">What this affects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
                  <p><strong className="text-foreground">Max guests per slot</strong> controls total people allowed at one time, like 20 people at 6:00 PM.</p>
                  <p><strong className="text-foreground">Max guests per booking</strong> controls the biggest group one customer can book, like 15 people.</p>
                  <p><strong className="text-foreground">Opening and closing time</strong> now block reservation API requests outside your selected hours.</p>
                  <p><strong className="text-foreground">Blackout dates</strong> stop bookings on closed/event/private dates.</p>
                  <p><strong className="text-foreground">Announcement bar</strong> is the wild card feature: show an urgent message across the website without editing code.</p>
                </CardContent>
              </Card>
            </section>
          )}

          {activeTab === "pages" && (
            <section className="space-y-6">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="text-2xl font-black">Add full builder page</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Create a public page with a real page builder. The hero controls the top banner; the blocks below fill the page body.
                  </p>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="rounded-3xl border border-primary/20 bg-primary/5 p-4">
                    <div className="mb-3 flex flex-col gap-1">
                      <h3 className="font-black text-foreground">Quick start templates</h3>
                      <p className="text-sm text-muted-foreground">Pick a starter layout, then edit the text, images, buttons, and blocks before adding the page.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(pageTemplateLabels) as PageTemplateKey[]).map((template) => (
                        <Button key={template} type="button" variant="outline" size="sm" onClick={() => applyNewPageTemplate(template)}>
                          {pageTemplateLabels[template]}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={addPage} className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Page title / hero H1</Label>
                        <Input value={newPage.title} onChange={(event) => setNewPage((current) => ({ ...current, title: event.target.value, slug: current.slug || formatSlug(event.target.value) }))} placeholder="Private Events" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Slug</Label>
                        <Input value={newPage.slug} onChange={(event) => setNewPage((current) => ({ ...current, slug: formatSlug(event.target.value) }))} placeholder="private-events" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Hero small label / kicker</Label>
                        <Input value={newPage.kicker} onChange={(event) => setNewPage((current) => ({ ...current, kicker: event.target.value }))} placeholder="Sunset View Point" />
                      </div>
                      <div className="space-y-2">
                        <Label>Hero image URL</Label>
                        <Input value={newPage.heroImage} onChange={(event) => setNewPage((current) => ({ ...current, heroImage: event.target.value }))} placeholder="/sunset.jpg" />
                      </div>
                    </div>

                    {newPage.heroImage && (
                      <div className="overflow-hidden rounded-3xl border border-border/70 bg-muted/30">
                        <img src={newPage.heroImage} alt="Hero preview" className="h-48 w-full object-cover" />
                        <p className="p-3 text-xs text-muted-foreground">Hero preview. Upload changes the URL here; click Add page to save it.</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Hero description</Label>
                      <Textarea value={newPage.description} onChange={(event) => setNewPage((current) => ({ ...current, description: event.target.value }))} rows={3} placeholder="This appears under the big hero title." />
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><input type="checkbox" checked={newPage.isPublished} onChange={(event) => setNewPage((current) => ({ ...current, isPublished: event.target.checked }))} /> Published</label>
                      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><input type="checkbox" checked={newPage.showInNav} onChange={(event) => setNewPage((current) => ({ ...current, showInNav: event.target.checked }))} /> Show in navigation</label>
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border/70 px-3 py-2 text-sm font-bold hover:bg-muted">
                        <Upload className="h-4 w-4" /> Upload hero
                        <input type="file" accept="image/*" className="hidden" onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) void uploadImage(file, (url) => setNewPage((current) => ({ ...current, heroImage: url })), "pages");
                          event.currentTarget.value = "";
                        }} />
                      </label>
                    </div>

                    {renderPageBlockEditor({
                      blocks: newPage.sections,
                      onUpdate: updateNewPageSection,
                      onAdd: addNewPageSection,
                      onRemove: removeNewPageSection,
                      onMove: moveNewPageSection,
                      onDuplicate: duplicateNewPageSection,
                      uploadFolder: "pages",
                    })}

                    <Button type="submit" disabled={loading}><Plus className="h-4 w-4" /> Add page</Button>
                  </form>
                </CardContent>
              </Card>

              {pages.map((page) => {
                const draft = { ...(pageDrafts[page.id] ?? page), sections: normalizePageBlocks((pageDrafts[page.id] ?? page).sections) };
                return (
                  <Card key={page.id} className="surface-card">
                    <CardHeader>
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <CardTitle className="flex flex-wrap items-center gap-3 text-2xl font-black">
                            {draft.title || "Untitled page"}
                            {draft.isPublished ? <Badge>Published</Badge> : <Badge variant="secondary">Draft</Badge>}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">/{draft.slug} · {draft.showInNav ? "shown in nav" : "hidden from nav"} · {draft.sections.length} blocks</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button asChild type="button" variant="outline">
                            <a href={`/${draft.slug}`} target="_blank" rel="noreferrer"><Eye className="h-4 w-4" /> View</a>
                          </Button>
                          <Button type="button" variant="outline" onClick={() => duplicatePage(page.id)} disabled={loading}>Duplicate</Button>
                          <Button type="button" onClick={() => savePage(page.id)} disabled={loading}><Save className="h-4 w-4" /> Save</Button>
                          <Button type="button" variant="outline" onClick={() => deletePage(page.id)} disabled={loading}><Trash2 className="h-4 w-4" /> Delete permanently</Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2"><Label>Page title / hero H1</Label><Input value={draft.title} onChange={(event) => updatePageDraft(page.id, "title", event.target.value)} /></div>
                        <div className="space-y-2"><Label>Slug</Label><Input value={draft.slug} onChange={(event) => updatePageDraft(page.id, "slug", formatSlug(event.target.value))} /></div>
                        <div className="space-y-2"><Label>Hero small label / kicker</Label><Input value={draft.kicker} onChange={(event) => updatePageDraft(page.id, "kicker", event.target.value)} /></div>
                        <div className="space-y-2"><Label>Hero image URL</Label><Input value={draft.heroImage} onChange={(event) => updatePageDraft(page.id, "heroImage", event.target.value)} /></div>
                      </div>

                      {draft.heroImage && (
                        <div className="overflow-hidden rounded-3xl border border-border/70 bg-muted/30">
                          <img src={draft.heroImage} alt="Hero preview" className="h-48 w-full object-cover" />
                          <p className="p-3 text-xs text-muted-foreground">Hero preview. Upload changes the URL here; click Save to apply it to the public page.</p>
                        </div>
                      )}

                      <div className="space-y-2"><Label>Hero description</Label><Textarea value={draft.description} onChange={(event) => updatePageDraft(page.id, "description", event.target.value)} rows={3} /></div>
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><input type="checkbox" checked={draft.isPublished} onChange={(event) => updatePageDraft(page.id, "isPublished", event.target.checked)} /> Published</label>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><input type="checkbox" checked={draft.showInNav} onChange={(event) => updatePageDraft(page.id, "showInNav", event.target.checked)} /> Show in navigation</label>
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border/70 px-3 py-2 text-sm font-bold hover:bg-muted">
                          <Upload className="h-4 w-4" /> Upload hero
                          <input type="file" accept="image/*" className="hidden" onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) void uploadImage(file, (url) => updatePageDraft(page.id, "heroImage", url), "pages");
                            event.currentTarget.value = "";
                          }} />
                        </label>
                      </div>

                      {renderPageBlockEditor({
                        blocks: draft.sections,
                        onUpdate: (index, patch) => updatePageSection(page.id, index, patch),
                        onAdd: (type) => addPageSection(page.id, type),
                        onRemove: (index) => removePageSection(page.id, index),
                        onMove: (index, direction) => movePageSection(page.id, index, direction),
                        onDuplicate: (index) => duplicatePageSection(page.id, index),
                        uploadFolder: "pages",
                      })}
                    </CardContent>
                  </Card>
                );
              })}
              {!pages.length && (
                <Card className="surface-card">
                  <CardContent className="py-10 text-center text-muted-foreground">No CMS pages yet. Use the Add full builder page form above to create one.</CardContent>
                </Card>
              )}
            </section>
          )}

          {activeTab === "staff" && (
            <section className="space-y-6">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="text-2xl font-black">Staff roles</CardTitle>
                  <p className="text-sm text-muted-foreground">Add staff, edit name/email/ownership role, set inactive, or permanently delete records.</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addStaff} className="grid gap-4 md:grid-cols-[1fr_1fr_10rem_auto] md:items-end">
                    <div className="space-y-2"><Label>Name</Label><Input value={newStaff.name} onChange={(event) => setNewStaff((current) => ({ ...current, name: event.target.value }))} required /></div>
                    <div className="space-y-2"><Label>Email</Label><Input type="email" value={newStaff.email} onChange={(event) => setNewStaff((current) => ({ ...current, email: event.target.value }))} required /></div>
                    <div className="space-y-2"><Label>Role</Label><SelectField value={newStaff.role} values={staffRoles} onChange={(role) => setNewStaff((current) => ({ ...current, role }))} label="Role" /></div>
                    <Button type="submit" disabled={loading}><Plus className="h-4 w-4" /> Add</Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="surface-card overflow-hidden">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Active</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {staff.map((member) => {
                        const draft = staffDrafts[member.id] ?? member;
                        return (
                          <TableRow key={member.id}>
                            <TableCell><Input value={draft.name} onChange={(event) => updateStaffDraft(member.id, "name", event.target.value)} /></TableCell>
                            <TableCell><Input type="email" value={draft.email} onChange={(event) => updateStaffDraft(member.id, "email", event.target.value)} /></TableCell>
                            <TableCell><SelectField value={draft.role} values={staffRoles} onChange={(role) => updateStaffDraft(member.id, "role", role)} label="Role" /></TableCell>
                            <TableCell>
                              <Badge variant={draft.isActive ? "default" : "secondary"}>{draft.isActive ? "Active" : "Inactive"}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex flex-wrap justify-end gap-2">
                                <Button type="button" size="sm" onClick={() => saveStaff(member.id)} disabled={loading}><Save className="h-4 w-4" /> Save edits</Button>
                                <Button type="button" size="sm" variant="outline" onClick={() => setStaffActive(member.id, !draft.isActive)} disabled={loading}>
                                  {draft.isActive ? "Set inactive" : "Reactivate"}
                                </Button>
                                <Button type="button" size="sm" variant="outline" onClick={() => removeStaff(member.id)} disabled={loading}><Trash2 className="h-4 w-4" /> Delete permanently</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {!staff.length && <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No staff records yet.</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>
          )}

          {activeTab === "audit" && (
            <section>
              <Card className="surface-card overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl font-black">Audit log</CardTitle>
                  <p className="text-sm text-muted-foreground">Recent changes made through the CMS.</p>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Action</TableHead><TableHead>Target</TableHead><TableHead>Details</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{formatDateTime(log.createdAt)}</TableCell>
                          <TableCell className="font-bold text-foreground">{log.action}</TableCell>
                          <TableCell>{log.target}</TableCell>
                          <TableCell className="max-w-xl truncate text-xs text-muted-foreground">{JSON.stringify(log.details ?? {})}</TableCell>
                        </TableRow>
                      ))}
                      {!auditLogs.length && <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No audit entries yet.</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
