import { useState, useEffect } from "react";
import { companiesAPI } from "../../services/api";

export default function CompaniesTable({ 
  onView, 
  onAddCompany, 
  title = "🏢 Companies", 
  searchPlaceholder = "Search companies",
  addLabel = "Add Company"
}) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await companiesAPI.getAll();
      setCompanies(data);
      setError(null);
    } catch (err) {
      setError("Failed to load companies");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleCompanies = filteredCompanies.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCompanies.length;
  const canShowLess = visibleCount > 5;

  const loadMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  const showLess = () => {
    setVisibleCount(5);
  };

  if (loading) {
    return (
      <div className="companies">
        <div className="companies-header">
          <h2>{title}</h2>
        </div>
        <p style={{ textAlign: "center", color: "var(--gray)", padding: "40px" }}>
          Loading companies...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="companies">
        <div className="companies-header">
          <h2>{title}</h2>
        </div>
        <p style={{ textAlign: "center", color: "red", padding: "40px" }}>
          {error}
          <br />
          <button className="ai-btn" onClick={fetchCompanies} style={{ marginTop: "10px" }}>
            Retry
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="companies">
      <div className="companies-header">
        <h2>{title}</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--card-bg)",
              color: "var(--text)",
            }}
          />
          <button className="ai-btn" onClick={onAddCompany}>
            + {addLabel}
          </button>
        </div>
      </div>

      <table className="company-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Industry</th>
            <th>Size</th>
            <th>Location</th>
            <th>AI Score</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {visibleCompanies.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", color: "var(--gray)" }}>
                No companies found
              </td>
            </tr>
          ) : (
            visibleCompanies.map((company) => (
              <tr key={company._id || company.id}>
                <td><strong>{company.name}</strong></td>
                <td>{company.industry}</td>
                <td>{company.size}</td>
                <td>{company.location}</td>
                <td>
                  <span 
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: company.score >= 70 ? "#e8f5e9" : company.score >= 40 ? "#fff8e1" : "#ffebee",
                      color: company.score >= 70 ? "#2e7d32" : company.score >= 40 ? "#f57c00" : "#c62828",
                      fontWeight: "600"
                    }}
                  >
                    {company.score}%
                  </span>
                </td>
                <td>
                  <button 
                    className="ai-btn" 
                    onClick={() => onView(company.name)}
                    style={{ padding: "6px 12px", fontSize: "14px" }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ✅ Show More / Show Less Buttons - Left Aligned */}
      {(hasMore || canShowLess) && (
        <div style={{ marginTop: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
          {hasMore && (
            <button className="ai-btn" onClick={loadMore}>
              Show More ({filteredCompanies.length - visibleCount} remaining)
            </button>
          )}
          
          {canShowLess && (
            <button 
              className="ai-btn" 
              onClick={showLess}
              style={{ 
                background: "var(--gray)", 
                color: "white" 
              }}
            >
              Show Less
            </button>
          )}
        </div>
      )}

      {!hasMore && !canShowLess && filteredCompanies.length > 5 && (
        <p style={{ marginTop: "20px", color: "var(--gray)" }}>
          Showing all {filteredCompanies.length} companies
        </p>
      )}
    </div>
  );
}