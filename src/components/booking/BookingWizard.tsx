"use client";

import { useState, useEffect } from "react";
import "@/styles/globals.css";

// ─── Types ────────────────────────────────────────────────────────────────────
type Service = {
  id: string;
  slug: string;
  title: string;
  price: number;
  category: string;
  isPopular: boolean;
  descriptionSv: string;
  available: boolean;
};

type Slot = { start: string; label: string };

type BookingState = {
  service: Service | null;
  date: string;
  slot: Slot | null;
};

const STEPS = ["Service", "Date", "Time", "Your details"];
const WHATSAPP_NUMBER = "+46737350019";

// ─── Loader ───────────────────────────────────────────────────────────────────
function Loader({ text }: { text: string }) {
  return (
    <div className="loader">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}

// ─── Step 1: Service Selector ─────────────────────────────────────────────────
function ServiceSelector({ onSelect }: { onSelect: (s: Service) => void }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/services", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { setServices(d.services || []); setLoading(false); })
      .catch(() => { setError("Could not load services. Please refresh."); setLoading(false); });
  }, []);

  if (loading) return <Loader text="Loading services..." />;
  if (error) return <div className="alert alert-error">{error}</div>;

  const categories = [...new Set(services.map((s) => s.category))];

  const handleWhatsApp = (service: Service) => {
    const msg = encodeURIComponent(
      `Hi! I'm interested in booking ${service.title} but it shows as unavailable. Could you let me know your ideal time slots?`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <div className="step-content">
      <h2 className="step-title">Choose a service</h2>
      <p className="step-subtitle">
        Price varies based on hair length and density — confirmed by stylist on arrival.
      </p>
      {categories.map((cat) => (
        <div key={cat} className="category-group">
          <span className="section-label">{cat}</span>
          <div className="services-grid">
            {services.filter((s) => s.category === cat).map((service) => {
              const isDisabled = service.available === false;
              return (
                <div
                  key={service.id}
                  className={`service-card ${selected === service.id ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
                  style={isDisabled ? { opacity: 0.5, cursor: "default",  } : { cursor: "pointer" }}
                  onClick={() => {
                    if (isDisabled) return;
                    setSelected(service.id);
                    setTimeout(() => onSelect(service), 280);
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.25rem" }}>
                    {service.isPopular && !isDisabled && (
                      <span className="popular-badge">Popular</span>
                    )}
                    {isDisabled && (
                      <span className="popular-badge" style={{ background: "var(--text-muted)", color: "var(--surface)" }}>
                        Not available
                      </span>
                    )}
                  </div>
                  <h3 className="service-name">{service.title}</h3>
                  <p className="service-desc">{service.descriptionSv}</p>
                  <div className="service-footer">
                    <span className="service-price">from {service.price} SEK</span>
                    {isDisabled ? (
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
                        onClick={() => handleWhatsApp(service)}
                      >
                        💬 WhatsApp us
                      </button>
                    ) : (
                      <button
                        className="btn-inline"
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                        onClick={() => {
                          if (isDisabled) return;
                          setSelected(service.id);
                          setTimeout(() => onSelect(service), 280);
                        }}
                      >
                        <span className="select-arrow">→</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Step 2: Date Picker ──────────────────────────────────────────────────────
function DatePicker({ onSelect }: { onSelect: (date: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  const days: { date: string; label: string; weekday: string }[] = [];
  const today = new Date();
  for (let i = 1; days.length < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === 0) continue;
    const iso = d.toISOString().split("T")[0];
    days.push({
      date: iso,
      label: d.toLocaleDateString("en-SE", { day: "numeric", month: "short" }),
      weekday: d.toLocaleDateString("en-SE", { weekday: "short" }),
    });
  }

  const rows: typeof days[] = [];
  for (let i = 0; i < days.length; i += 6) rows.push(days.slice(i, i + 6));

  return (
    <div className="step-content">
      <h2 className="step-title">Pick a date</h2>
      <p className="step-subtitle">Open Monday – Saturday, 09:00 – 18:00.</p>
      <div className="calendar-wrapper">
        {rows.map((row, ri) => (
          <div key={ri} className="calendar-row">
            {row.map(({ date, label, weekday }) => (
              <button
                key={date}
                className={`day-btn ${selected === date ? "selected" : ""}`}
                onClick={() => { setSelected(date); setTimeout(() => onSelect(date), 280); }}
              >
                <span className="day-weekday">{weekday}</span>
                <span className="day-label">{label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 3: Time Slot Picker ─────────────────────────────────────────────────
function TimeSlotPicker({ date, onSelect }: { date: string; onSelect: (slot: Slot) => void }) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/calendar/slots?date=${date}`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((d) => { setSlots(d.slots || []); setLoading(false); })
      .catch(() => { setError("Could not load times. Please try again."); setLoading(false); });
  }, [date]);

  if (loading) return <Loader text="Checking availability..." />;
  if (error) return <div className="alert alert-error">{error}</div>;

  const formattedDate = new Date(date + "T12:00:00").toLocaleDateString("en-SE", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <div className="step-content">
      <h2 className="step-title">Pick a start time</h2>
      <p className="step-subtitle">{formattedDate} — end time determined by stylist on arrival.</p>
      {slots.length === 0 ? (
        <div className="no-slots">
          <span className="emoji">😔</span>
          <p>No times available. Go back and choose another date.</p>
        </div>
      ) : (
        <div className="slots-grid">
          {slots.map((slot) => (
            <button
              key={slot.start}
              className={`slot-btn ${selected === slot.start ? "selected" : ""}`}
              onClick={() => { setSelected(slot.start); setTimeout(() => onSelect(slot), 280); }}
            >
              {slot.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step 4: Customer Form ────────────────────────────────────────────────────
function CustomerForm({ booking, onSuccess }: { booking: BookingState; onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const depositAmount = Math.round((booking.service?.price || 0) * 0.2);

  const formattedDate = new Date(booking.date + "T12:00:00").toLocaleDateString("en-SE", {
    weekday: "long", day: "numeric", month: "long",
  });

  const submit = async () => {
    if (!name.trim() || !email.trim()) { setError("Name and email are required."); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          customerEmail: email.trim(),
          service: booking.service?.title,
          servicePrice: booking.service?.price,
          startTime: booking.slot?.start,
          notes: [phone ? `Phone: ${phone}` : "", notes].filter(Boolean).join(". "),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Could not create checkout. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="step-content">
      <h2 className="step-title">Your details</h2>
      <p className="step-subtitle">You will pay a 20% deposit to confirm your booking.</p>

      <div className="booking-summary">
        <div className="summary-row"><span>Service</span><strong>{booking.service?.title}</strong></div>
        <div className="summary-row"><span>Date</span><strong>{formattedDate}</strong></div>
        <div className="summary-row"><span>Start time</span><strong>{booking.slot?.label}</strong></div>
        <div className="summary-row"><span>Full price (from)</span><strong>{booking.service?.price} SEK</strong></div>
        <div className="summary-row"><span>Deposit due now (20%)</span><strong style={{ color: "var(--gold)" }}>{depositAmount} SEK</strong></div>
      </div>

      <div className="form-fields">
        <div className="field">
          <label>Full name *</label>
          <input type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label>Email *</label>
          <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>Phone number</label>
          <input type="tel" placeholder="070 000 00 00" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="field">
          <label>Notes for your stylist</label>
          <textarea
            placeholder="e.g. shoulder-length hair, high density, preferred style..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <button className="btn btn-primary" onClick={submit} disabled={loading}>
        {loading ? "Preparing payment..." : `Pay ${depositAmount} SEK deposit & confirm →`}
      </button>
    </div>
  );
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────
export default function BookingWizard() {
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState<BookingState>({ service: null, date: "", slot: null });
  const update = (data: Partial<BookingState>) => setBooking((b) => ({ ...b, ...data }));

  return (
    <div className="page-shell">
      <header className="salon-header">
        <div className="salon-name">BraidsInBorås</div>
        <div className="salon-tagline">Professional braiding · Borås</div>
      </header>

      <div className="progress-bar">
        {STEPS.map((_, i) => <div key={i} className={`progress-seg ${i <= step ? "active" : ""}`} />)}
      </div>
      <div className="progress-labels">
        {STEPS.map((label, i) => (
          <div key={label} className={`progress-lbl ${i === step ? "active" : ""}`}>{label}</div>
        ))}
      </div>

      <div className="card">
        {step > 0 && (
          <button className="back-btn" onClick={() => setStep((s) => s - 1)}>← Back</button>
        )}

        {step === 0 ? (
          <ServiceSelector onSelect={(service) => { update({ service }); setStep(1); }} />
        ) : step === 1 ? (
          <DatePicker onSelect={(date) => { update({ date }); setStep(2); }} />
        ) : step === 2 ? (
          <TimeSlotPicker date={booking.date} onSelect={(slot) => { update({ slot }); setStep(3); }} />
        ) : (
          <CustomerForm booking={booking} onSuccess={() => {}} />
        )}
      </div>
    </div>
  );
}