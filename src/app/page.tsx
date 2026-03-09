import Link from "next/link";
import { getServices } from "@/lib/api";

export default async function HomePage() {

  const services = await getServices();

  return (
    <main style={{ maxWidth: 900, margin: "40px auto" }}>

      <h1>Professional Braids in Borås</h1>

      <p>
        Expert hair braiding services with online booking.
        Choose from a wide range of braid styles and secure
        your appointment instantly.
      </p>

      {/* CTA */}
      <Link href="/booking">
        <button
          style={{
            padding: 16,
            background: "black",
            color: "white",
            border: "none",
            marginTop: 20,
            cursor: "pointer"
          }}
        >
          Book Appointment
        </button>
      </Link>

      {/* Services SEO Section */}
      <h2 style={{ marginTop: 50 }}>
        Browse Braid Styles
      </h2>

      <ul>
        {services.map(s => (
          <li key={s.slug}>
            <Link href={`/braids/${s.slug}`}>
              {s.title}
            </Link>
          </li>
        ))}
      </ul>

      {/* SEO Content Block */}
      <section style={{ marginTop: 60 }}>
        <h2>Why Choose Our Braiding Services?</h2>

        <p>
          We provide professional braid styling tailored
          to your hair type and preferences. Our salon in
          Borås focuses on quality, comfort, and long-lasting
          results.
        </p>

        <p>
          Online booking ensures you secure a time that fits
          your schedule while browsing our style catalogue.
        </p>
      </section>

    </main>
  );
}
