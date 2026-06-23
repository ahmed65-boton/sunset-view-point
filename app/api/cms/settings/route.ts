export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";

import { requireCmsAccess } from "@/lib/cms-auth";
import { recordCmsAudit } from "@/lib/cms-audit";
import { db } from "@/lib/firebase/admin";

const SettingsSchema = z.object({
  maxGuestsPerSlot: z.coerce.number().int().min(1).max(500).default(20),
  maxGuestsPerBooking: z.coerce.number().int().min(1).max(100).default(15),
  openingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).default("10:00"),
  closingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).default("21:00"),
  bookingIntervalMinutes: z.coerce.number().int().min(15).max(240).default(30),
  blackoutDates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).default([]),
  announcementEnabled: z.boolean().default(false),
  announcementText: z.string().trim().max(160).default(""),
  announcementHref: z.string().trim().max(120).default(""),
});

const defaultSettings = {
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

export async function GET(req: Request) {
  const authError = requireCmsAccess(req);
  if (authError) return authError;

  try {
    const snap = await db.collection("settings").doc("global").get();
    const data = snap.exists ? snap.data() : {};
    return NextResponse.json({ ok: true, settings: { ...defaultSettings, ...data } });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? "Could not load settings." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const authError = requireCmsAccess(req);
  if (authError) return authError;

  try {
    const input = SettingsSchema.parse(await req.json());
    await db.collection("settings").doc("global").set(
      {
        ...input,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    await recordCmsAudit("settings.update", "global", input);
    return NextResponse.json({ ok: true, settings: input });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? "Could not save settings." }, { status: 400 });
  }
}
