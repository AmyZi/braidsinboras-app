import Link from "next/link";
import type { Metadata } from "next";
import "@/styles/globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Braids by Ami — Hair Tips & Style Guides in Borås",
  description: "Hair care tips, braid style guides and booking advice from Braids by Ami in Borås.",
  alternates: { canonical: "/blog" },
};

type WPPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  featured_media: number;
  _embedded?: any;
};

async function getPosts(): Promise<WPPost[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/posts?per_page=20&status=publish&_embed`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/gi, " ").trim();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-SE", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="page-shell" style={{ padding: 0, alignItems: "stretch" }}>

      <section className="service-hero" style={{ minHeight: "35vh" }}>
        <p className="hero-eyebrow">Braids by Ami · Borås</p>
        <h1 className="hero-title" style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}>
          Hair <em style={{ color: "var(--gold)", fontStyle: "italic" }}>journal</em>
        </h1>
        <p className="step-subtitle" style={{ maxWidth: "420px", marginTop: "0.75rem" }}>
          Style guides, hair care tips and braid inspiration from Borås.
        </p>
      </section>

      <section style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 1.5rem", width: "100%" }}>
        {posts.length === 0 ? (
          <div className="card" style={{ textAlign: "center" }}>
            <p className="step-subtitle">No posts yet — check back soon.</p>
            <Link href="/" className="btn btn-primary" style={{ width: "auto", marginTop: "1rem" }}>
              Back to home
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {posts.map((post) => {
              const featuredImg = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="blog-card"
                >
                  {featuredImg && (
                    <div className="blog-card-img">
                      <img src={featuredImg} alt={post.title.rendered} />
                    </div>
                  )}
                  <div className="blog-card-body">
                    <span className="blog-card-date">{formatDate(post.date)}</span>
                    <h2 className="blog-card-title"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    <p className="blog-card-excerpt">
                      {stripHtml(post.excerpt.rendered).slice(0, 140)}...
                    </p>
                    <span className="blog-card-read">Read more →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

    </main>
  );
}