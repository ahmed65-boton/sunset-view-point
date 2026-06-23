export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";

import { requireCmsAccess } from "@/lib/cms-auth";
import { db } from "@/lib/firebase/admin";
import { recordCmsAudit } from "@/lib/cms-audit";

const MenuItemUpdateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
  price: z.coerce.number().min(0).optional(),
  image: z.string().trim().optional(),
  sortOrder: z.coerce.number().optional(),
  isActive: z.boolean().optional(),
});

type RouteContext = {
  params: Promise<{ itemId: string }>;
};

export async function PATCH(req: Request, context: RouteContext) {
  const authError = requireCmsAccess(req);
  if (authError) return authError;

  try {
    const { itemId } = await context.params;
    const itemIdNumber = Number(itemId);
    if (!Number.isFinite(itemIdNumber)) {
      return NextResponse.json({ ok: false, message: "Invalid item id." }, { status: 400 });
    }

    const input = MenuItemUpdateSchema.parse(await req.json());
    const updateData = {
      id: itemIdNumber,
      ...input,
      updatedAt: FieldValue.serverTimestamp(),
    };

    await db.collection("cmsMenuItems").doc(String(itemIdNumber)).set(updateData, { merge: true });
    await recordCmsAudit("menu.update", String(itemIdNumber), input);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message ?? "Could not update menu item." },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  const authError = requireCmsAccess(req);
  if (authError) return authError;

  try {
    const { itemId } = await context.params;
    const itemIdNumber = Number(itemId);
    if (!Number.isFinite(itemIdNumber)) {
      return NextResponse.json({ ok: false, message: "Invalid item id." }, { status: 400 });
    }

    await db.collection("cmsMenuItems").doc(String(itemIdNumber)).set(
      {
        id: itemIdNumber,
        isActive: false,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    await recordCmsAudit("menu.delete", String(itemIdNumber), { isActive: false });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message ?? "Could not remove menu item." },
      { status: 400 }
    );
  }
}
