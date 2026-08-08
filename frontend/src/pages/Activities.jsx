import { useState, useEffect } from "react";
import { activitiesAPI } from "../services/api";

export default function Activities({ title = "📝 Recent Activities" }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await activitiesAPI.getActivities();
      setActivities(data || []);
    } catch (err) {
      console.error("Failed to load activities:", err);
      setError("Failed to load activities");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="page active">
        <div className="activities">
          <h2>{title}</h2>
          <p style={{ padding: "20px" }}>Loading activities...</p>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="page active">
        <div className="activities">
          <h2>{title}</h2>
          <p style={{ color: "red", padding: "20px" }}>{error}</p>
          <button className="ai-btn" onClick={fetchActivities}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page active">
      <div className="activities">
        <h2>{title}</h2>

        <div className="timeline">
          {activities.length === 0 ? (
            <p style={{ padding: "20px", color: "var(--gray)" }}>
              No recent activities found.
            </p>
          ) : (
            activities.map((a, index) => (
              <div className="activity" key={a.id || index}>
                <h4>
                  {a.activity_type
                    ? a.activity_type.replace(/_/g, " ")
                    : a.title}
                </h4>

                <p>{a.details || a.note}</p>

                {a.activity_time && (
                  <small style={{ color: "var(--gray)" }}>
                    {new Date(a.activity_time).toLocaleString()}
                  </small>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}