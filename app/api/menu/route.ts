export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { db } from "@/lib/firebase/admin";
import { groupMenuItems, mergeStaticAndCmsMenu, type CmsMenuItem } from "@/lib/menu-admin";

function normalizeCmsMenuItem(doc: FirebaseFirestore.QueryDocumentSnapshot): CmsMenuItem {
  const data = doc.data() as Partial<CmsMenuItem>;
  const numericId = Number(data.id ?? doc.id);

  return {
    id: Number.isFinite(numericId) ? numericId : Number(doc.id),
    name: String(data.name ?? "Untitled item"),
    description: String(data.description ?? ""),
    price: Number(data.price ?? 0),
    image: String(data.image ?? "/placeholder.svg?height=108&width=108"),
    category: String(data.category ?? "Other"),
    sortOrder: Number(data.sortOrder ?? 9999),
    isActive: data.isActive !== false,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export async function GET() {
  try {
    const snap = await db.collection("cmsMenuItems").get();
    const cmsItems = snap.docs.map(normalizeCmsMenuItem);
    const mergedItems = mergeStaticAndCmsMenu(cmsItems);

    return NextResponse.json({ ok: true, categories: groupMenuItems(mergedItems) });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message ?? "Could not load menu." },
      { status: 500 }
    );
  }
}
