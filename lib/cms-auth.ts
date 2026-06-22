import { NextResponse } from "next/server";

export function requireCmsAccess(req: Request) {
  const expectedToken = process.env.CMS_ACCESS_TOKEN || process.env.CMS_PASSWORD;

  if (!expectedToken) {
    return NextResponse.json(
      {
        ok: false,
        message: "CMS is not configured. Add CMS_ACCESS_TOKEN in Vercel environment variables.",
      },
      { status: 503 }
    );
  }

  const authHeader = req.headers.get("authorization") || "";
  const bearerToken = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";
  const headerToken = req.headers.get("x-cms-token")?.trim() || "";

  if (bearerToken !== expectedToken && headerToken !== expectedToken) {
    return NextResponse.json(
      { ok: false, message: "Invalid CMS passcode." },
      { status: 401 }
    );
  }

  return null;
}
