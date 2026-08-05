import { useState, useEffect } from "react";
import { pipelineAPI } from "../../services/api";

console.log("Pipeline file loaded");

export default function Pipeline(props) {
  console.log("Pipeline props:", props);

  const {
    title = "Sales Pipeline",
    onViewStage,
    onViewCompany,
  } = props;

  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stages from backend on component mount
  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pipelineAPI.getStages();
      setStages(data);
      console.log("Pipeline stages loaded:", data);
    } catch (err) {
      console.error("Failed to load pipeline stages:", err);
      setError("Failed to load pipeline data");
      // Fallback to empty stages if API fails
      setStages([]);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="pipeline">
        <h2>{title}</h2>
        <p style={{ textAlign: "center", color: "var(--gray)", padding: "40px" }}>
          Loading pipeline...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pipeline">
        <h2>{title}</h2>
        <p style={{ textAlign: "center", color: "red", padding: "20px" }}>
          {error}
        </p>
        <div style={{ textAlign: "center" }}>
          <button className="ai-btn" onClick={fetchStages}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (stages.length === 0) {
    return (
      <div className="pipeline">
        <h2>{title}</h2>
        <p style={{ textAlign: "center", color: "var(--gray)", padding: "40px" }}>
          No pipeline data available
        </p>
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

            {/* Show only first 2 companies */}
            {stage.deals && stage.deals.slice(0, 2).map((deal) => (
              <div
                key={deal.company || deal._id}
                className="deal"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (onViewCompany) {
                    onViewCompany(deal.company);
                  }
                }}
              >
                <h4>{deal.company}</h4>
                <p>{deal.note}</p>
              </div>
            ))}

            {/* More button */}
            {stage.deals && stage.deals.length > 2 && (
              <button
                className="more-btn"
                onClick={() => {
                  console.log("More button clicked for stage:", stage.name);
                  console.log("onViewStage =", onViewStage);

                  if (onViewStage) {
                    console.log("Calling onViewStage with:", stage.name);
                    onViewStage(stage.name);
                  } else {
                    console.error("onViewStage is undefined!");
                  }
                }}
              >
                View All
              </button>
            )}

            {/* Show count if no deals */}
            {(!stage.deals || stage.deals.length === 0) && (
              <p style={{ color: "var(--gray)", fontSize: "14px", padding: "10px" }}>
                No deals in this stage
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}