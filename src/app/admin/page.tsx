"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async () => {
    if (!username || !password) { setError("All fields required."); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) router.push("/admin/dashboard");
      else setError(data.error || "Invalid credentials.");
    } catch { setError("Network error."); }
    setLoading(false);
  };

  return (
    <div className="page-shell centered">
      <div className="card" style={{ maxWidth: "400px" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <div className="salon-name" style={{ fontSize: "1.75rem" }}>BraidsInBorås</div>
          <div className="salon-tagline">Admin Portal</div>
        </div>
        <div className="form-fields">
          <div className="field">
            <label>WordPress Username</label>
            <input
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <button className="btn btn-primary" onClick={login} disabled={loading}>
            {loading ? "Signing in..." : "Sign in →"}
          </button>
        </div>
      </div>
    </div>
  );
}