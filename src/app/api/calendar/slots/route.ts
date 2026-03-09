import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/google-calendar";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Provide a valid date: YYYY-MM-DD" },
      { status: 400 }
    );
  }

  try {
    const slots = await getAvailableSlots(date);
    return NextResponse.json({ date, slots });
  } catch (err: any) {
    console.error("[SLOTS ERROR]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}