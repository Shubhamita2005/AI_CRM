export default function Drawer({ open, onClose, company, onGenerateEmail }) {
  return (
    <div className={open ? "drawer open" : "drawer"}>
      <span className="close" onClick={onClose}>
        ✖
      </span>
      <h2>{company}</h2>
      <p>Healthcare • India • 11-50 Employees</p>

      <div className="drawer-card">
        <h3>AI Conversion Score</h3>
        <h1 style={{ color: "#403D88", marginTop: "10px" }}>92%</h1>
        <p style={{ marginTop: "10px" }}>High engagement and premium feature usage.</p>
      </div>

      <div className="drawer-card">
        <h3>Product Usage</h3>
        <p style={{ marginTop: "12px" }}>Projects Created</p>
        <div className="progress">
          <span style={{ width: "85%" }}></span>
        </div>
        <p style={{ marginTop: "18px" }}>Collaborators</p>
        <div className="progress">
          <span style={{ width: "72%" }}></span>
        </div>
        <p style={{ marginTop: "18px" }}>Storage Used</p>
        <div className="progress">
          <span style={{ width: "58%" }}></span>
        </div>
      </div>

      <div className="drawer-card">
        <h3>AI Recommendation</h3>
        <p style={{ marginTop: "12px", lineHeight: "1.8" }}>
          Contact this company within the next 24 hours. Generate a personalized pricing
          email and schedule an enterprise consultation.
        </p>
        <button className="ai-btn" onClick={onGenerateEmail}>
          Generate Email
        </button>
      </div>
    </div>
  );
}