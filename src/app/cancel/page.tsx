"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import "@/styles/globals.css";

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

  const STATES = {
    expired: {
      icon: "⚠️",
      title: "Invalid link",
      body: <p className="step-subtitle">This cancellation link is invalid or has expired. Please contact us directly.</p>,
    },
    idle: {
      icon: "📅",
      title: "Cancel your booking",
      body: (
        <>
          <p className="step-subtitle">Are you sure you want to cancel your appointment at BraidsInBorås?</p>
          <div className="booking-notice">
            <p>💰 <strong>Refund policy:</strong> Cancellations more than 48 hours before your appointment receive a full deposit refund. Cancellations within 48 hours are non-refundable.</p>
          </div>
          <button className="btn btn-danger" onClick={handleCancel}>Yes, cancel my booking</button>
          <button className="btn btn-primary" onClick={() => window.history.back()}>Keep my booking</button>
        </>
      ),
    },
    loading: {
      icon: "⏳",
      title: "Cancelling...",
      body: <p className="step-subtitle">Please wait while we process your cancellation.</p>,
    },
    success: {
      icon: "✅",
      title: "Booking cancelled",
      body: (
        <>
          <p className="alert alert-success">{message}</p>
          <p className="step-subtitle">Thank you for letting us know. We hope to see you again soon.</p>
        </>
      ),
    },
    error: {
      icon: "❌",
      title: "Something went wrong",
      body: (
        <>
          <p className="alert alert-error">{message}</p>
          <p className="step-subtitle">Please contact us at <strong>ebiojoidris@gmail.com</strong></p>
        </>
      ),
    },
  };

  const current = STATES[status];

  return (
    <div className="page-shell">
      <div className="card" style={{ maxWidth: "480px", textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{current.icon}</div>
        <h2 className="step-title">{current.title}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
          {current.body}
        </div>
      </div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense>
      <CancelContent />
    </Suspense>
  );
}