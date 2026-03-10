import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { serviceId, available } = await req.json();
  console.log("[TOGGLE] serviceId:", serviceId, "type:", typeof serviceId);
  console.log("[TOGGLE] available:", available);

  if (!serviceId) {
    return NextResponse.json({ error: "serviceId required" }, { status: 400 });
  }

  const WP_URL = process.env.NEXT_PUBLIC_WP_URL || "http://wordpress";
  const wpUser = process.env.WP_ADMIN_USER || "admin";
  const wpPass = process.env.WP_ADMIN_APP_PASSWORD || "";

  try {
    // Decode GraphQL base64 ID → "post:14" → 14
    const decoded = Buffer.from(serviceId, "base64").toString("utf-8");
    const numericId = parseInt(decoded.split(":")[1], 10);
    console.log("[TOGGLE] decoded ID:", decoded, "numericId:", numericId);

    // Update WordPress
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/service/${numericId}`, {
      method: "PUT",
      headers: {
        "Authorization": "Basic " + Buffer.from(`${wpUser}:${wpPass}`).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meta: { available: available },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[TOGGLE] WP error:", err);
      return NextResponse.json({ error: err }, { status: 500 });
    }

    return NextResponse.json({ success: true, serviceId, available });
  } catch (err) {
    console.error("[TOGGLE] Error:", err);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}