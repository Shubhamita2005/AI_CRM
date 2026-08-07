import { useState, useEffect } from "react";
import { pipelineAPI } from "../../services/api";

export default function Pipeline({
  title = "Sales Pipeline",
  onViewStage,
  onViewCompany,
}) {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Define fixed stage order
  const stageOrder = [
    "Lead",
    "Trial",
    "Demo Booked",
    "Negotiation",
    "Closed Won",
  ];

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await pipelineAPI.getStages();

      // ✅ Convert backend data into ordered structure
      const orderedStages = stageOrder.map((stageName) => {
        const foundStage = data.find(
          (stage) => stage.name === stageName
        );

        return {
          name: stageName,
          deals: foundStage ? foundStage.deals : [],
        };
      });

      setStages(orderedStages);
    } catch (err) {
      console.error("Failed to load pipeline stages:", err);
      setError("Failed to load pipeline data");
      setStages([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="pipeline">
        <h2>{title}</h2>
        <p style={{ textAlign: "center", padding: "40px" }}>
          Loading pipeline...
        </p>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="pipeline">
        <h2>{title}</h2>
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="pipeline">
      <h2>{title}</h2>

      <div className="pipeline-grid">
        {stages.map((stage) => (
          <div className="stage" key={stage.name}>
            <h3>{stage.name}</h3>

            {/* ✅ Show first 2 deals */}
            {stage.deals.slice(0, 2).map((deal, index) => (
              <div
                key={index}
                className="deal"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  onViewCompany && onViewCompany(deal.company)
                }
              >
                <h4>{deal.company}</h4>
                <p>{deal.note}</p>
              </div>
            ))}

            {/* ✅ View All */}
            {stage.deals.length > 2 && (
              <button
                className="more-btn"
                onClick={() =>
                  onViewStage && onViewStage(stage.name)
                }
              >
                View All
              </button>
            )}

            {/* ✅ Empty stage */}
            {stage.deals.length === 0 && (
              <p style={{ color: "var(--gray)", fontSize: "14px" }}>
                No deals in this stage
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}