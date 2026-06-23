import { FieldValue } from "firebase-admin/firestore";

import { db } from "@/lib/firebase/admin";

export type AuditAction =
  | "booking.update"
  | "menu.create"
  | "menu.update"
  | "menu.delete"
  | "settings.update"
  | "page.create"
  | "page.update"
  | "page.delete"
  | "staff.create"
  | "staff.update"
  | "staff.delete"
  | "upload.create";

export async function recordCmsAudit(action: AuditAction, target: string, details?: Record<string, unknown>) {
  try {
    await db.collection("cmsAuditLogs").add({
      action,
      target,
      actor: "CMS passcode",
      details: details ?? {},
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("[CMS audit] Could not write audit log", error);
  }
}
