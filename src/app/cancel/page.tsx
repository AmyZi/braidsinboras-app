"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CancelContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "expired">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) setStatus("expired");
  }, [token]);

  const handleCancel = async () => {
    if (!token) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage(data.refunded
          ? `Your booking has been cancelled and your deposit of ${data.refundAmount} SEK has been refunded.`
          : "Your booking has been cancelled. As it was within 48 hours, the deposit is non-refundable."
        );
      } else {
        setStatus("error");
        setMessage(data.error || "Could not cancel booking.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again or contact us.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        :root { --bg:#0e0c0a; --surface:#1a1714; --surface2:#221f1b; --border:#2e2a25; --gold:#c9a96e; --gold-light:#e8cc9a; --text:#f0ece6; --text-muted:#8a8070; --radius:12px; --radius-sm:8px; }
        .cancel-shell { min-height:100vh; background:var(--bg); font-family:'DM Sans',sans-serif; color:var(--text); display:flex; align-items:center; justify-content:center; padding:2rem; }
        .cancel-card { width:100%; max-width:480px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:2.5rem; display:flex; flex-direction:column; gap:1.5rem; text-align:center; }
        .cancel-icon { font-size:2.5rem; }
        .cancel-title { font-family:'Cormorant Garamond',serif; font-size:1.75rem; font-weight:600; }
        .cancel-subtitle { font-size:0.875rem; color:var(--text-muted); line-height:1.6; }
        .warning-box { background:rgba(201,169,110,0.08); border:1px solid rgba(201,169,110,0.2); border-radius:var(--radius-sm); padding:1rem 1.25rem; font-size:0.85rem; color:var(--text-muted); line-height:1.6; text-align:left; }
        .cancel-btn { background:#c0392b; color:#fff; border:none; border-radius:var(--radius-sm); padding:0.9rem; font-family:'DM Sans',sans-serif; font-size:0.95rem; font-weight:500; cursor:pointer; transition:background 0.2s; }
        .cancel-btn:hover:not(:disabled) { background:#e74c3c; }
        .cancel-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .keep-btn { background:var(--gold); color:var(--bg); border:none; border-radius:var(--radius-sm); padding:0.9rem; font-family:'DM Sans',sans-serif; font-size:0.95rem; font-weight:500; cursor:pointer; transition:background 0.2s; }
        .keep-btn:hover { background:var(--gold-light); }
        .success-msg { color:#5a9e78; font-size:0.9rem; line-height:1.6; }
        .error-msg { color:#e08080; font-size:0.9rem; }
      `}</style>
      <div className="cancel-shell">
        <div className="cancel-card">
          {status === "expired" && (
            <>
              <div className="cancel-icon">⚠️</div>
              <h2 className="cancel-title">Invalid link</h2>
              <p className="cancel-subtitle">This cancellation link is invalid or has expired. Please contact us directly.</p>
            </>
          )}

          {status === "idle" && (
            <>
              <div className="cancel-icon">📅</div>
              <h2 className="cancel-title">Cancel your booking</h2>
              <p className="cancel-subtitle">Are you sure you want to cancel your appointment at BraidsInBorås?</p>
              <div className="warning-box">
                💰 <strong>Refund policy:</strong> Cancellations made more than 48 hours before your appointment will receive a full deposit refund. Cancellations within 48 hours are non-refundable.
              </div>
              <button className="cancel-btn" onClick={handleCancel}>
                Yes, cancel my booking
              </button>
              <button className="keep-btn" onClick={() => window.history.back()}>
                Keep my booking
              </button>
            </>
          )}

          {status === "loading" && (
            <>
              <div className="cancel-icon">⏳</div>
              <h2 className="cancel-title">Cancelling...</h2>
              <p className="cancel-subtitle">Please wait while we process your cancellation.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="cancel-icon">✅</div>
              <h2 className="cancel-title">Booking cancelled</h2>
              <p className="success-msg">{message}</p>
              <p className="cancel-subtitle">Thank you for letting us know. We hope to see you again soon.</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="cancel-icon">❌</div>
              <h2 className="cancel-title">Something went wrong</h2>
              <p className="error-msg">{message}</p>
              <p className="cancel-subtitle">Please contact us at <strong>info@braidsinboras.se</strong></p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function CancelPage() {
  return (
    <Suspense>
      <CancelContent />
    </Suspense>
  );
}