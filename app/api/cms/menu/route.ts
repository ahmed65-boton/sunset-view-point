export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";

import { requireCmsAccess } from "@/lib/cms-auth";
import { db } from "@/lib/firebase/admin";
import { recordCmsAudit } from "@/lib/cms-audit";
import { getStaticMenuItemRows, type CmsMenuItem } from "@/lib/menu-admin";

const MenuItemCreateSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  category: z.string().trim().min(1, "Category is required"),
  description: z.string().trim().optional().default(""),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  image: z.string().trim().optional().default("/placeholder.svg?height=108&width=108"),
});

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

function toJsonItem(item: CmsMenuItem) {
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? "",
    price: item.price,
    image: item.image ?? "",
    category: item.category,
    sortOrder: item.sortOrder ?? 0,
    isActive: item.isActive !== false,
  };
}

async function getCmsRows() {
  const snap = await db.collection("cmsMenuItems").get();
  const overrides = new Map(snap.docs.map((doc) => [doc.id, normalizeCmsMenuItem(doc)]));
  const staticRows = getStaticMenuItemRows();
  const staticIds = new Set(staticRows.map((item) => String(item.id)));

  const mergedStatic = staticRows.map((item) => {
    const override = overrides.get(String(item.id));
    return override ? { ...item, ...override } : item;
  });

  const customRows = Array.from(overrides.values()).filter((item) => !staticIds.has(String(item.id)));

  return [...mergedStatic, ...customRows]
    .sort((a, b) => {
      if (a.category === b.category) return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      return a.category.localeCompare(b.category);
    })
    .map(toJsonItem);
}

export async function GET(req: Request) {
  const authError = requireCmsAccess(req);
  if (authError) return authError;

  try {
    const items = await getCmsRows();
    const categories = Array.from(new Set(items.map((item) => item.category))).sort();

    return NextResponse.json({ ok: true, items, categories });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message ?? "Could not load menu items." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const authError = requireCmsAccess(req);
  if (authError) return authError;

  try {
    const input = MenuItemCreateSchema.parse(await req.json());
    const snap = await db.collection("cmsMenuItems").get();
    const staticRows = getStaticMenuItemRows();
    const existingIds = [
      ...staticRows.map((item) => item.id),
      ...snap.docs.map((doc) => Number(doc.data().id ?? doc.id)).filter((id) => Number.isFinite(id)),
    ];
    const nextId = Math.max(0, ...existingIds) + 1;
    const maxSortOrder = Math.max(0, ...staticRows.map((item) => item.sortOrder), ...snap.docs.map((doc) => Number(doc.data().sortOrder ?? 0)));

    await db.collection("cmsMenuItems").doc(String(nextId)).set({
      id: nextId,
      name: input.name,
      category: input.category,
      description: input.description,
      price: input.price,
      image: input.image || "/placeholder.svg?height=108&width=108",
      sortOrder: maxSortOrder + 1,
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await recordCmsAudit("menu.create", String(nextId), { name: input.name, category: input.category });

    return NextResponse.json({ ok: true, itemId: nextId, items: await getCmsRows() });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message ?? "Could not add menu item." },
      { status: 400 }
    );
  }
}
