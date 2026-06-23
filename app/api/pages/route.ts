export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { db } from "@/lib/firebase/admin";

export async function GET() {
  try {
    const snap = await db
      .collection("cmsPages")
      .where("isPublished", "==", true)
      .where("showInNav", "==", true)
      .limit(12)
      .get();

    const pages = snap.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: String(data.title ?? "Untitled page"),
          slug: String(data.slug ?? doc.id),
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title));

    return NextResponse.json({ ok: true, pages });
  } catch (err: any) {
    return NextResponse.json({ ok: true, pages: [] });
  }
}
