export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";

import { requireCmsAccess } from "@/lib/cms-auth";
import { recordCmsAudit } from "@/lib/cms-audit";
import { db } from "@/lib/firebase/admin";

const StaffSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Valid email is required"),
  role: z.enum(["owner", "manager", "viewer"]),
  isActive: z.boolean().default(true),
});

function timestampToIso(value: any): string | null {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000).toISOString();
  return null;
}

function toStaff(doc: FirebaseFirestore.QueryDocumentSnapshot) {
  const data = doc.data();
  return {
    id: doc.id,
    name: String(data.name ?? ""),
    email: String(data.email ?? ""),
    role: String(data.role ?? "viewer"),
    isActive: data.isActive !== false,
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  };
}

export async function GET(req: Request) {
  const authError = requireCmsAccess(req);
  if (authError) return authError;

  try {
    const snap = await db.collection("cmsStaff").orderBy("createdAt", "desc").get();
    return NextResponse.json({ ok: true, staff: snap.docs.map(toStaff) });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? "Could not load staff." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authError = requireCmsAccess(req);
  if (authError) return authError;

  try {
    const input = StaffSchema.parse(await req.json());
    const ref = db.collection("cmsStaff").doc();
    await ref.set({
      ...input,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    await recordCmsAudit("staff.create", input.email, { role: input.role });
    return NextResponse.json({ ok: true, staffId: ref.id });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? "Could not add staff." }, { status: 400 });
  }
}
