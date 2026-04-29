"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type GalleryItem = {
  image: string;
  title: string;
  caption: string;
};

const FALLBACK_STYLES: GalleryItem[] = [
  {
    title: "Cornrows",
    caption: "Clean, precise cornrow styling tailored to your pattern and density.",
    image: "https://res.cloudinary.com/dh1zzn3o4/image/upload/f_auto,q_auto/plain_cornrow_kdzwrn",
  },
  {
    title: "Stitch Braids",
    caption: "Crisp stitch braids for a sharp, defined finish that lasts.",
    image: "https://res.cloudinary.com/dh1zzn3o4/image/upload/f_auto,q_auto/stitch_braidsjpeg_k9v8ye",
  },
  {
    title: "Coi Leray Braids",
    caption: "The signature simple and bold braids.",
    image: "https://res.cloudinary.com/dh1zzn3o4/image/upload/f_auto,q_auto/coiLeray_mikbob",
  },
];

const CARD_GRADIENT = "linear-gradient(135deg, #1a1410 0%, #2d1f0e 100%)";

export default function StyleGallery() {
  const [items, setItems] = useState<GalleryItem[]>(FALLBACK_STYLES);
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/api/stylegallery", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        }
      })
      .catch(() => {
        // Keep fallback gallery when API is unavailable.
      });
  }, []);

  const go = (index: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(index);
      setAnimating(false);
    }, 300);
  };

 const next = () => go((active + 1) % items.length);
  const prev = () => go((active - 1 + items.length) % items.length);


  useEffect(() => {
    if (items.length <= 1) return;
    intervalRef.current = setInterval(next, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, items.length]);

  const style = items[active] ?? FALLBACK_STYLES[0];
  const totalItems = items.length;


  return (
    <section className="gallery-section">
      <div
        className={`gallery-card ${animating ? "gallery-card-exit" : "gallery-card-enter"}`}
        style={{ background: CARD_GRADIENT }}
      >
        {/* Photo */}
        <div className="gallery-visual">
          <img src={style.image} alt={style.title} className="gallery-img" />
          <div className="gallery-img-overlay" style={{ background: CARD_GRADIENT }} />
        </div>

        <div className="gallery-content">
          <div className="gallery-counter">
            {active + 1} / {items.length}
          </div>
          <h3 className="gallery-style-name" style={{ color: "#e8cc9a" }}>
            {style.title}
          </h3>
           <p className="gallery-style-desc">{style.caption}</p>
          <Link href="/booking" className="btn btn-primary" style={{ width: "auto", marginTop: "1.5rem" }}>
            Book this style →
          </Link>
        </div>
      </div>

      {items.length > 1 && (
        <div className="gallery-controls">
          <button className="gallery-arrow" onClick={prev} aria-label="Previous style">
            ←
          </button>
          <div className="gallery-dots">
            {items.map((item, i) => (
              <button
                key={`${item.image}-${i}`}
                className={`gallery-dot ${i === active ? "active" : ""}`}
                onClick={() => go(i)}
                aria-label={`Go to ${item.title}`}
              />
            ))}
          </div>
          <button className="gallery-arrow" onClick={next} aria-label="Next style">
            →
          </button>
        </div>
      )}
    </section>
  );
}