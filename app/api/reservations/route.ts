// app/api/reservations/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

// --- Helpers ---
function isValidTimeHHMM(value: string) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

function isValidDateDDMMYYYY(value: string) {
  if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) return false;
  const [dStr, mStr, yStr] = value.split("-");
  const d = Number(dStr);
  const m = Number(mStr);
  const y = Number(yStr);
  if (y < 1000 || y > 9999 || m < 1 || m > 12 || d < 1 || d > 31) return false;

  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

function isValidDateYYYYMMDD(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [yStr, mStr, dStr] = value.split("-");
  const d = Number(dStr);
  const m = Number(mStr);
  const y = Number(yStr);
  if (y < 1000 || y > 9999 || m < 1 || m > 12 || d < 1 || d > 31) return false;

  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

function yyyyMmDdToDdMmYyyy(yyyymmdd: string) {
  const [yyyy, mm, dd] = yyyymmdd.split("-");
  return `${dd}-${mm}-${yyyy}`;
}

function ddMmYyyyToYyyyMmDd(ddmmyyyy: string) {
  const [dd, mm, yyyy] = ddmmyyyy.split("-");
  return `${yyyy}-${mm}-${dd}`;
}

function normalizePhone(phone: string) {
  return phone.trim();
}

// --- Schema ---
const ReservationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(7, "Phone is required"),
  email: z.string().email("Invalid email"),

  // Accept BOTH formats: DD-MM-YYYY OR YYYY-MM-DD
  date: z
    .string()
    .refine(
      (v) => isValidDateDDMMYYYY(v) || isValidDateYYYYMMDD(v),
      "Use a real date in DD-MM-YYYY or YYYY-MM-DD"
    ),

  time: z.string().refine(isValidTimeHHMM, "Use a real time in HH:MM (00:00–23:59)"),

  // Important: forms often send "2" as string; this handles it
  guests: z.coerce.number().int().min(1).max(50),

  notes: z.string().optional(),
  whatsappOptIn: z.boolean().default(false),
});

export async function POST(req: Request) {
  let reservationRef: FirebaseFirestore.DocumentReference | null = null;
  let dateDisplay = "";
  let reservationId = "";

  try {
    const body = await req.json();
    const input = ReservationSchema.parse(body);

    const phone = normalizePhone(input.phone);

    // Convert date to both forms for storage
    const dateKey = isValidDateYYYYMMDD(input.date)
      ? input.date
      : ddMmYyyyToYyyyMmDd(input.date);

    dateDisplay = isValidDateDDMMYYYY(input.date)
      ? input.date
      : yyyyMmDdToDdMmYyyy(input.date);

    const slotKey = `${dateKey}_${input.time}`;

    const settingsRef = db.collection("settings").doc("global");
    const slotRef = db.collection("slots").doc(slotKey);
    reservationRef = db.collection("reservations").doc();
    reservationId = reservationRef.id;
    const customerRef = db.collection("customers").doc(phone);

    const result = await db.runTransaction(async (tx) => {
      const [settingsSnap, slotSnap, customerSnap] = await Promise.all([
        tx.get(settingsRef),
        tx.get(slotRef),
        tx.get(customerRef),
      ]);

      const settings = settingsSnap.exists ? settingsSnap.data() : {};
      const maxGuestsPerSlot = (settings?.maxGuestsPerSlot as number) ?? 20;

      const currentTotal = slotSnap.exists ? (slotSnap.data()?.totalGuests ?? 0) : 0;
      const slotMax = slotSnap.exists
        ? (slotSnap.data()?.maxGuests ?? maxGuestsPerSlot)
        : maxGuestsPerSlot;

      // capacity check
      if (currentTotal + input.guests > slotMax) {
        return { ok: false as const, message: "This time slot is fully booked." };
      }

      // update/create slot
      if (!slotSnap.exists) {
        tx.set(slotRef, {
          date: dateDisplay, // DD-MM-YYYY
          dateKey, // YYYY-MM-DD
          time: input.time,
          totalGuests: input.guests,
          maxGuests: slotMax,
          updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        tx.update(slotRef, {
          totalGuests: currentTotal + input.guests,
          updatedAt: FieldValue.serverTimestamp(),
        });
      }

      // reservation doc
      tx.set(reservationRef!, {
        status: "confirmed",
        slotKey,
        customer: {
          name: input.name,
          phone,
          email: input.email,
          whatsappOptIn: input.whatsappOptIn,
        },
        reservation: {
          date: dateDisplay,
          dateKey,
          time: input.time,
          guests: input.guests,
          notes: input.notes || "",
        },
        confirmation: {
          emailSent: false,
          emailProvider: "emailjs",
          whatsappSent: false,
          lastAttemptAt: null,
        },
        source: "website",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      // customer log
      if (!customerSnap.exists) {
        tx.set(customerRef, {
          name: input.name,
          phone,
          email: input.email,
          firstSeenAt: FieldValue.serverTimestamp(),
          lastSeenAt: FieldValue.serverTimestamp(),
          reservationCount: 1,
        });
      } else {
        tx.update(customerRef, {
          name: input.name,
          email: input.email || customerSnap.data()?.email || null,
          lastSeenAt: FieldValue.serverTimestamp(),
          reservationCount: (customerSnap.data()?.reservationCount ?? 0) + 1,
        });
      }

      return { ok: true as const };
    });

    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 409 });
    }

    return NextResponse.json({ ok: true, reservationId });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message ?? "Unknown error" },
      { status: 400 }
    );
  }
}
