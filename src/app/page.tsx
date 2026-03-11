import Link from "next/link";
import { getServices } from "@/lib/api";
import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Braids by Amy | Mobile Braider in Borås",
  description: "Professional mobile braiding in Borås. Box braids, knotless braids, cornrows & more. Book online with Amy — coming to you or at home studio in Glacialgatan.",
  keywords: ["braids borås", "mobile braider borås", "box braids borås", "knotless braids borås"],
};

const INFO_CARDS = [
  {
    title: "Deposits & Bookings",
    icon: "✦",
    items: [
      "20% non-refundable deposit to secure your appointment — deducted from final amount",
      "Appointments released on the 15th of every month",
      "Confirmation email sent after booking — ensure your details are correct",
      "Remaining balance paid in cash at appointment",
      "Appointments can be rescheduled once",
    ],
  },
  {
    title: "Cancellation & Late Policy",
    icon: "◇",
    items: [
      "10-minute grace period — £5 late fee for every 10 minutes after",
      "After 30 minutes your appointment may be cancelled",
      "No-shows without notice: bank charged, future bookings limited",
      "No reschedule within 48hrs of no-show unless you notify Amy",
    ],
  },
  {
    title: "Please Note",
    icon: "❋",
    items: [
      "Only pre-stretched expression hair accepted — available for 150kr/pack",
      "Contact via email for any colour other than black",
      "Hair must be clean and product-free on appointment day",
      "Ensure you're happy before leaving — complaints after won't be rectified",
      "Allow extra time after your appointment — perfection takes time!",
    ],
  },
];

const CONTACT = [
  { icon: "📍", text: "Glacialgatan, Borås" },
  { icon: "🚗", text: "Mobile service available" },
  { icon: "📧", text: "Ebiojoidris@gmail.com" },
  { icon: "📞", text: "0737 350 015" },
];

export default function HomePage() {
  return (
    <main className="page-shell" style={{ padding: 0, alignItems: "stretch" }}>

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-line hero-line-top" />

        <p className="hero-eyebrow">Hey lovely! Welcome to</p>

        <h1 className="hero-title">
          Braids<br />
          <em style={{ color: "var(--gold)", fontStyle: "italic" }}>by Amy</em>
        </h1>

        <p className="salon-tagline" style={{ margin: "1.5rem 0 2.5rem" }}>
          Mobile Braider · Borås, Sweden
        </p>

        <p className="hero-description">
          A mobile braider based in Borås — I come to you, or you come to me at my home studio on Glacialgatan.
        </p>

        <Link href="/booking" className="btn btn-primary" style={{ width: "auto", marginTop: "1rem" }}>
          Book your appointment →
        </Link>

        <div className="hero-scroll-hint">
          <span>scroll</span>
          <div className="hero-line-bottom" />
        </div>
      </section>

      {/* ── Contact Banner ── */}
      <div className="contact-banner">
        {CONTACT.map(({ icon, text }) => (
          <div key={text} className="contact-banner-item">
            <span>{icon}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* ── Info Cards ── */}
      <section className="info-grid">
        {INFO_CARDS.map(({ title, icon, items }) => (
          <div key={title} className="card">
            <div className="info-card-header">
              <span className="info-card-icon">{icon}</span>
              <h2 className="step-title" style={{ fontSize: "1.3rem" }}>{title}</h2>
            </div>
            <ul className="info-card-list">
              {items.map((item, i) => (
                <li key={i} className="info-card-item">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <h2 className="step-title" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}>
          Ready for your slay?
        </h2>
        <p className="step-subtitle" style={{ maxWidth: "380px", margin: "0 auto 2.5rem" }}>
          By booking you agree to the terms above. I can't wait to have you in my seat! 💛
        </p>
        <Link href="/booking" className="btn btn-ghost" style={{ width: "auto" }}>
          Book with Amy →
        </Link>
        <div className="cta-footer">BRAIDS BY AMY · BORÅS · SWEDEN</div>
      </section>

    </main>
  );
}