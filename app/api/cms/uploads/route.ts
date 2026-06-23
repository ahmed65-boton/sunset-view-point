export const runtime = "nodejs";

import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { requireCmsAccess } from "@/lib/cms-auth";
import { recordCmsAudit } from "@/lib/cms-audit";
import { getStorageBucket } from "@/lib/firebase/admin";

function safeFileName(value: string) {
  const extension = value.includes(".") ? value.split(".").pop()?.toLowerCase() : "jpg";
  const base = value
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${base || "upload"}.${extension || "jpg"}`;
}

export async function POST(req: Request) {
  const authError = requireCmsAccess(req);
  if (authError) return authError;

  try {
    const form = await req.formData();
    const fileValue = form.get("file");
    const folder = String(form.get("folder") ?? "cms").replace(/[^a-z0-9/-]/gi, "").slice(0, 40) || "cms";

    if (!(fileValue instanceof File)) {
      return NextResponse.json({ ok: false, message: "Upload a file." }, { status: 400 });
    }

    if (!fileValue.type.startsWith("image/")) {
      return NextResponse.json({ ok: false, message: "Only image uploads are allowed." }, { status: 400 });
    }

    if (fileValue.size > 5 * 1024 * 1024) {
      return NextResponse.json({ ok: false, message: "Image must be 5MB or smaller." }, { status: 400 });
    }

    const bytes = Buffer.from(await fileValue.arrayBuffer());
    const token = randomUUID();
    const objectName = `${folder}/${Date.now()}-${safeFileName(fileValue.name)}`;
    const storageBucket = getStorageBucket();
    const object = storageBucket.file(objectName);

    await object.save(bytes, {
      resumable: false,
      metadata: {
        contentType: fileValue.type || "image/jpeg",
        metadata: {
          firebaseStorageDownloadTokens: token,
        },
      },
    });

    const encodedObject = encodeURIComponent(objectName);
    const url = `https://firebasestorage.googleapis.com/v0/b/${storageBucket.name}/o/${encodedObject}?alt=media&token=${token}`;
    await recordCmsAudit("upload.create", objectName, { size: fileValue.size, contentType: fileValue.type });

    return NextResponse.json({ ok: true, url, path: objectName });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? "Could not upload image." }, { status: 400 });
  }
}
