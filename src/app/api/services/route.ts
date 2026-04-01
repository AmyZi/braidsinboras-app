import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const WP_URL = process.env.NEXT_PUBLIC_WP_URL;
  const wpUser = process.env.WP_ADMIN_USER || "admin";
  const wpPass = process.env.WP_ADMIN_APP_PASSWORD || "";

  try {
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/service?per_page=50&status=publish`, {
      headers: {
        "Authorization": "Basic " + Buffer.from(`${wpUser}:${wpPass}`).toString("base64"),
      },
      cache: "no-store",
    });

    const data = await res.json();

    const services = data.map((s: any) => ({
      id: s.id.toString(),
      slug: s.slug,
      title: s.title.rendered,
      price: s.meta?.price || 0,
      sizeVariants: s.meta?.size_variants || "[]",
      hoursNote: s.meta?.hours_note || "",
      available: s.meta?.available !== false, // default true unless explicitly false
    }));

    const response = NextResponse.json({ services });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}