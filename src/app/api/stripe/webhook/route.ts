import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createCalendarBooking } from "@/lib/google-calendar";
import { sendBookingConfirmation } from "@/lib/email";
import { generateCancelToken } from "@/lib/cancel-token";


// Required for Stripe webhook signature verification
export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("[WEBHOOK] Signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { customerName, customerEmail, service, servicePrice, startTime, notes } =
      session.metadata!;

    console.log("[WEBHOOK] Payment confirmed for:", customerName, service);

    try {
      // 1. Create Google Calendar event
      const calEvent = await createCalendarBooking({
        customerName,
        customerEmail,
        service,
        startTime,
        notes,
      });

      console.log("[WEBHOOK] Calendar event created:", calEvent.id);

      // 2. Generate cancellation token
      const cancelToken = await generateCancelToken({
        eventId: calEvent.id!,
        email: customerEmail,
        paymentIntentId: session.payment_intent as string,
      });

      // 3. Send confirmation email with cancel link
      await sendBookingConfirmation({
        customerName,
        customerEmail,
        service,
        startTime,
        notes,
        depositPaid: Math.round(Number(servicePrice) * 0.2),
        cancelToken,
      });

      console.log("[WEBHOOK] Confirmation email sent");
    } catch (err: any) {
      console.error("[WEBHOOK] Post-payment processing failed:", err.message);
    }
  }

  return NextResponse.json({ received: true });
}