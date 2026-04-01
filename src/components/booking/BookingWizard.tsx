"use client";

import { useState, useEffect } from "react";
import "@/styles/globals.css";

// ─── Types ────────────────────────────────────────────────────────────────────
type SizeVariant = {
  label: string;
  price: number;
  hours_min: number;
  hours_max: number;
};

type Service = {
  id: string;
  slug: string;
  title: string;
  price: number;
  available: boolean;
  sizeVariants?: string;
  hoursNote?: string;
};

type Slot = { start: string; label: string };

type BookingState = {
  service: Service | null;
  size: SizeVariant | null;
  date: string;
  slot: Slot | null;
};

const STEPS = ["Service", "Size", "Date", "Time", "Your details"];
const WHATSAPP_NUMBER = "+46737350019";

function parseVariants(json?: string): SizeVariant[] {
  if (!json) return [];
  try { return JSON.parse(json) || []; }
  catch { return []; }
}

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

  return (
    <div className="step-content">
      <h2 className="step-title">Choose a service</h2>
      <p className="step-subtitle">Select a style to see size options and pricing.</p>
      <div className="services-grid">
        {services.map((service) => {
          const isDisabled = service.available === false;
          const variants = parseVariants(service.sizeVariants);
          const minPrice = variants.length > 0
              ? Math.min(...variants.map(v => v.price))
              : service.price;

            return (
              <button
                key={service.id}
                role="radio"
                aria-checked={selected === service.id}
                aria-disabled={isDisabled}
                disabled={isDisabled}
                className={`service-card ${selected === service.id ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: isDisabled ? "default" : "pointer",
                  opacity: isDisabled ? 0.6 : 1,
                }}
                onClick={() => {
                  if (isDisabled) return;
                  setSelected(service.id);
                  setTimeout(() => onSelect(service), 280);
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.25rem" }}>
                  {isDisabled && (
                    <span className="popular-badge" style={{ background: "var(--text-muted)", color: "var(--surface)" }}>
                      Not currently taking bookings
                    </span>
                  )}
                </div>
                <h3 className="service-name">{service.title}</h3>

                {/* Size preview — show labels if variants exist */}
                {variants.length > 0 && (
                  <p className="service-desc">
                    {variants.map(v => v.label).join(" · ")}
                  </p>
                )}

                <div className="service-footer">
                  <span className="service-price">from {minPrice} SEK</span>
                  {isDisabled ? (
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}?text=${encodeURIComponent(`Hi! I'm interested in booking ${service.title} but it shows as unavailable. Could you let me know your availability?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem", textDecoration: "none" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      💬 WhatsApp us
                    </a>
                  ) : (
                    <button
                      className="btn-inline"
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                      onClick={() => {
                        setSelected(service.id);
                        setTimeout(() => onSelect(service), 280);
                      }}
                    >
                      <span className="select-arrow">→</span>
                    </button>
                  )}
                </div>
              </button>
            );
          })}
        </div>
    </div>
  );
}

