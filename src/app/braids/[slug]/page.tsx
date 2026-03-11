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
  const title = `${slug.replace(/-/g, " ")} in Borås`;
  const desc = `Book professional ${title}. Expert braiding service with online scheduling.`;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc }
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
