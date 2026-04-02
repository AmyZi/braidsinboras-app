"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Hide nav on booking and admin pages
  if (pathname.startsWith("/booking") || pathname.startsWith("/admin")) return null;

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          Braids <em>by Ami</em>
        </Link>

        {/* Desktop links */}
        <div className="nav-links">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`nav-link ${pathname === href ? "active" : ""}`}
            >
              {label}
            </Link>
          ))}
          <Link href="/booking" className="btn btn-primary nav-cta">
            Book now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className={`hamburger-bar ${open ? "open" : ""}`} />
          <span className={`hamburger-bar ${open ? "open" : ""}`} />
          <span className={`hamburger-bar ${open ? "open" : ""}`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-drawer ${open ? "nav-drawer-open" : ""}`}>
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="nav-drawer-link"
            onClick={() => setOpen(false)}
          >
            {label}
          </Link>
        ))}
        <Link href="/booking" className="btn btn-primary" onClick={() => setOpen(false)}>
          Book now
        </Link>
      </div>

      {/* Overlay */}
      {open && <div className="nav-overlay" onClick={() => setOpen(false)} />}
    </>
  );
}