export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";

import { requireCmsAccess } from "@/lib/cms-auth";
import { recordCmsAudit } from "@/lib/cms-audit";
import { db } from "@/lib/firebase/admin";

const SectionSchema = z.object({
  type: z.enum(["h1", "richText", "imageText", "cards", "gallery", "quote", "cta", "divider"]).optional().default("richText"),
  eyebrow: z.string().trim().optional().default(""),
  heading: z.string().trim().optional().default(""),
  subheading: z.string().trim().optional().default(""),
  body: z.string().trim().optional().default(""),
  image: z.string().trim().optional().default(""),
  imageAlt: z.string().trim().optional().default(""),
  imagePosition: z.enum(["left", "right"]).optional().default("right"),
  ctaLabel: z.string().trim().optional().default(""),
  ctaHref: z.string().trim().optional().default(""),
});

const PageUpdateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  slug: z.string().trim().min(1).optional(),
  kicker: z.string().trim().optional(),
  description: z.string().trim().optional(),
  heroImage: z.string().trim().optional(),
  isPublished: z.boolean().optional(),
  showInNav: z.boolean().optional(),
  sections: z.array(SectionSchema).optional(),
});

type RouteContext = { params: Promise<{ pageId: string }> };

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 72);
}

export async function PATCH(req: Request, context: RouteContext) {
  const authError = requireCmsAccess(req);
  if (authError) return authError;

  try {
    const { pageId } = await context.params;
    const input = PageUpdateSchema.parse(await req.json());
    const pageRef = db.collection("cmsPages").doc(pageId);
    const pageSnap = await pageRef.get();
    if (!pageSnap.exists) return NextResponse.json({ ok: false, message: "Page not found." }, { status: 404 });

    const updateData: Record<string, unknown> = { ...input, updatedAt: FieldValue.serverTimestamp() };
    if (input.slug) {
      const slug = slugify(input.slug);
      if (!slug) return NextResponse.json({ ok: false, message: "Slug must contain letters or numbers." }, { status: 400 });
      const existing = await db.collection("cmsPages").where("slug", "==", slug).limit(2).get();
      const conflict = existing.docs.find((doc) => doc.id !== pageId);
      if (conflict) return NextResponse.json({ ok: false, message: "A page with this slug already exists." }, { status: 409 });
      updateData.slug = slug;
    }

    await pageRef.set(updateData, { merge: true });
    await recordCmsAudit("page.update", pageId, input);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? "Could not save page." }, { status: 400 });
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  const authError = requireCmsAccess(req);
  if (authError) return authError;

  try {
    const { pageId } = await context.params;
    await db.collection("cmsPages").doc(pageId).delete();
    await recordCmsAudit("page.delete", pageId);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? "Could not delete page." }, { status: 400 });
  }
}
