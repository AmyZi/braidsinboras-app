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
  const title = `${slug.replace(/-/g, " ")} in Borås`;
  const desc = `Book professional ${title}. Expert braiding service with online scheduling.`;
  return { title, description: desc };
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
