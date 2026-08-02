export default function Login({ onManagerLogin, onSalesLogin }) {
  return (
    <div className="login-page">
      <div className="login-blob blob-1"></div>
      <div className="login-blob blob-2"></div>
      <div className="login-blob blob-3"></div>

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

          <div className="role-card" onClick={onSalesLogin}>
            <div className="role-icon sales-icon">📈</div>
            <h3>Sales Representative</h3>
            <p>Manage your trials, meetings & follow-ups</p>
            <span className="role-cta">Login as Sales Rep →</span>
          </div>
        </div>
      </div>
    </div>
  );
}