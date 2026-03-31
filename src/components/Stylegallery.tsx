"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const STYLES = [
  {
    name: "Cornrows",
    slug: "cornrows",
    color: "#c9a96e",
    gradient: "linear-gradient(135deg, #1a1410 0%, #2d1f0e 100%)",
    description: "Clean, precise cornrow styling tailored to your pattern and density.",
    image: "https://braidsinboras-production-800c.up.railway.app/wp-content/uploads/2026/03/plain_cornrow-1.jpeg",
  },
  {
    name: "Stitch Braids",
    slug: "stitch-braids",
    color: "#e8cc9a",
    gradient: "linear-gradient(135deg, #111418 0%, #1a2030 100%)",
    description: "Crisp stitch braids for a sharp, defined finish that lasts.",
    image: "https://braidsinboras-production-800c.up.railway.app/wp-content/uploads/2026/03/stitch_braidsjpeg.jpeg",
  },
  {
    name: "Coi Leray Braids",
    slug: "coi-leray-braids",
    color: "#c9a96e",
    gradient: "linear-gradient(135deg, #161210 0%, #2a1a18 100%)",
    description: "The signature simple and bold braids.",
    image: "https://braidsinboras-production-800c.up.railway.app/wp-content/uploads/2026/03/coiLeray.jpeg",
  },
  {
    name: "S-Medium Knotless",
    slug: "knotless-box-braids",
    color: "#e8cc9a",
    gradient: "linear-gradient(135deg, #101416 0%, #1a2820 100%)",
    description: "Medium knotless box braids — gentle on the scalp, natural movement.",
    image: "https://braidsinboras-production-800c.up.railway.app/wp-content/uploads/2026/03/smeduim_knotless.jpeg",
  },
];

export default function StyleGallery() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (index: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(index);
      setAnimating(false);
    }, 300);
  };

  const next = () => go((active + 1) % STYLES.length);
  const prev = () => go((active - 1 + STYLES.length) % STYLES.length);

  useEffect(() => {
    intervalRef.current = setInterval(next, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active]);

  const style = STYLES[active];

  return (
    <section className="gallery-section">
      <div className="gallery-eyebrow">Featured styles</div>
      <h2 className="gallery-heading">
        Braid styles in <em>Borås</em>
      </h2>

      <div
        className={`gallery-card ${animating ? "gallery-card-exit" : "gallery-card-enter"}`}
        style={{ background: style.gradient }}
      >
        {/* Photo */}
        <div className="gallery-visual">
          <img
            src={style.image}
            alt={`${style.name} in Borås by Amy`}
            className="gallery-img"
          />
          <div className="gallery-img-overlay" style={{ background: style.gradient }} />
        </div>

        {/* Content */}
        <div className="gallery-content">
          <div className="gallery-counter">
            {active + 1} / {STYLES.length}
          </div>
          <h3 className="gallery-style-name" style={{ color: style.color }}>
            {style.name}
          </h3>
          <p className="gallery-style-desc">{style.description}</p>
          <Link
            href="/booking"
            className="btn btn-primary"
            style={{ width: "auto", marginTop: "1.5rem" }}
          >
            Book this style →
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="gallery-controls">
        <button className="gallery-arrow" onClick={prev} aria-label="Previous style">
          ←
        </button>
        <div className="gallery-dots">
          {STYLES.map((_, i) => (
            <button
              key={i}
              className={`gallery-dot ${i === active ? "active" : ""}`}
              onClick={() => go(i)}
              aria-label={`Go to ${STYLES[i].name}`}
            />
          ))}
        </div>
        <button className="gallery-arrow" onClick={next} aria-label="Next style">
          →
        </button>
      </div>
    </section>
  );
}