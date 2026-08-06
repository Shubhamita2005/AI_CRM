import { useState, useEffect } from "react";
import { companiesAPI } from "../services/api";

export default function CompanyDetail({
  companyId,
  onBack,
  onGenerateEmail,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (companyId) {
      fetchCompanyDetails();
    }
  }, [companyId]);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await companiesAPI.getCompanyDetails(companyId);
      console.log("Company details:", response);

      setData(response);
    } catch (err) {
      console.error("Failed to load company details:", err);
      setError("Failed to load company details");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="page active">
        <div className="companies">
          <div className="companies-header">
            <h2>Loading...</h2>
            <button className="ai-btn" onClick={onBack}>
              ← Back
            </button>
          </div>
          <p style={{ textAlign: "center", padding: "40px", color: "var(--gray)" }}>
            Loading company details...
          </p>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error || !data || !data.customer) {
    return (
      <div className="page active">
        <div className="companies">
          <div className="companies-header">
            <h2>Company Not Found</h2>
            <button className="ai-btn" onClick={onBack}>
              ← Back
            </button>
          </div>

          <p style={{ padding: "40px", color: "var(--gray)" }}>
            {error || "No company data available."}
          </p>

          <button
            className="ai-btn"
            onClick={fetchCompanyDetails}
            style={{ marginLeft: "40px" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ================= DATA ================= */

  const { customer, activities, followupHistory, recommendation } = data;

  return (
    <div className="page active">
      <div className="companies">
        <div className="companies-header">
          <h2>{customer.company_name}</h2>
          <button className="ai-btn" onClick={onBack}>
            ← Back
          </button>
        </div>

        <p style={{ color: "var(--gray)", marginBottom: "20px" }}>
          {customer.industry} • {customer.country} • {customer.company_size} Employees
        </p>

        {/* ================= CONTACT INFO ================= */}
        <div className="drawer-card">
          <h3>👤 Contact Information</h3>
          <p style={{ marginTop: "10px" }}>
            <strong>Name:</strong> {customer.first_name} {customer.last_name}
          </p>
          <p style={{ marginTop: "8px" }}>
            <strong>Email:</strong> {customer.email}
          </p>
        </div>

        {/* ================= TRIAL STATUS ================= */}
        <div className="drawer-card">
          <h3>🎯 Trial Status</h3>
          <p style={{ marginTop: "10px" }}>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: customer.trial_status === "Active" ? "#10b981" : "#ef4444",
                fontWeight: "600",
              }}
            >
              {customer.trial_status}
            </span>
          </p>

          <p style={{ marginTop: "8px" }}>
            <strong>Trial Period:</strong>{" "}
            {new Date(customer.trial_start_date).toLocaleDateString()} –{" "}
            {new Date(customer.trial_end_date).toLocaleDateString()}
          </p>

          <p style={{ marginTop: "8px" }}>
            <strong>Days Active:</strong> {customer.days_active}
          </p>
          
          <p style={{ marginTop: "8px" }}>
            <strong>Current Streak:</strong> {customer.current_streak}
          </p>
        </div>

        {/* ================= PRODUCT USAGE ================= */}
        <div className="drawer-card">
          <h3>📊 Product Usage</h3>

          <div style={{ marginTop: "12px" }}>
            <div className="usage-row" style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <span>Total Logins</span>
              <strong>{customer.total_logins}</strong>
            </div>

            <div className="usage-row" style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <span>Projects Created</span>
              <strong>{customer.projects_created}</strong>
            </div>

            <div className="usage-row" style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <span>Collaborators Invited</span>
              <strong>{customer.collaborators_invited}</strong>
            </div>

            <div className="usage-row" style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <span>Storage Used</span>
              <strong>{customer.storage_used_gb} GB</strong>
            </div>

            <div className="usage-row" style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
              <span>Premium Features Used</span>
              <strong>
                {customer.premium_features_used ? "Yes ✅" : "No ❌"}
              </strong>
            </div>
          </div>
        </div>

        {/* ================= RECENT ACTIVITIES ================= */}
        {activities && activities.length > 0 && (
          <div className="drawer-card">
            <h3>📝 Recent Activities</h3>

            <div style={{ marginTop: "15px" }}>
              {activities.slice(0, 5).map((activity, index) => (
                <div
                  key={index}
                  style={{
                    padding: "10px 0",
                    borderBottom: index < 4 ? "1px solid #eee" : "none",
                  }}
                >
                  <strong style={{ fontSize: "14px" }}>
                    {activity.activity_type.replace(/_/g, " ")}
                  </strong>

                  <p style={{ fontSize: "13px", color: "var(--gray)", marginTop: "4px" }}>
                    {activity.details}
                  </p>

                  <small style={{ color: "var(--gray)", fontSize: "12px" }}>
                    {new Date(activity.activity_time).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= FOLLOWUP HISTORY ================= */}
        {followupHistory && followupHistory.length > 0 && (
          <div className="drawer-card">
            <h3>📞 Follow‑up History</h3>

            <div style={{ marginTop: "15px" }}>
              {followupHistory.map((followup, index) => (
                <div key={index} style={{ marginBottom: "15px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>{followup.followup_type}</strong>
                    <span
                      style={{
                        fontSize: "12px",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        background: followup.followup_status === "COMPLETED" ? "#e8f5e9" : "#fff8e1",
                        color: followup.followup_status === "COMPLETED" ? "#2e7d32" : "#f57c00",
                      }}
                    >
                      {followup.followup_status}
                    </span>
                  </div>

                  <p style={{ fontSize: "13px", color: "var(--gray)", marginTop: "8px" }}>
                    {followup.notes}
                  </p>

                  <small style={{ fontSize: "12px", color: "var(--gray)" }}>
                    {new Date(followup.followup_date).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= AI RECOMMENDATION ================= */}
        <div className="drawer-card">
          <h3>💡 AI Recommendation</h3>

          {recommendation && typeof recommendation === "object" ? (
            <div style={{ marginTop: "12px" }}>
              <p style={{ marginBottom: "10px" }}>
                <strong>Action:</strong> {recommendation.recommended_action}
              </p>

              <p style={{ marginBottom: "10px" }}>
                <strong>Reason:</strong> {recommendation.reason}
              </p>

              <p style={{ marginBottom: "10px" }}>
                <strong>Priority:</strong>{" "}
                <span
                  style={{
                    color:
                      recommendation.priority === "High"
                        ? "#ef4444"
                        : recommendation.priority === "Medium"
                        ? "#f59e0b"
                        : "#10b981",
                    fontWeight: "600",
                  }}
                >
                  {recommendation.priority}
                </span>
              </p>

              <p style={{ marginBottom: "10px" }}>
                <strong>Confidence:</strong> {recommendation.confidence_score}%
              </p>

              <p style={{ marginBottom: "10px" }}>
                <strong>Conversion Probability:</strong>{" "}
                {recommendation.estimated_conversion_probability}%
              </p>

              <p style={{ marginBottom: "10px" }}>
                <strong>Timeframe:</strong> {recommendation.recommended_timeframe}
              </p>

              <p>
                <strong>Status:</strong> {recommendation.status}
              </p>
            </div>
          ) : (
            <p style={{ marginTop: "12px", lineHeight: "1.8" }}>
              {recommendation || "Check in quarterly and look for upsell opportunities as their team grows."}
            </p>
          )}

          <button
            className="ai-btn"
            onClick={onGenerateEmail}
            style={{ marginTop: "15px" }}
          >
            Generate Email
          </button>
        </div>
      </div>
    </div>
  );
}