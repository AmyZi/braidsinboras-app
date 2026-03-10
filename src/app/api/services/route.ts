import { NextResponse } from "next/server";
import { getAllServices } from "@/lib/wordpress";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const services = await getAllServices();
    const response = NextResponse.json({ services });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}