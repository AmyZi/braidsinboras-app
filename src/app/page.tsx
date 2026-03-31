import Link from "next/link";
import { getServices } from "@/lib/api";
import "@/styles/globals.css";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import StyleGallery from "@/components/Stylegallery";

export const metadata: Metadata = {
  title: "Braids by Amy | Braids & Mobile Hair Styling in Borås",
  description:
    "Book braids in Borås with Amy. Mobile appointments and home-studio visits in Trandared/Glacialgatan area. Box braids, knotless, cornrows and protective styling.",
  keywords: [
    "braids borås",
    "frisör borås",
    "hårstyling borås",
    "frisör trandared",
    "mobile braider borås",
    "hair salon near me borås",
    "afro hair borås",
    "afro frisör borås",
  ],
};
const CONTACT = {
  email: "Ebiojoidris@gmail.com",
  phoneDisplay: "0737 350 015",
  phoneHref: "tel:+46737350015",
};


const TRUST_POINTS = [
  "⭐ 5-star client experience focus",
  "📍 Based in Borås (Trandared / Glacialgatan)",
  "🚗 Mobile appointments available",
  "🔒 20% secure online deposit",
];


const WHY_CHOOSE = [ 
  {
    title: "Designed for your hair type",
    text: "Every appointment starts with a quick consultation so style, size and parting match your density, length and lifestyle.",
  },
  {
   title: "Clear pricing before you pay",
    text: "You see transparent starting prices before booking, then final details are confirmed at your appointment.",
  },
  {
    title: "Easy rescheduling and support",
    text: "You receive confirmation email details, cancellation options and direct contact support if your plans change.",
  },
];

const FAQS = [
  {
    q: "Do you do regular haircuts like a classic frisör in Borås?",
    a: "Braids by Amy specializes in braids and protective styling rather than standard clipper/scissor cuts. If you are searching for braids, knotless, cornrows or hair styling in Borås, you are in the right place.",
  },
  {
    q: "Can I book if I searched ‘hair salon near me’ in Borås?",
    a: "Yes. Appointments are available at the home studio in Borås and as mobile service depending on your location and slot availability.",
  },
  {
    q: "Do you work with afro hair textures?",
    a: "Yes. Braids by Amy focuses on protective styles and afro hair care-friendly techniques, with recommendations based on your texture, density and desired finish.",
  },
  {
    q: "How much do braids cost?",
    a: "Each service shows a starting price. Final time and total are based on hair length, density, and style complexity, confirmed at your appointment.",
  },
];
const HOW_IT_WORKS = [
  "Choose your braid style",
  "Pick your date and start time",
  "Pay 20% deposit securely",
  "Get confirmation and appointment details",
];

export default async function HomePage() {
  const services = await getServices();
  const featuredServices = services.slice(0, 6);

  return (
    <main className="page-shell" style={{ padding: 0, alignItems: "stretch" }}>
      {/* ── Hero section ── */}
      <section className="hero-section hero-convert">
        <p className="hero-eyebrow">Top-rated braid stylist in Borås</p>

        <h1 className="hero-title">
          Braids in Borås<br />
          <em style={{ color: "var(--gold)", fontStyle: "italic" }}>by Ami</em>
        </h1>

        <p className="hero-description hero-description-wide">
          Looking for <strong>braids, afro hair styling, hårstyling, or a trusted local frisör in Borås</strong>? Get premium protective styles with a smooth online booking flow, mobile availability, and clear pricing.
        </p>

        <div className="hero-cta-row">
          <Link href="/booking" className="btn btn-primary" style={{ width: "auto" }}>
            Book your appointment
          </Link>
          <a href={CONTACT.phoneHref} className="btn btn-ghost" style={{ width: "auto" }}>
            Call {CONTACT.phoneDisplay}
          </a>
        </div>

        <p className="hero-support-copy">
          Prefer email? <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </p>
      </section>

      {/* ── Trust strip ── */}
      <section className="trust-strip">
        {TRUST_POINTS.map((point) => (
          <p key={point}>{point}</p>
        ))}
      </section>

      {/* ── Style Gallery ── */}
      <StyleGallery />
 
      {/* ── Featured services ── */}
      <section className="home-section">
        <div className="home-section-header">
          <h2 className="step-title">Most-booked braid services</h2>
          <p className="step-subtitle">
            Popular styles local clients search for in Borås. Select a service to view details, then continue to instant booking.
          </p>
        </div>

        {featuredServices.length === 0 ? (
          <div className="card" style={{ maxWidth: "var(--admin-width)" }}>
            <p className="step-subtitle" style={{ marginTop: 0 }}>
              Services are being updated right now. You can still continue directly to booking and see live availability.
            </p>
            <Link href="/booking" className="btn btn-primary" style={{ marginTop: "1rem" }}>
              Go to booking
            </Link>
          </div>
        ) : (
          <div className="home-services-grid">
            {featuredServices.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`} className="home-service-card">
                <h3>{service.title}</h3>
                <span>View style details →</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── How it works + Why Amy ── */}
      <section className="home-section">
        <div className="home-two-col">
          <div className="card">
            <h2 className="step-title">How booking works</h2>
            <ol className="home-ordered-list">
              {HOW_IT_WORKS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <Link href="/booking" className="btn btn-primary" style={{ marginTop: "1.25rem", width: "auto" }}>
              Start booking now
            </Link>
          </div>
          
          <div className="card">
            <h2 className="step-title">Why clients choose Braids by Amy</h2>
            <div className="home-points">
              {WHY_CHOOSE.map((point) => (
                <div key={point.title}>
                  <h3>{point.title}</h3>
                  <p>{point.text}</p>
                </div>
              ))}
          </div>
        </div> 
      </div>
      </section>

      {/* ── FAQs ── */}
      <section className="home-section">
        <div className="card" style={{ maxWidth: "var(--admin-width)" }}>
          <h2 className="step-title">Frequently asked questions</h2>
          <div className="faq-grid">
            {FAQS.map((faq) => (
              <details key={faq.q} className="faq-item">
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>   


      {/* ── CTA ── */}
      <section className="cta-section">
        <h2 className="step-title" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}>
          Ready to book your braid appointment in Borås?
        </h2>
        <p className="step-subtitle" style={{ maxWidth: "540px", margin: "0 auto 2.5rem" }}>
          Choose your style, lock your date, and pay only a 20% deposit today. Remaining balance is paid at your appointment.
        </p>
         <div className="hero-cta-row">
          <Link href="/booking" className="btn btn-primary" style={{ width: "auto" }}>
            Book with Amy
          </Link>
          <a href={`mailto:${CONTACT.email}`} className="btn btn-ghost" style={{ width: "auto" }}>
            Ask a question first
          </a>
        </div>
        <Footer />
      </section>
    </main>
  );
}