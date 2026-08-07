import { useState, useEffect } from "react";
import { activitiesAPI } from "../../services/api";

export default function Followups({ title = "Follow-ups" }) {
  const [followups, setFollowups] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFollowups();
  }, []);

  const fetchFollowups = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await activitiesAPI.getFollowups();
      setFollowups(data || []);
    } catch (err) {
      console.error("Failed to load follow-ups:", err);
      setError("Failed to load follow-ups");
      setFollowups([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="followups">
        <h2>{title}</h2>
        <p className="followup-empty">Loading follow-ups...</p>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="followups">
        <h2>{title}</h2>
        <p className="followup-empty" style={{ color: "#dc2626" }}>
          {error}
        </p>
        <div style={{ textAlign: "center" }}>
          <button className="ai-btn" onClick={fetchFollowups}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="followups">
      <div className="followups-header">
        <h2>{title}</h2>
        <span className="followup-count">
          {followups.length} pending
        </span>
      </div>

      <div className="followup-list">
        {followups.length === 0 ? (
          <p className="followup-empty">No follow-ups scheduled</p>
        ) : (
          followups.map((item) => {
            const id = item.recommendation_id || item.id;
            const expanded = expandedId === id;

            return (
              <div key={id} className="followup-card">
                {/* ===== TOP SECTION ===== */}
                <div className="followup-top">
                  <div>
                    <h3>
                      {item.company_name ||
                        item.company ||
                        item.title ||
                        "Unknown Company"}
                    </h3>

                    <p className="followup-time">
                      ⏰{" "}
                      {item.recommended_timeframe ||
                        item.time ||
                        item.date ||
                        "No timeframe"}
                    </p>
                  </div>

                  <span
                    className={`followup-priority ${(
                      item.priority || "medium"
                    ).toLowerCase()}`}
                  >
                    {item.priority || "Medium"}
                  </span>
                </div>

                {/* ===== NOTE ===== */}
                <p
                  className={
                    expanded
                      ? "followup-note expanded"
                      : "followup-note"
                  }
                >
                  {item.reason ||
                    item.note ||
                    item.description ||
                    "No details available."}
                </p>

                {/* ===== FOOTER ===== */}
                <div className="followup-footer">
                  <button
                    className="followup-link"
                    onClick={() => toggleExpand(id)}
                  >
                    {expanded ? "Show less" : "Show more"}
                  </button>

                  <div className="followup-actions">
                    <button className="followup-action-btn">
                      📞 Call
                    </button>
                    <button className="followup-action-btn">
                      ✉️ Email
                    </button>
                    <button className="followup-action-btn">
                      📅 Schedule
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}