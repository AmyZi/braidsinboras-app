import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ items: [] });
  }

  try {
    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?prefix=braidsboras/gallery&max_results=20`,
      {
        headers: { Authorization: `Basic ${credentials}` },
        cache: "no-store",
      }
    );

    const data = await res.json();

    const items = (data.resources || []).map((r: any) => ({
      image: `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_800/${r.public_id}`,
      title: r.context?.custom?.caption || r.public_id.split("/").pop().replace(/-|_/g, " "),
      caption: r.context?.custom?.alt || "",
    }));

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}