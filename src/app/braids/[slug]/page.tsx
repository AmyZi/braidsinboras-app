import type { Metadata } from "next";
import { getAllServices } from "@/lib/wordpress";



interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getAllServices();
  return services.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; 
  
  const readable = slug.replace(/-/g, " ");
  const title = `${readable} in Borås | Price & Online Booking`;
  const desc = `Book ${readable} in Borås. See style details and reserve your appointment online with a secure deposit.`;
  return {
    title,
    description: desc,
    alternates: {
      canonical: `/braids/${slug}`,
    },
    openGraph: { title, description: desc, url: `https://braidsboras.se/braids/${slug}` },
    twitter: {
      card: "summary",
      title,
      description: desc,
    },
  };
}

export default async function BraidPage({ params }: Props) {
  const { slug } = await params;
  const readable = slug.replace(/-/g, " ");
  return (
    <main style={{ maxWidth: 700, margin: "40px auto" }}>
      <h1>{readable}</h1>
      <p>Get professional {readable} in Borås. Experienced braiding specialists offering high quality service.</p>
      <a href="/booking">Book this style →</a>
    </main>
  );
}
