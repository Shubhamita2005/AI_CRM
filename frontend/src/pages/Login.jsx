import { useState } from "react";

export default function Login({ onManagerLogin, onSalesLogin }) {
  const [salesRepId, setSalesRepId] = useState("");

  return (
    <div className="login-page">
      <div className="login-blob blob-1"></div>
      <div className="login-blob blob-2"></div>
      <div className="login-blob blob-3"></div>

      <div className="login-card">
        <div className="login-logo">FlowCRM AI</div>
        <div className="login-tagline">Convert Smarter. Grow Faster.</div>

        <h1>Welcome back 👋</h1>
        <p>Login to your dashboard</p>

        <div className="role-grid">

          {/* ✅ MANAGER LOGIN (No ID Needed) */}
          <div className="role-card">
            <div className="role-icon">🧑‍💼</div>
            <h3>Manager</h3>
            <p>Full access to pipeline, reports & AI insights</p>

            <button
              onClick={onManagerLogin}
            >
              Login as Manager →
            </button>
          </div>

          {/* ✅ SALES REP LOGIN */}
          <div className="role-card">
            <div className="role-icon">📈</div>
            <h3>Sales Representative</h3>
            <p>Manage your trials, meetings & follow-ups</p>

            <input
              type="number"
              placeholder="Enter Sales Rep ID"
              value={salesRepId}
              onChange={(e) => setSalesRepId(e.target.value)}
            />

            <button
              onClick={() => {
                if (!salesRepId) {
                  alert("Please enter Sales Rep ID");
                  return;
                }
                onSalesLogin(Number(salesRepId));
              }}
            >
              Login as Sales Rep →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}