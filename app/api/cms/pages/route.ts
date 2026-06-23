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

const PageSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z.string().trim().min(1, "Slug is required"),
  kicker: z.string().trim().optional().default("Sunset View Point"),
  description: z.string().trim().optional().default(""),
  heroImage: z.string().trim().optional().default("/sunset.jpg"),
  isPublished: z.boolean().default(false),
  showInNav: z.boolean().default(true),
  sections: z.array(SectionSchema).default([]),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 72);
}

function timestampToIso(value: any): string | null {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000).toISOString();
  return null;
}

function toPage(doc: FirebaseFirestore.QueryDocumentSnapshot) {
  const data = doc.data();
  return {
    id: doc.id,
    title: String(data.title ?? "Untitled page"),
    slug: String(data.slug ?? doc.id),
    kicker: String(data.kicker ?? "Sunset View Point"),
    description: String(data.description ?? ""),
    heroImage: String(data.heroImage ?? "/sunset.jpg"),
    isPublished: data.isPublished === true,
    showInNav: data.showInNav !== false,
    sections: Array.isArray(data.sections) ? data.sections : [],
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  };
}

export async function GET(req: Request) {
  const authError = requireCmsAccess(req);
  if (authError) return authError;

  try {
    const snap = await db.collection("cmsPages").orderBy("updatedAt", "desc").get();
    return NextResponse.json({ ok: true, pages: snap.docs.map(toPage) });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? "Could not load pages." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authError = requireCmsAccess(req);
  if (authError) return authError;

  try {
    const input = PageSchema.parse(await req.json());
    const slug = slugify(input.slug || input.title);
    if (!slug) {
      return NextResponse.json({ ok: false, message: "Slug must contain letters or numbers." }, { status: 400 });
    }

    const existing = await db.collection("cmsPages").where("slug", "==", slug).limit(1).get();
    if (!existing.empty) {
      return NextResponse.json({ ok: false, message: "A page with this slug already exists." }, { status: 409 });
    }

    const ref = db.collection("cmsPages").doc();
    await ref.set({
      ...input,
      slug,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    await recordCmsAudit("page.create", slug, { title: input.title, published: input.isPublished });
    return NextResponse.json({ ok: true, pageId: ref.id });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? "Could not add page." }, { status: 400 });
  }
}
