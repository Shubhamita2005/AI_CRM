import { useState, useEffect } from "react";
import { companiesAPI } from "../../services/api";

export default function CompaniesTable({
  onView,
  onAddCompany,
  title = "🏢 Companies",
  searchPlaceholder = "Search companies",
  addLabel = "Add Company",
  salesRepId = null,
}) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    fetchCompanies();
  }, [salesRepId]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Use separate functions based on whether salesRepId exists
      const data = salesRepId
        ? await companiesAPI.getBySalesRep(salesRepId)  // ✅ Sales Rep view
        : await companiesAPI.getAll();                   // ✅ Manager view

      console.log("✅ Companies received from backend:", data.length);

      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load companies");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Only search filter on frontend
  const filteredCompanies = companies.filter(
    (company) =>
      (company.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.industry || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleCompanies = filteredCompanies.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCompanies.length;
  const canShowLess = visibleCount > 5;

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
          <button
            className="ai-btn"
            onClick={fetchCompanies}
            style={{ marginTop: "10px" }}
          >
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
              border: "1px solid #e5e7eb",
              fontSize: "14px",
              outline: "none",
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
            <th>Stage</th>
            <th>AI Score</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {visibleCompanies.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                style={{
                  textAlign: "center",
                  color: "var(--gray)",
                  padding: "30px",
                }}
              >
                {searchTerm
                  ? "No matching companies found"
                  : salesRepId
                  ? "No companies assigned to you"
                  : "No companies found"}
              </td>
            </tr>
          ) : (
            visibleCompanies.map((company) => (
              <tr key={company.id}>
                <td>
                  <strong>{company.name}</strong>
                </td>
                <td>{company.industry || "N/A"}</td>
                <td>{company.size || "N/A"}</td>
                <td>{company.location || "N/A"}</td>
                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background:
                        company.stage === "Closed Won" ||
                        company.stage === "Subscribed"
                          ? "#dcfce7"
                          : company.stage === "Negotiation"
                          ? "#fef3c7"
                          : company.stage === "Demo Booked"
                          ? "#ede9fe"
                          : company.stage === "Trial"
                          ? "#dbeafe"
                          : "#f3f4f6",
                      color:
                        company.stage === "Closed Won" ||
                        company.stage === "Subscribed"
                          ? "#166534"
                          : company.stage === "Negotiation"
                          ? "#92400e"
                          : company.stage === "Demo Booked"
                          ? "#5b21b6"
                          : company.stage === "Trial"
                          ? "#1e40af"
                          : "#374151",
                    }}
                  >
                    {company.stage || "Lead"}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor:
                        company.score >= 70
                          ? "#e8f5e9"
                          : company.score >= 40
                          ? "#fff8e1"
                          : "#ffebee",
                      color:
                        company.score >= 70
                          ? "#2e7d32"
                          : company.score >= 40
                          ? "#f57c00"
                          : "#c62828",
                      fontWeight: "600",
                    }}
                  >
                    {company.score}%
                  </span>
                </td>
                <td>
                  <button
                    className="ai-btn"
                    onClick={() => onView(company.id)}
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

      {/* Show More / Show Less */}
      {(hasMore || canShowLess) && (
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          {hasMore && (
            <button
              className="ai-btn"
              onClick={() => setVisibleCount((prev) => prev + 5)}
            >
              Show More ({filteredCompanies.length - visibleCount} remaining)
            </button>
          )}
          {canShowLess && (
            <button
              className="ai-btn"
              onClick={() => setVisibleCount(5)}
              style={{ background: "#6b7280" }}
            >
              Show Less
            </button>
          )}
        </div>
      )}

      {filteredCompanies.length > 0 && (
        <p
          style={{ marginTop: "16px", color: "var(--gray)", fontSize: "14px" }}
        >
          Showing {Math.min(visibleCount, filteredCompanies.length)} of{" "}
          {filteredCompanies.length} companies
        </p>
      )}
    </div>
  );
}