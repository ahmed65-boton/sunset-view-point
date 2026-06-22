export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { requireCmsAccess } from "@/lib/cms-auth";
import { db } from "@/lib/firebase/admin";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

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

function getBookingDate(data: any) {
  const createdAt = timestampToIso(data.createdAt);
  if (createdAt) return new Date(createdAt);

  if (typeof data.date === "string") {
    const dt = new Date(`${data.date}T00:00:00`);
    if (!Number.isNaN(dt.getTime())) return dt;
  }

  return null;
}

function numberOrZero(value: unknown) {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function emptyStats() {
  return { totalBookings: 0, subtotalMade: 0, totalMade: 0 };
}

function addStats(stats: ReturnType<typeof emptyStats>, subtotal: number, total: number) {
  stats.totalBookings += 1;
  stats.subtotalMade += subtotal;
  stats.totalMade += total;
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

    const bookings = snap.docs.map((docSnap) => {
      const data = docSnap.data();
      const pricing = data.pricing ?? {};
      const subtotal = numberOrZero(pricing.subtotal);
      const total = numberOrZero(pricing.total);
      const createdDate = getBookingDate(data);
      const createdAt = timestampToIso(data.createdAt);
      const customerId = docSnap.ref.parent.parent?.id ?? "";

      if (createdDate) {
        const ageMs = now.getTime() - createdDate.getTime();
        if (ageMs >= 0 && ageMs <= MS_PER_DAY) addStats(windows.lastDay, subtotal, total);
        if (ageMs >= 0 && ageMs <= 7 * MS_PER_DAY) addStats(windows.lastWeek, subtotal, total);
        if (ageMs >= 0 && ageMs <= 30 * MS_PER_DAY) addStats(windows.lastMonth, subtotal, total);
        if (ageMs >= 0 && ageMs <= 365 * MS_PER_DAY) addStats(windows.lastYear, subtotal, total);
      }

      return {
        id: docSnap.id,
        customerId,
        fullName: String(data.fullName ?? ""),
        email: String(data.email ?? customerId ?? ""),
        phone: String(data.phone ?? ""),
        date: String(data.date ?? ""),
        time: String(data.time ?? ""),
        numberOfGuests: numberOrZero(data.numberOfGuests),
        specialRequests: String(data.specialRequests ?? ""),
        order: Array.isArray(data.order) ? data.order : [],
        pricing: {
          subtotal,
          discount: numberOrZero(pricing.discount),
          total,
          memberDiscountRate: numberOrZero(pricing.memberDiscountRate),
          currency: String(pricing.currency ?? "PKR"),
        },
        isMember: Boolean(data.isMember),
        createdAt,
      };
    });

    bookings.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    return NextResponse.json({ ok: true, stats: windows, bookings: bookings.slice(0, 200) });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message ?? "Could not load CMS dashboard." },
      { status: 500 }
    );
  }
}
