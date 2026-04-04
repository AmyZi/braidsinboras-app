/* import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type WPMediaItem = {
  source_url?: string;
  title?: { rendered?: string };
  caption?: { rendered?: string };
};

function stripHtml(value?: string): string {
  return (value || "").replace(/<[^>]*>/g, "").trim();
}

export async function GET() {
  const WP_URL = process.env.NEXT_PUBLIC_WP_URL;
  const wpUser = process.env.WP_ADMIN_USER || "admin";
  const wpPass = process.env.WP_ADMIN_APP_PASSWORD || "";

  if (!WP_URL) {
    return NextResponse.json({ items: [] });
  }

  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/media?search=stylegallery&per_page=30&orderby=date&order=desc`,
      {
        headers: {
          Authorization: "Basic " + Buffer.from(`${wpUser}:${wpPass}`).toString("base64"),
        },
        cache: "no-store",
      }
    );

    const data: WPMediaItem[] = await res.json();

    const items = data
      .filter((item) => Boolean(item.source_url))
      .map((item) => ({
        image: item.source_url as string,
        title: stripHtml(item.title?.rendered) || "Style Gallery",
        caption: stripHtml(item.caption?.rendered) || "",
      }));

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
} */