// ─── Step 2: Size Selector ────────────────────────────────────────────────────
function SizeSelector({ service, onSelect, onSkip }: {
  service: Service;
  onSelect: (size: SizeVariant) => void;
  onSkip: () => void;
}) {
  const variants = parseVariants(service.sizeVariants);
  const [selected, setSelected] = useState<string | null>(null);

  // No variants — skip this step automatically
  useEffect(() => {
    if (variants.length === 0) onSkip();
  }, [onSkip, variants.length]);

  if (variants.length === 0) return <Loader text="Loading..." />;

  return (
    <div className="step-content">
      <h2 className="step-title">Choose a size</h2>
      <p className="step-subtitle">{service.title}</p>
      {service.hoursNote && (
        <div className="booking-notice" style={{ marginBottom: "1.25rem" }}>
          <p>⏱ {service.hoursNote}</p>
        </div>
      )}
      <div className="size-grid">
        {variants.map((v) => (
          <button
            key={v.label}
            className={`size-card ${selected === v.label ? "selected" : ""}`}
            onClick={() => {
              setSelected(v.label);
              setTimeout(() => onSelect(v), 280);
            }}
          >
            <span className="size-label">{v.label}</span>
            <span className="size-price">{v.price} SEK</span>
            <span className="size-hours">{v.hours_min}–{v.hours_max} hrs</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 3: Date Picker ──────────────────────────────────────────────────────
function DatePicker({ onSelect }: { onSelect: (date: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);

  const today = new Date();
  const startDate = new Date(today);

  if (monthOffset === 0) {
    startDate.setDate(today.getDate() + 1);
  } else {
    startDate.setMonth(today.getMonth() + monthOffset);
    startDate.setDate(1);
  }

  const days: { date: string; label: string; weekday: string }[] = [];
  for (let i = 0; days.length < 30; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
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

  const monthLabel = new Date(
    today.getFullYear(),
    today.getMonth() + monthOffset,
    1
  ).toLocaleString("en-SE", { month: "long", year: "numeric" });

  return (
    <div className="step-content">
      <h2 className="step-title">Pick a date</h2>
      <p className="step-subtitle">Open Monday – Saturday, 09:00 – 18:00.</p>
      <div className="month-nav">
        <button className="btn-ghost-small" onClick={() => { setMonthOffset((o) => Math.max(0, o - 1)); setSelected(null); }} disabled={monthOffset === 0} aria-label="Previous month">← Prev</button>
        <span className="month-nav-label">{monthLabel}</span>
        <button className="btn-ghost-small" onClick={() => { setMonthOffset((o) => o + 1); setSelected(null); }} aria-label="Next month">Next →</button>
      </div>
      <div className="calendar-wrapper">
        {rows.map((row, ri) => (
          <div key={ri} className="calendar-row">
            {row.map(({ date, label, weekday }) => (
              <button key={date} className={`day-btn ${selected === date ? "selected" : ""}`} onClick={() => { setSelected(date); setTimeout(() => onSelect(date), 280); }}>
                <span className="day-weekday">{weekday}</span>
                <span className="day-label">{label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="booking-notice">
        <p>📅 Appointments should only be booked two days in advance to ensure availability.</p>
        <p>💬 For impromptu bookings, <a href={`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`} style={{ color: "var(--gold)" }}>contact Ami directly</a> to confirm availability.</p>
      </div>
    </div>
  );
}

// ─── Step 4: Time Slot Picker ─────────────────────────────────────────────────
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
            <button key={slot.start} className={`slot-btn ${selected === slot.start ? "selected" : ""}`} onClick={() => { setSelected(slot.start); setTimeout(() => onSelect(slot), 280); }}>
              {slot.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step 5: Customer Form ────────────────────────────────────────────────────
function CustomerForm({ booking, onSuccess }: { booking: BookingState; onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const price = booking.size?.price || booking.service?.price || 0;
  const depositAmount = Math.round(price * 0.2);

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
          service: booking.size
            ? `${booking.service?.title} (${booking.size.label})`
            : booking.service?.title,
          servicePrice: price,
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
        {booking.size && <div className="summary-row"><span>Size</span><strong>{booking.size.label} — {booking.size.hours_min}–{booking.size.hours_max} hrs</strong></div>}
        <div className="summary-row"><span>Date</span><strong>{formattedDate}</strong></div>
        <div className="summary-row"><span>Start time</span><strong>{booking.slot?.label}</strong></div>
        <div className="summary-row"><span>Full price</span><strong>{price} SEK</strong></div>
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
          <textarea placeholder="e.g. shoulder-length hair, high density, preferred style..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
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
  const [booking, setBooking] = useState<BookingState>({ service: null, size: null, date: "", slot: null });
  const update = (data: Partial<BookingState>) => setBooking((b) => ({ ...b, ...data }));
   const totalSteps = STEPS.length;
  const formattedSelectedDate = booking.date
    ? new Date(booking.date + "T12:00:00").toLocaleDateString("en-SE", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : null;
  const canRestart = booking.service || booking.size || booking.date || booking.slot;
  return (
    <div className="page-shell">
      <header className="salon-header">
        <div className="salon-name">BraidsInBorås</div>
        <div className="salon-tagline">Professional braiding · Borås</div>
      </header>
      <div className="booking-notice" style={{ marginBottom: "0.75rem" }}>
        <p>
          Step {step + 1} of {totalSteps}: <strong>{STEPS[step]}</strong>
        </p>
        {canRestart ? (
          <button
            className="btn-inline"
            style={{ background: "none", border: "none", padding: 0, marginTop: "0.25rem" }}
            onClick={() => {
              setBooking({ service: null, size: null, date: "", slot: null });
              setStep(0);
            }}
          >
            Start over
          </button>
        ) : null}
      </div>

      <div className="progress-bar">
        {STEPS.map((_, i) => <div key={i} className={`progress-seg ${i <= step ? "active" : ""}`} />)}
      </div>
      <div className="progress-labels">
        {STEPS.map((label, i) => (
          <div key={label} className={`progress-lbl ${i === step ? "active" : ""}`}>{label}</div>
        ))}
      </div>
      <div className="card">
        {(booking.service || booking.size || booking.date || booking.slot) && (
          <div className="booking-summary" style={{ marginBottom: "1rem" }}>
            {booking.service && (
              <div className="summary-row">
                <span>Service</span>
                <strong>{booking.service.title}</strong>
              </div>
            )}
            {booking.size && (
              <div className="summary-row">
                <span>Size</span>
                <strong>{booking.size.label}</strong>
              </div>
            )}
            {formattedSelectedDate && (
              <div className="summary-row">
                <span>Date</span>
                <strong>{formattedSelectedDate}</strong>
              </div>
            )}
            {booking.slot?.label && (
              <div className="summary-row">
                <span>Time</span>
                <strong>{booking.slot.label}</strong>
              </div>
            )}
          </div>
        )}
        {step > 0 && (
          <button className="back-btn" onClick={() => setStep((s) => s - 1)}>← Back</button>
        )}
        {step === 0 ? (
          <ServiceSelector onSelect={(service) => { update({ service, size: null }); setStep(1); }} />
        ) : step === 1 ? (
          <SizeSelector
            service={booking.service!}
            onSelect={(size) => { update({ size }); setStep(2); }}
            onSkip={() => setStep(2)}
          />
        ) : step === 2 ? (
          <DatePicker onSelect={(date) => { update({ date }); setStep(3); }} />
        ) : step === 3 ? (
          <TimeSlotPicker date={booking.date} onSelect={(slot) => { update({ slot }); setStep(4); }} />
        ) : (
          <CustomerForm booking={booking} onSuccess={() => {}} />
        )}
      </div>
    </div>
  );
}