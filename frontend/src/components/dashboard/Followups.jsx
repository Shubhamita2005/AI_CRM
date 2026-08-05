import { useState, useEffect } from "react";
import { activitiesAPI } from "../../services/api";

export default function Followups({ title = "Follow-ups" }) {
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFollowups();
  }, []);

  const fetchFollowups = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await activitiesAPI.getRecent(5); // Get recent 5 follow-ups
      setFollowups(data);
    } catch (err) {
      console.error("Failed to load follow-ups:", err);
      setError("Failed to load follow-ups");
      setFollowups([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="followups">
        <h2>{title}</h2>
        <p style={{ textAlign: "center", color: "var(--gray)", padding: "20px" }}>
          Loading follow-ups...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="followups">
        <h2>{title}</h2>
        <p style={{ textAlign: "center", color: "red", padding: "20px" }}>
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
      <h2>{title}</h2>

      <div className="followup-list">
        {followups.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--gray)", padding: "20px" }}>
            No follow-ups scheduled
          </p>
        ) : (
          followups.map((item) => (
            <div key={item._id || item.id} className="followup-item">
              <div className="followup-header">
                <h4>{item.company || item.title}</h4>
                <span className="followup-time">{item.time || item.date}</span>
              </div>
              <p>{item.note || item.description}</p>
              <span className={`followup-badge ${item.priority || 'medium'}`}>
                {item.type || item.priority || 'Follow-up'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}