import { NextResponse } from "next/server";
import { getAllServices } from "@/lib/wordpress";

export const revalidate = 60;

export async function GET() {
  try {
    console.log("[SERVICES] Fetching from WordPress...");
    const services = await getAllServices();
    console.log("[SERVICES] Got:", services.length, "services");
    return NextResponse.json({ services });
  } catch (err: any) {
    console.error("[SERVICES ERROR]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}