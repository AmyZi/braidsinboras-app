import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendBookingConfirmation(booking: {
  customerName: string;
  customerEmail: string;
  service: string;
  startTime: string;
  notes?: string;
  depositPaid?: number;
  cancelToken?: string;
}) {
  const transporter = createTransporter();

  const formattedTime = new Date(booking.startTime).toLocaleString("en-SE", {
    weekday: "long", day: "numeric", month: "long",
    hour: "2-digit", minute: "2-digit",
    timeZone: "Europe/Stockholm",
  });

  const cancelUrl = booking.cancelToken
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/cancel?token=${booking.cancelToken}`
    : null;

  // Email to customer
  await transporter.sendMail({
    from: `"BraidsInBorås" <${process.env.SMTP_USER}>`,
    to: booking.customerEmail,
    subject: `Booking confirmed – ${booking.service}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:2rem;color:#1a1a1a;">
        <h1 style="font-size:1.75rem;color:#c9a96e;margin-bottom:0.25rem;">BraidsInBorås</h1>
        <p style="color:#888;font-size:0.8rem;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:2rem;">Booking Confirmation</p>

        <p>Hi ${booking.customerName},</p>
        <p style="margin-top:0.5rem;">Your booking is confirmed. Here are your details:</p>

        <div style="background:#f9f6f0;border-left:3px solid #c9a96e;padding:1.25rem 1.5rem;margin:1.5rem 0;border-radius:4px;">
          <table style="width:100%;font-size:0.9rem;border-collapse:collapse;">
            <tr><td style="color:#888;padding:0.3rem 0;width:40%;">Service</td><td><strong>${booking.service}</strong></td></tr>
            <tr><td style="color:#888;padding:0.3rem 0;">Date & Time</td><td><strong>${formattedTime}</strong></td></tr>
            ${booking.depositPaid ? `<tr><td style="color:#888;padding:0.3rem 0;">Deposit paid</td><td><strong>${booking.depositPaid} SEK</strong></td></tr>` : ""}
            ${booking.notes ? `<tr><td style="color:#888;padding:0.3rem 0;">Notes</td><td>${booking.notes}</td></tr>` : ""}
          </table>
        </div>

        <p style="color:#666;font-size:0.875rem;">
          End time will be confirmed by your stylist on arrival based on hair length and density.
        </p>

        ${cancelUrl ? `
        <div style="margin-top:1.5rem;padding:1rem;background:#fff8f0;border:1px solid #f0e0c0;border-radius:4px;">
          <p style="font-size:0.85rem;color:#666;margin-bottom:0.75rem;">
            Need to cancel? You can cancel up to 48 hours before your appointment for a full deposit refund.
          </p>
          <a href="${cancelUrl}"
            style="display:inline-block;background:#c9a96e;color:#fff;padding:0.6rem 1.25rem;border-radius:4px;text-decoration:none;font-size:0.85rem;font-family:sans-serif;">
            Cancel this booking
          </a>
        </div>` : ""}

        <p style="margin-top:2rem;">See you soon!<br/><strong>BraidsInBorås</strong></p>
        <hr style="border:none;border-top:1px solid #eee;margin:2rem 0;"/>
        <p style="font-size:0.75rem;color:#aaa;">braidsboras.se · Borås, Sweden</p>
      </div>
    `,
  });

  // Internal notification
  await transporter.sendMail({
    from: `"BraidsInBorås Booking" <${process.env.SMTP_USER}>`,
    to: process.env.SALON_EMAIL || process.env.SMTP_USER!,
    subject: `New booking – ${booking.service} – ${booking.customerName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:1.5rem;">
        <h2 style="color:#c9a96e;">New Booking</h2>
        <table style="width:100%;font-size:0.9rem;border-collapse:collapse;">
          <tr><td style="padding:0.4rem 0;color:#666;">Customer</td><td><strong>${booking.customerName}</strong></td></tr>
          <tr><td style="padding:0.4rem 0;color:#666;">Email</td><td>${booking.customerEmail}</td></tr>
          <tr><td style="padding:0.4rem 0;color:#666;">Service</td><td>${booking.service}</td></tr>
          <tr><td style="padding:0.4rem 0;color:#666;">Time</td><td>${formattedTime}</td></tr>
          ${booking.depositPaid ? `<tr><td style="padding:0.4rem 0;color:#666;">Deposit</td><td>${booking.depositPaid} SEK</td></tr>` : ""}
          ${booking.notes ? `<tr><td style="padding:0.4rem 0;color:#666;">Notes</td><td>${booking.notes}</td></tr>` : ""}
        </table>
      </div>
    `,
  });
}