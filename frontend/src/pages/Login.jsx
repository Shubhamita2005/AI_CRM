import { useState } from "react";

export default function Login({ onManagerLogin, onSalesLogin }) {
  const [selectedRepId, setSelectedRepId] = useState("");

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">FlowCRM AI</div>
        <div className="login-tagline">Convert Smarter. Grow Faster.</div>

        <h1>Welcome back 👋</h1>
        <p>Choose how you'd like to log in</p>

        <div className="role-grid">
          <div className="role-card" onClick={onManagerLogin}>
            <div className="role-icon manager-icon">🧑‍💼</div>
            <h3>Manager</h3>
            <p>Full access to pipeline, reports & AI insights</p>
            <span className="role-cta">Login as Manager →</span>
          </div>

          <div className="role-card">
            <div className="role-icon sales-icon">📈</div>
            <h3>Sales Representative</h3>
            <p>Manage your trials, meetings & follow-ups</p>

            {/* ✅ Dynamic ID input */}
            <input
              type="number"
              placeholder="Enter Sales Rep ID"
              value={selectedRepId}
              onChange={(e) => setSelectedRepId(e.target.value)}
              style={{ marginTop: "10px", padding: "8px", width: "100%" }}
            />

            <button
              style={{ marginTop: "10px" }}
              onClick={() => {
                if (!selectedRepId) {
                  alert("Please enter Sales Rep ID");
                  return;
                }
                onSalesLogin(Number(selectedRepId));
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