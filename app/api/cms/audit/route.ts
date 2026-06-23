export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { requireCmsAccess } from "@/lib/cms-auth";
import { db } from "@/lib/firebase/admin";

function timestampToIso(value: any): string | null {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000).toISOString();
  return null;
}

export async function GET(req: Request) {
  const authError = requireCmsAccess(req);
  if (authError) return authError;

  try {
    const snap = await db.collection("cmsAuditLogs").orderBy("createdAt", "desc").limit(100).get();
    const logs = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        action: String(data.action ?? ""),
        target: String(data.target ?? ""),
        actor: String(data.actor ?? "CMS"),
        details: data.details ?? {},
        createdAt: timestampToIso(data.createdAt),
      };
    });
    return NextResponse.json({ ok: true, logs });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? "Could not load audit logs." }, { status: 500 });
  }
}
