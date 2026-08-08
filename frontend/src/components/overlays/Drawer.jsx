import { useState, useEffect } from "react";
import { companiesAPI } from "../../services/api";

export default function Drawer({
  open,
  onClose,
  companyId,
  onGenerateEmail,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && companyId) {
      fetchCompany();
    }
  }, [open, companyId]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const response = await companiesAPI.getCompanyDetails(companyId);
      setData(response);
    } catch (err) {
      console.error("Failed to load drawer data:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  if (loading) {
    return (
      <div className="drawer open">
        <span className="close" onClick={onClose}>✖</span>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!data || !data.customer) {
    return (
      <div className="drawer open">
        <span className="close" onClick={onClose}>✖</span>
        <h2>No Data</h2>
        <p>Company details unavailable.</p>
      </div>
    );
  }

  const { customer, recommendation } = data;

  return (
    <div className="drawer open">
      <span className="close" onClick={onClose}>
        ✖
      </span>

      <h2>{customer.company_name}</h2>
      <p>
        {customer.industry} • {customer.country} • {customer.company_size} Employees
      </p>

      {/* ✅ AI Conversion Score (example logic) */}
      <div className="drawer-card">
        <h3>AI Conversion Score</h3>
        <h1 style={{ color: "#403D88", marginTop: "10px" }}>
          {recommendation?.confidence_score || 75}%
        </h1>
        <p style={{ marginTop: "10px" }}>
          {recommendation?.reason || "Based on engagement metrics and usage trends."}
        </p>
      </div>

      {/* ✅ Product Usage */}
      <div className="drawer-card">
        <h3>Product Usage</h3>

        <p style={{ marginTop: "12px" }}>Projects Created</p>
        <div className="progress">
          <span
            style={{
              width: `${Math.min(
                (customer.projects_created / 20) * 100,
                100
              )}%`,
            }}
          ></span>
        </div>

        <p style={{ marginTop: "18px" }}>Collaborators</p>
        <div className="progress">
          <span
            style={{
              width: `${Math.min(
                (customer.collaborators_invited / 30) * 100,
                100
              )}%`,
            }}
          ></span>
        </div>

        <p style={{ marginTop: "18px" }}>Storage Used</p>
        <div className="progress">
          <span
            style={{
              width: `${Math.min(
                (parseFloat(customer.storage_used_gb) / 20) * 100,
                100
              )}%`,
            }}
          ></span>
        </div>
      </div>

      {/* ✅ AI Recommendation */}
      <div className="drawer-card">
        <h3>AI Recommendation</h3>

        {recommendation && typeof recommendation === "object" ? (
          <>
            <p style={{ marginTop: "12px" }}>
              <strong>Action:</strong> {recommendation.recommended_action}
            </p>
            <p>
              <strong>Priority:</strong> {recommendation.priority}
            </p>
            <p>
              <strong>Timeframe:</strong> {recommendation.recommended_timeframe}
            </p>
          </>
        ) : (
          <p style={{ marginTop: "12px", lineHeight: "1.8" }}>
            {recommendation ||
              "Contact this company within the next 24 hours."}
          </p>
        )}

        <button className="ai-btn" onClick={onGenerateEmail}>
          Generate Email
        </button>
      </div>
    </div>
  );
}