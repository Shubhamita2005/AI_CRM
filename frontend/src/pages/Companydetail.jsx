import { useState, useEffect } from "react";
import { companiesAPI } from "../services/api";

export default function CompanyDetail({
  companyId,  // ✅ Changed from companyName
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
      
      // ✅ Fetch company details by ID
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
          <p style={{ textAlign: "center", color: "var(--gray)", padding: "40px" }}>
            Loading company details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page active">
        <div className="companies">
          <div className="companies-header">
            <h2>Company Not Found</h2>
            <button className="ai-btn" onClick={onBack}>
              ← Back
            </button>
          </div>

          <p style={{ color: "var(--gray)", padding: "40px" }}>
            {error || "Detailed information for this company isn't available yet."}
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

        {/* Customer Info Card */}
        <div className="drawer-card">
          <h3>👤 Contact Information</h3>
          <p style={{ marginTop: "10px" }}>
            <strong>Name:</strong> {customer.first_name} {customer.last_name}
          </p>
          <p style={{ marginTop: "8px" }}>
            <strong>Email:</strong> {customer.email}
          </p>
        </div>

        {/* Trial Status Card */}
        <div className="drawer-card">
          <h3>🎯 Trial Status</h3>
          <p style={{ marginTop: "10px" }}>
            <strong>Status:</strong>{" "}
            <span style={{ 
              color: customer.trial_status === "Active" ? "#10b981" : "#ef4444",
              fontWeight: "600"
            }}>
              {customer.trial_status}
            </span>
          </p>
          <p style={{ marginTop: "8px" }}>
            <strong>Trial Period:</strong> {new Date(customer.trial_start_date).toLocaleDateString()} - {new Date(customer.trial_end_date).toLocaleDateString()}
          </p>
          <p style={{ marginTop: "8px" }}>
            <strong>Days Active:</strong> {customer.days_active} days
          </p>
          <p style={{ marginTop: "8px" }}>
            <strong>Current Streak:</strong> {customer.current_streak} days
          </p>
        </div>

        {/* Product Usage */}
        <div className="drawer-card">
          <h3>📊 Product Usage</h3>

          <p style={{ marginTop: "12px" }}>Total Logins: <strong>{customer.total_logins}</strong></p>
          
          <p style={{ marginTop: "12px" }}>Projects Created</p>
          <div className="progress">
            <span style={{ width: `${Math.min((customer.projects_created / 20) * 100, 100)}%` }}></span>
          </div>
          <p style={{ fontSize: "12px", marginTop: "4px", color: "var(--gray)" }}>
            {customer.projects_created} projects
          </p>

          <p style={{ marginTop: "18px" }}>Collaborators Invited</p>
          <div className="progress">
            <span style={{ width: `${Math.min((customer.collaborators_invited / 30) * 100, 100)}%` }}></span>
          </div>
          <p style={{ fontSize: "12px", marginTop: "4px", color: "var(--gray)" }}>
            {customer.collaborators_invited} collaborators
          </p>

          <p style={{ marginTop: "18px" }}>Storage Used</p>
          <div className="progress">
            <span style={{ width: `${Math.min((parseFloat(customer.storage_used_gb) / 20) * 100, 100)}%` }}></span>
          </div>
          <p style={{ fontSize: "12px", marginTop: "4px", color: "var(--gray)" }}>
            {customer.storage_used_gb} GB
          </p>

          <p style={{ marginTop: "18px" }}>
            <strong>Premium Features Used:</strong>{" "}
            <span style={{ color: customer.premium_features_used ? "#10b981" : "#ef4444" }}>
              {customer.premium_features_used ? "Yes" : "No"}
            </span>
          </p>
        </div>

        {/* Recent Activities */}
        {activities && activities.length > 0 && (
          <div className="drawer-card">
            <h3>📝 Recent Activities</h3>
            <div style={{ marginTop: "15px" }}>
              {activities.slice(0, 5).map((activity, index) => (
                <div 
                  key={index} 
                  style={{ 
                    padding: "10px 0", 
                    borderBottom: index < 4 ? "1px solid #eee" : "none" 
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div>
                      <strong style={{ fontSize: "14px" }}>{activity.activity_type.replace(/_/g, " ")}</strong>
                      <p style={{ fontSize: "13px", color: "var(--gray)", marginTop: "4px" }}>
                        {activity.details}
                      </p>
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--gray)", whiteSpace: "nowrap", marginLeft: "10px" }}>
                      {new Date(activity.activity_time).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Follow-up History */}
        {followupHistory && followupHistory.length > 0 && (
          <div className="drawer-card">
            <h3>📞 Follow-up History</h3>
            <div style={{ marginTop: "15px" }}>
              {followupHistory.map((followup, index) => (
                <div key={index} style={{ marginBottom: "15px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>{followup.followup_type}</strong>
                    <span style={{ 
                      fontSize: "12px",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      background: followup.followup_status === "COMPLETED" ? "#e8f5e9" : "#fff8e1",
                      color: followup.followup_status === "COMPLETED" ? "#2e7d32" : "#f57c00"
                    }}>
                      {followup.followup_status}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--gray)", marginTop: "8px" }}>
                    {followup.notes}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--gray)", marginTop: "4px" }}>
                    {new Date(followup.followup_date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendation */}
        <div className="drawer-card">
          <h3>💡 AI Recommendation</h3>
          <p style={{ marginTop: "12px", lineHeight: "1.8" }}>
            {recommendation || "Check in quarterly and look for upsell opportunities as their team grows."}
          </p>

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