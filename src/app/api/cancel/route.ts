import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyCancelToken } from "@/lib/cancel-token";
import { calendar } from "@/lib/google-calendar";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  // Verify token
  const payload = await verifyCancelToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const { eventId, paymentIntentId } = payload;

  try {
    // 1. Get calendar event to check appointment time
    const event = await calendar.events.get({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      eventId,
    });

    const appointmentTime = new Date(event.data.start?.dateTime!);
    const now = new Date();
    const hoursUntilAppointment = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    const isRefundable = hoursUntilAppointment > 48;

    // 2. Delete calendar event
    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      eventId,
    });

    console.log("[CANCEL] Calendar event deleted:", eventId);

    // 3. Refund deposit if > 48 hours
    let refunded = false;
    let refundAmount = 0;

    if (isRefundable && paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      refundAmount = Math.round(paymentIntent.amount_received / 100);

      await stripe.refunds.create({
        payment_intent: paymentIntentId,
      });

      refunded = true;
      console.log("[CANCEL] Deposit refunded:", refundAmount, "SEK");
    }

    return NextResponse.json({ success: true, refunded, refundAmount });
  } catch (err: any) {
    console.error("[CANCEL ERROR]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}