import { NextRequest, NextResponse } from "next/server";
import { calendar } from "@/lib/google-calendar";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

    const { data } = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      timeMin: now.toISOString(),
      timeMax: threeMonthsLater.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const bookings = (data.items || []).map((event) => ({
      id: event.id,
      title: event.summary,
      description: event.description,
      start: event.start?.dateTime,
      end: event.end?.dateTime,
      status: event.status,
      htmlLink: event.htmlLink,
    }));

    return NextResponse.json({ bookings });
  } catch (err: any) {
    console.error("[ADMIN BOOKINGS ERROR]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("id");
  if (!eventId) {
    return NextResponse.json({ error: "Event ID required" }, { status: 400 });
  }

  try {
    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      eventId,
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[ADMIN DELETE ERROR]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}