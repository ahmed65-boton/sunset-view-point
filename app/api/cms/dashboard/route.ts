export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { requireCmsAccess } from "@/lib/cms-auth";
import { db } from "@/lib/firebase/admin";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

type StatsBucket = { totalBookings: number; subtotalMade: number; totalMade: number };
type TrendBucket = { label: string; subtotal: number; total: number; bookings: number };

function timestampToIso(value: any): string | null {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") {
    const dt = new Date(value);
    return Number.isNaN(dt.getTime()) ? null : dt.toISOString();
  }
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000).toISOString();
  return null;
}

function parseDateString(value: string) {
  if (!value) return null;
  const iso = new Date(`${value}T00:00:00`);
  if (!Number.isNaN(iso.getTime())) return iso;

  const ddmmyyyy = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (ddmmyyyy) {
    const [, dd, mm, yyyy] = ddmmyyyy;
    const dt = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  return null;
}

function getBookingDate(data: any) {
  const createdAt = timestampToIso(data.createdAt);
  if (createdAt) return new Date(createdAt);

  if (typeof data.date === "string") {
    return parseDateString(data.date);
  }

  return null;
}

function numberOrZero(value: unknown) {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function emptyStats(): StatsBucket {
  return { totalBookings: 0, subtotalMade: 0, totalMade: 0 };
}

function addStats(stats: StatsBucket, subtotal: number, total: number) {
  stats.totalBookings += 1;
  stats.subtotalMade += subtotal;
  stats.totalMade += total;
}

function dateLabel(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function normalizeStatus(value: unknown) {
  const status = String(value ?? "pending").toLowerCase();
  return ["pending", "confirmed", "cancelled", "completed"].includes(status) ? status : "pending";
}

function normalizePaymentStatus(value: unknown) {
  const status = String(value ?? "unpaid").toLowerCase();
  return ["unpaid", "paid", "refunded"].includes(status) ? status : "unpaid";
}

export async function GET(req: Request) {
  const authError = requireCmsAccess(req);
  if (authError) return authError;

  try {
    const snap = await db.collectionGroup("bookings").get();
    const now = new Date();
    const windows = {
      lastDay: emptyStats(),
      lastWeek: emptyStats(),
      lastMonth: emptyStats(),
      lastYear: emptyStats(),
    };
    const trendMap = new Map<string, TrendBucket>();
    const topItemMap = new Map<string, { name: string; quantity: number; total: number }>();
    const slotMap = new Map<string, { label: string; bookings: number; guests: number }>();

    for (let i = 6; i >= 0; i -= 1) {
      const day = new Date(now);
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - i);
      const key = day.toISOString().slice(0, 10);
      trendMap.set(key, { label: dateLabel(day), subtotal: 0, total: 0, bookings: 0 });
    }

    const bookings = snap.docs.map((docSnap) => {
      const data = docSnap.data();
      const pricing = data.pricing ?? {};
      const subtotal = numberOrZero(pricing.subtotal);
      const total = numberOrZero(pricing.total);
      const createdDate = getBookingDate(data);
      const createdAt = timestampToIso(data.createdAt);
      const updatedAt = timestampToIso(data.updatedAt);
      const customerId = docSnap.ref.parent.parent?.id ?? "";
      const order = Array.isArray(data.order) ? data.order : [];
      const date = String(data.date ?? "");
      const time = String(data.time ?? "");
      const guests = numberOrZero(data.numberOfGuests);

      if (createdDate) {
        const ageMs = now.getTime() - createdDate.getTime();
        if (ageMs >= 0 && ageMs <= MS_PER_DAY) addStats(windows.lastDay, subtotal, total);
        if (ageMs >= 0 && ageMs <= 7 * MS_PER_DAY) addStats(windows.lastWeek, subtotal, total);
        if (ageMs >= 0 && ageMs <= 30 * MS_PER_DAY) addStats(windows.lastMonth, subtotal, total);
        if (ageMs >= 0 && ageMs <= 365 * MS_PER_DAY) addStats(windows.lastYear, subtotal, total);

        const key = new Date(createdDate.getTime()).toISOString().slice(0, 10);
        const trend = trendMap.get(key);
        if (trend) {
          trend.subtotal += subtotal;
          trend.total += total;
          trend.bookings += 1;
        }
      }

      order.forEach((item: any) => {
        const name = String(item.name ?? "Unnamed item").trim() || "Unnamed item";
        const quantity = Math.max(1, numberOrZero(item.quantity));
        const lineTotal = numberOrZero(item.lineTotal || Number(item.price ?? 0) * quantity);
        const current = topItemMap.get(name) ?? { name, quantity: 0, total: 0 };
        current.quantity += quantity;
        current.total += lineTotal;
        topItemMap.set(name, current);
      });

      if (date || time) {
        const slotKey = `${date || "No date"} ${time || "No time"}`.trim();
        const current = slotMap.get(slotKey) ?? { label: slotKey, bookings: 0, guests: 0 };
        current.bookings += 1;
        current.guests += guests;
        slotMap.set(slotKey, current);
      }

      return {
        id: docSnap.id,
        customerId,
        fullName: String(data.fullName ?? ""),
        email: String(data.email ?? customerId ?? ""),
        phone: String(data.phone ?? ""),
        date,
        time,
        numberOfGuests: guests,
        specialRequests: String(data.specialRequests ?? ""),
        status: normalizeStatus(data.status),
        paymentStatus: normalizePaymentStatus(data.paymentStatus),
        order,
        pricing: {
          subtotal,
          discount: numberOrZero(pricing.discount),
          total,
          memberDiscountRate: numberOrZero(pricing.memberDiscountRate),
          currency: String(pricing.currency ?? "PKR"),
        },
        isMember: Boolean(data.isMember),
        createdAt,
        updatedAt,
      };
    });

    bookings.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    const dashboard = {
      revenueTrend: Array.from(trendMap.values()),
      topItems: Array.from(topItemMap.values())
        .sort((a, b) => b.total - a.total)
        .slice(0, 8),
      busiestSlots: Array.from(slotMap.values())
        .sort((a, b) => b.guests - a.guests || b.bookings - a.bookings)
        .slice(0, 8),
    };

    return NextResponse.json({ ok: true, stats: windows, dashboard, bookings: bookings.slice(0, 300) });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message ?? "Could not load CMS dashboard." },
      { status: 500 }
    );
  }
}
