export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";

import { requireCmsAccess } from "@/lib/cms-auth";
import { recordCmsAudit } from "@/lib/cms-audit";
import { db } from "@/lib/firebase/admin";

const StaffUpdateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.string().trim().email().optional(),
  role: z.enum(["owner", "manager", "viewer"]).optional(),
  isActive: z.boolean().optional(),
});

type RouteContext = { params: Promise<{ staffId: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  const authError = requireCmsAccess(req);
  if (authError) return authError;

  try {
    const { staffId } = await context.params;
    const input = StaffUpdateSchema.parse(await req.json());
    await db.collection("cmsStaff").doc(staffId).set({ ...input, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    await recordCmsAudit("staff.update", staffId, input);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? "Could not save staff." }, { status: 400 });
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  const authError = requireCmsAccess(req);
  if (authError) return authError;

  try {
    const { staffId } = await context.params;
    await db.collection("cmsStaff").doc(staffId).set({ isActive: false, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    await recordCmsAudit("staff.delete", staffId, { isActive: false });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? "Could not remove staff." }, { status: 400 });
  }
}
