import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

const CheckoutSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  service: z.string().min(2),
  servicePrice: z.number().min(1),
  startTime: z.string().datetime({ offset: true }),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });

  const body = await req.json();
  const parsed = CheckoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { customerName, customerEmail, service, servicePrice, startTime, notes } = parsed.data;

  const depositAmount = Math.round(servicePrice * 0.2) * 100;

  const formattedTime = new Date(startTime).toLocaleString("en-SE", {
    weekday: "long", day: "numeric", month: "long",
    hour: "2-digit", minute: "2-digit",
    timeZone: "Europe/Stockholm",
  });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "sek",
            product_data: {
              name: `Deposit — ${service}`,
              description: `20% deposit for ${service} on ${formattedTime}. Remaining balance paid at salon.`,
            },
            unit_amount: depositAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        customerName,
        customerEmail,
        service,
        servicePrice: servicePrice.toString(),
        startTime,
        notes: notes || "",
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[STRIPE] Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}