import { useState } from "react";

const companiesData = [
  {
    id: 1,
    name: "InnovateX",
    industry: "IT",
    size: "11-50",
    trial: "Day 12",
    score: 92,
    scoreClass: "high",
    status: "Active",
    statusClass: "active",
  },
  {
    id: 2,
    name: "HealthPlus",
    industry: "Healthcare",
    size: "51-200",
    trial: "Day 4",
    score: 28,
    scoreClass: "low",
    status: "Active",
    statusClass: "active",
  },
  {
    id: 3,
    name: "RetailMax",
    industry: "Retail",
    size: "201-500",
    trial: "Expired",
    score: 64,
    scoreClass: "medium",
    status: "Expired",
    statusClass: "expired",
  },
  {
    id: 4,
    name: "EduVerse",
    industry: "Education",
    size: "11-50",
    trial: "Converted",
    score: 97,
    scoreClass: "high",
    status: "Paid",
    statusClass: "converted",
  },
];

export default function CompaniesTable({ onView, onAddCompany }) {
  const searchValueState = useSearch();

  return (
    <div className="companies">
      <div className="companies-header">
        <h2>🏢 Companies</h2>
        <div className="company-actions">
          <input
            type="text"
            placeholder="Search company"
            value={searchValueState.value}
            onChange={(e) => searchValueState.setValue(e.target.value)}
          />
          <button onClick={onAddCompany}>Add Company</button>
        </div>
      </div>
      <table className="company-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Industry</th>
            <th>Size</th>
            <th>Trial</th>
            <th>AI Score</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {searchValueState.filtered.map((c) => (
            <tr key={c.id}>
              <td className="company-name">{c.name}</td>
              <td>{c.industry}</td>
              <td>{c.size}</td>
              <td>{c.trial}</td>
              <td className={`score ${c.scoreClass}`}>{c.score}%</td>
              <td>
                <span className={`status ${c.statusClass}`}>{c.status}</span>
              </td>
              <td>
                <button className="view-btn" onClick={() => onView(c.name)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Small local hook so this component owns its own search state
// instead of needing it passed down as props.
function useSearch() {
  const [value, setValue] = useState("");
  const filtered = companiesData.filter((c) =>
    Object.values(c).join(" ").toLowerCase().includes(value.toLowerCase())
  );
  return { value, setValue, filtered };
}