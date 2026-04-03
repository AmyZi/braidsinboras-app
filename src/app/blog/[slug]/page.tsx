import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/styles/globals.css";

interface Props {
  params: Promise<{ slug: string }>;
}

type WPPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  _embedded?: any;
};

async function getPost(slug: string): Promise<WPPost | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const posts = await res.json();
    return posts[0] || null;
  } catch { return null; }
}

async function getAllSlugs(): Promise<string[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/posts?per_page=100&status=publish`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const posts = await res.json();
    return posts.map((p: any) => p.slug);
  } catch { return []; }
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };

  const title = `${post.title.rendered} | Braids by Ami`;
  const desc = post.excerpt.rendered.replace(/<[^>]*>/g, "").trim().slice(0, 160);
  const featuredImg = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return {
    title,
    description: desc,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description: desc,
      url: `https://braidsboras.se/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      ...(featuredImg && { images: [{ url: featuredImg }] }),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const featuredImg = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title.rendered,
    "datePublished": post.date,
    "author": { "@type": "Person", "name": "Ami" },
    "publisher": {
      "@type": "Organization",
      "name": "Braids by Ami",
      "url": "https://braidsboras.se",
    },
    ...(featuredImg && { "image": featuredImg }),
  };

  return (
    <main className="page-shell" style={{ padding: 0, alignItems: "stretch" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Featured image */}
      {featuredImg && (
        <div className="blog-hero-img">
          <img src={featuredImg} alt={post.title.rendered} />
          <div className="blog-hero-overlay" />
        </div>
      )}

      <article style={{ maxWidth: "680px", margin: "0 auto", padding: "3rem 1.5rem", width: "100%" }}>

        {/* Back */}
        <Link href="/blog" className="blog-back">← Back to journal</Link>

        {/* Header */}
        <header style={{ margin: "1.5rem 0 2.5rem" }}>
          <span className="blog-card-date">
            {new Date(post.date).toLocaleDateString("en-SE", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </span>
          <h1
            className="hero-title"
            style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", marginTop: "0.5rem" }}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </header>

        {/* Content from WP editor */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

        {/* CTA */}
        <div className="card" style={{ textAlign: "center", marginTop: "3rem" }}>
          <p className="step-subtitle" style={{ marginBottom: "1rem" }}>
            Ready to book your next style?
          </p>
          <Link href="/booking" className="btn btn-primary" style={{ width: "auto" }}>
            Book with Ami →
          </Link>
        </div>

      </article>
    </main>
  );
}