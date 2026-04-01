import { getAllServices as getServices } from "@/lib/wordpress";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const readable = slug.replace(/-/g, " ");
  const title = `${readable} in Borås | Price & Online Booking`;
  const desc = `Need ${readable} in Borås? View service details and book online with a secure deposit.`;
  return {
    title,
    description: desc,
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: { title, description: desc, url: `https://braidsboras.se/services/${slug}` },
    twitter: {
      card: "summary",
      title,
      description: desc,
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const readable = slug.replace(/-/g, " ");
  return (
    <main style={{ maxWidth: 700, margin: "40px auto" }}>
      <h1>{readable}</h1>
      <p>Get professional {readable} in Borås.</p>
      <a href="/booking">Book this style →</a>
    </main>
  );
}
