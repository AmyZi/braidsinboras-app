"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  useSearchParams(); // session_id available if needed for display

  return (
    <div className="page-shell centered">
      <div className="card" style={{ maxWidth: "480px" }}>
        <div className="step-content confirmation">
          <div className="confirm-icon">✦</div>
          <h1 className="step-title">Payment confirmed!</h1>
          <p className="step-subtitle">
            Your deposit has been received and your booking is confirmed.
            A confirmation email with your cancellation link is on its way.
          </p>
          <div className="booking-summary" style={{ width: "100%", textAlign: "left" }}>
            <div className="summary-row"><span>📧 Email</span><strong>Confirmation sent</strong></div>
            <div className="summary-row"><span>📍 Location</span><strong>Included in email</strong></div>
            <div className="summary-row"><span>✂️ End time</span><strong>Confirmed by stylist</strong></div>
            <div className="summary-row"><span>💰 Balance</span><strong>Paid at salon</strong></div>
          </div>
          <a href="/booking" className="btn btn-primary">Make another booking</a>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return <Suspense><SuccessContent /></Suspense>;
}