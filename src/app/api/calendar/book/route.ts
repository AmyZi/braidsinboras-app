import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createCalendarBooking } from "@/lib/google-calendar";
import { sendBookingConfirmation } from "@/lib/email";

const BookingSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  service: z.string().min(2),
  startTime: z.string().datetime({ offset: true }),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = BookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    // 1. Create Google Calendar event
    const event = await createCalendarBooking(parsed.data);
    console.log("[BOOK] Calendar event created:", event.id);

    // 2. Send email — await it so errors surface
    console.log("[BOOK] Sending email to:", parsed.data.customerEmail);
    try {
      await sendBookingConfirmation(parsed.data);
      console.log("[BOOK] Email sent successfully");
    } catch (emailErr: any) {
      console.error("[BOOK] Email failed:", emailErr.message);
    }

    return NextResponse.json({
      success: true,
      eventId: event.id,
      htmlLink: event.htmlLink,
    });
  } catch (err: any) {
    console.error("[BOOKING ERROR]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}