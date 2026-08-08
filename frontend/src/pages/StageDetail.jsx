export default function StageDetail({ stage, onBack, onViewCompany }) {
  const deals = stage?.deals || [];

  return (
    <div className="page active">
      <div className="companies">
        <div className="companies-header">
          <h2>{stage?.name} — All Companies</h2>

          <button className="ai-btn" onClick={onBack}>
            ← Back to Dashboard
          </button>
        </div>

        {deals.length === 0 ? (
          <p style={{ color: "var(--gray)", padding: "20px" }}>
            No companies in this stage.
          </p>
        ) : (
          <div
            className="pipeline-grid"
            style={{
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            {deals.map((deal, index) => (
              <div
                key={index}
                className="deal"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (!deal.customer_id) {
                    console.error("customer_id missing in deal:", deal);
                    return;
                  }

                  onViewCompany(deal.customer_id);
                }}
              >
                {/* ✅ Use deal.company because that's what backend sends */}
                <h4>{deal.company}</h4>
                <p>{deal.note || "No details"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}