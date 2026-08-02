export default function Insights({ onGenerateEmail }) {
  return (
    <div className="page active">
      <div className="ai-insights">
        <h2>AI Insights</h2>
        <div className="ai-grid">
          <div className="ai-box">
            <h3>InnovateX</h3>
            <div className="ai-score">92%</div>
            <p>Likely to Convert</p>
            <ul>
              <li>17 active users</li>
              <li>12 projects</li>
              <li>Premium features enabled</li>
              <li>Daily logins</li>
            </ul>
            <button className="ai-btn" onClick={onGenerateEmail}>
              Generate Email
            </button>
          </div>

          <div className="ai-box">
            <h3>HealthPlus</h3>
            <div className="ai-score">28%</div>
            <p>Needs Attention</p>
            <ul>
              <li>No login for 5 days</li>
              <li>Low collaboration</li>
              <li>No meetings scheduled</li>
            </ul>
            <button className="ai-btn">Re-engage User</button>
          </div>
        </div>
      </div>
    </div>
  );
}