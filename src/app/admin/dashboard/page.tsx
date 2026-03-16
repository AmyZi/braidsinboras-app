"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Booking = {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  status: string;
  htmlLink: string;
};

type Service = {
  id: number;
  title: string;
  price: number;
  category: string;
  available: boolean;
};

type Tab = "bookings" | "services";

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);
  const router = useRouter();

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch("/api/admin/bookings");
      if (res.status === 401) { router.push("/admin"); return; }
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
    setLoadingBookings(false);
  };

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data.services || []);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
    setLoadingServices(false);
  };

  useEffect(() => {
    fetchBookings();
    fetchServices();
  }, []);

  const cancelBooking = async (id: string) => {
    if (!confirm("Cancel this booking? This will also process a refund if eligible.")) return;
    setCancelling(id);
    await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
    await fetchBookings();
    setCancelling(null);
  };

  const toggleService = async (service: Service) => {
    setToggling(service.id);
    try {
      const res = await fetch("/api/admin/services/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: service.id, available: !service.available }),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => s.id === service.id ? { ...s, available: !s.available } : s)
        );
      }
    } catch (err) {
      console.error("Failed to toggle service:", err);
    }
    setToggling(null);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  const parseDescription = (desc: string = "") => {
    const lines = desc.split("\n");
    const name = lines.find(l => l.startsWith("Customer:"))?.replace("Customer:", "").trim()
      || lines[0]?.replace("Kund:", "").trim() || "—";
    const email = lines.find(l => l.includes("@"))?.replace("Email:", "").trim() || "—";
    const notes = lines.find(l => l.startsWith("Notes:") || l.startsWith("Noteringar:"))
      ?.replace(/Notes:|Noteringar:/, "").trim() || "";
    return { name, email, notes };
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-SE", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
    timeZone: "Europe/Stockholm",
  });

  const today = new Date().toDateString();
  const todayCount = bookings.filter(b => new Date(b.start).toDateString() === today).length;
  const thisWeek = bookings.filter(b => {
    const d = new Date(b.start);
    const now = new Date();
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);
    return d >= now && d <= weekEnd;
  }).length;

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <div>
          <div className="admin-title">Dashboard</div>
          <div className="admin-sub">BraidsInBorås · Admin</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={logout}>Sign out</button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-num">{bookings.length}</div>
          <div className="stat-label">Upcoming</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{todayCount}</div>
          <div className="stat-label">Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{thisWeek}</div>
          <div className="stat-label">This week</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "0" }}>
        {(["bookings", "services"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: "none",
              border: "none",
              padding: "0.6rem 0.25rem",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontFamily: "var(--font-sans, sans-serif)",
              color: tab === t ? "var(--gold)" : "var(--text-muted)",
              borderBottom: tab === t ? "2px solid var(--gold)" : "2px solid transparent",
              marginBottom: "-1px",
              textTransform: "capitalize",
              letterSpacing: "0.05em",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Bookings Tab */}
      {tab === "bookings" && (
        <>
          {loadingBookings ? (
            <div className="loader"><div className="spinner" /></div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <span className="emoji">📅</span>
              <p>No upcoming bookings.</p>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => {
                const { name, email, notes } = parseDescription(booking.description);
                return (
                  <div key={booking.id} className="booking-card">
                    <div>
                      <div className="booking-service">{booking.title}</div>
                      <div className="booking-time">{formatDate(booking.start)}</div>
                      <div className="booking-meta">
                        <span>👤 {name}</span>
                        <span>✉️ {email}</span>
                      </div>
                      {notes && <div className="booking-notes">📝 {notes}</div>}
                    </div>
                    <div className="booking-actions">
                      <a className="cal-link" href={booking.htmlLink} target="_blank" rel="noreferrer">
                        View in Calendar →
                      </a>
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={cancelling === booking.id}
                        onClick={() => cancelBooking(booking.id)}
                      >
                        {cancelling === booking.id ? "Cancelling..." : "Cancel"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Services Tab */}
      {tab === "services" && (
        <>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
            Toggle services off to show as "Not available" in the booking wizard.
            Customers will see a WhatsApp link to enquire about availability.
          </p>
          {loadingServices ? (
            <div className="loader"><div className="spinner" /></div>
          ) : (
            <div className="bookings-list">
              {services.map((service) => (
                <div key={service.id} className="booking-card" style={{ opacity: service.available === false ? 0.6 : 1 }}>
                  <div>
                    <div className="booking-service">{service.title}</div>
                    <div className="booking-time" style={{ color: "var(--text-muted)" }}>
                      {service.category} · from {service.price} SEK
                    </div>
                  </div>
                  <div className="booking-actions">
                    {/* Toggle Switch */}
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                      <span style={{ fontSize: "0.75rem", color: service.available !== false ? "var(--green)" : "var(--text-muted)" }}>
                        {service.available !== false ? "Taking bookings" : "Not currently taking bookings"}
                      </span>
                      <div
                        onClick={() => !toggling && toggleService(service)}
                        style={{
                          width: "42px",
                          height: "24px",
                          borderRadius: "12px",
                          background: service.available !== false ? "var(--gold)" : "var(--border)",
                          position: "relative",
                          cursor: toggling === service.id ? "wait" : "pointer",
                          transition: "background 0.2s",
                          flexShrink: 0,
                        }}
                      >
                        <div style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          background: "#fff",
                          position: "absolute",
                          top: "3px",
                          left: service.available !== false ? "21px" : "3px",
                          transition: "left 0.2s",
                        }} />
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}