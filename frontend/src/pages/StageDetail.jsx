const stages = [
  {
    name: "Lead",
    deals: [
      { company: "NovaTech", note: "New Signup" },
      { company: "BrightWave", note: "New Signup" },
      { company: "Skyline Retail", note: "Free Trial Started" },
    ],
  },
  {
    name: "Trial",
    deals: [
      { company: "HealthPlus", note: "Day 5" },
      { company: "RetailMax", note: "Day 8" },
      { company: "Zenith Corp", note: "Day 2" },
    ],
  },
  {
    name: "Follow-up",
    deals: [
      { company: "FinEdge", note: "Email Scheduled" },
      { company: "Orbit Labs", note: "Call Scheduled" },
    ],
  },
  {
    name: "Meeting",
    deals: [
      { company: "InnovateX", note: "Tomorrow 11:00 AM" },
    ],
  },
  {
    name: "Converted",
    deals: [
      { company: "EduVerse", note: "Growth Plan" },
      { company: "Nimbus Health", note: "Growth Plan" },
    ],
  },
];

export default function StageDetail({ stage, onBack, onViewCompany }) {
  const stageData = stages.find((s) => s.name === stage);

  if (!stageData) {
    return (
      <div className="page active">
        <div className="companies">
          <p>Stage not found.</p>
          <button className="ai-btn" onClick={onBack}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page active">
      <div className="companies">
        <div className="companies-header">
          <h2>{stageData.name} — All Companies</h2>
          <button className="ai-btn" onClick={onBack}>
            ← Back to Dashboard
          </button>
        </div>

        <div
          className="pipeline-grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {stageData.deals.map((deal) => (
            <div
              key={deal.company}
              className="deal"
              style={{ cursor: "pointer" }}
              onClick={() => onViewCompany(deal.company)}
            >
              <h4>{deal.company}</h4>
              <p>{deal.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}