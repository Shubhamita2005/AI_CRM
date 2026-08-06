import { useState, useEffect } from "react";
import { companiesAPI } from "../services/api";

export default function CompanyDetail({
  companyName,
  onBack,
  onGenerateEmail,
}) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (companyName) {
      fetchCompanyDetails();
    }
  }, [companyName]);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ Fetch company by name from backend
      const data = await companiesAPI.getByName(companyName);
      setCompany(data);
    } catch (err) {
      console.error("Failed to load company details:", err);
      setError("Failed to load company details");
      setCompany(null);
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

  if (error || !company) {
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

  return (
    <div className="page active">
      <div className="companies">
        <div className="companies-header">
          <h2>{company.name}</h2>
          <button className="ai-btn" onClick={onBack}>
            ← Back
          </button>
        </div>

        <p style={{ color: "var(--gray)", marginBottom: "20px" }}>
          {company.industry} • {company.location} • {company.size} Employees
        </p>

        <div className="drawer-card">
          <h3>AI Conversion Score</h3>
          <h1 style={{ color: "#403D88", marginTop: "10px" }}>
            {company.score}%
          </h1>
          <p style={{ marginTop: "10px" }}>
            {company.conversionSummary || "No summary available"}
          </p>
        </div>

        {company.usage && (
          <div className="drawer-card">
            <h3>Product Usage</h3>

            <p style={{ marginTop: "12px" }}>Projects Created</p>
            <div className="progress">
              <span
                style={{ width: `${company.usage.projects || 0}%` }}
              ></span>
            </div>

            <p style={{ marginTop: "18px" }}>Collaborators</p>
            <div className="progress">
              <span
                style={{ width: `${company.usage.collaborators || 0}%` }}
              ></span>
            </div>

            <p style={{ marginTop: "18px" }}>Storage Used</p>
            <div className="progress">
              <span
                style={{ width: `${company.usage.storage || 0}%` }}
              ></span>
            </div>
          </div>
        )}

        <div className="drawer-card">
          <h3>AI Recommendation</h3>
          <p style={{ marginTop: "12px", lineHeight: "1.8" }}>
            {company.recommendation || "No recommendations available at this time."}
          </p>

          <button
            className="ai-btn"
            onClick={onGenerateEmail}
          >
            Generate Email
          </button>
        </div>
      </div>
    </div>
  );
}