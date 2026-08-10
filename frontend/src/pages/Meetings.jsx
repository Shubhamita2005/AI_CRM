import { useEffect, useState } from "react";

export default function Meetings({ 
  title = "📅 Customer Meetings",
  salesRepId 
}) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🔍 salesRepId:", salesRepId);
    if (salesRepId) {
      fetchMeetings();
    } else {
      console.warn("⚠️ No salesRepId provided");
      setLoading(false);
    }
  }, [salesRepId]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📡 Fetching meetings...");

      // ✅ Fetch demo bookings
      let demoData = [];
      try {
        const demoRes = await fetch(
          "https://ai-crm-83jh.onrender.com/api/demo-bookings"
        );
        if (demoRes.ok) {
          demoData = await demoRes.json();
          console.log("📅 Demo data:", demoData);
        } else {
          console.warn("⚠️ Demo bookings endpoint returned:", demoRes.status);
        }
      } catch (err) {
        console.warn("⚠️ Could not fetch demo bookings:", err.message);
      }

      // ✅ Fetch negotiation meetings
      let negotiationData = [];
      try {
        const negotiationRes = await fetch(
          "https://ai-crm-83jh.onrender.com/api/negotiation-meetings"
        );
        
        if (negotiationRes.ok) {
          const contentType = negotiationRes.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            negotiationData = await negotiationRes.json();
            console.log("🤝 Negotiation data:", negotiationData);
          } else {
            console.warn("⚠️ Negotiation endpoint returned non-JSON");
          }
        } else {
          console.warn("⚠️ Negotiation endpoint not available (404)");
        }
      } catch (err) {
        console.warn("⚠️ Could not fetch negotiation meetings:", err.message);
      }

      // ✅ Filter by sales rep
      const filteredDemos = (Array.isArray(demoData) ? demoData : []).filter(
        (d) => {
          console.log(`Comparing demo sales_rep_id: ${d.sales_rep_id} with ${salesRepId}`);
          return Number(d.sales_rep_id) === Number(salesRepId);
        }
      );

      const filteredNegotiations = (Array.isArray(negotiationData) ? negotiationData : []).filter(
        (n) => {
          console.log(`Comparing negotiation sales_rep_id: ${n.sales_rep_id} with ${salesRepId}`);
          return Number(n.sales_rep_id) === Number(salesRepId);
        }
      );

      console.log("✅ Filtered demos:", filteredDemos);
      console.log("✅ Filtered negotiations:", filteredNegotiations);

      // ✅ Format demo meetings
      const formattedDemos = filteredDemos.map((d) => {
        // Extract clean date (YYYY-MM-DD)
        const cleanDate = d.demo_date 
          ? (typeof d.demo_date === 'string' ? d.demo_date.split('T')[0] : d.demo_date)
          : null;

        return {
          id: `demo-${d.demo_id}`,
          company: d.company_name || "Unknown Company",
          type: "📅 Demo Meeting",
          date: cleanDate,
          time: d.demo_time || "00:00",
        };
      });

      // ✅ Format negotiation meetings
      const formattedNegotiations = filteredNegotiations.map((n) => {
        const cleanDate = n.negotiation_date 
          ? (typeof n.negotiation_date === 'string' ? n.negotiation_date.split('T')[0] : n.negotiation_date)
          : null;

        return {
          id: `neg-${n.id || n.negotiation_id}`,
          company: n.company_name || "Unknown Company",
          type: "🤝 Negotiation Meeting",
          date: cleanDate,
          time: n.negotiation_time || "00:00",
        };
      });

      // ✅ Combine both
      const allMeetings = [...formattedDemos, ...formattedNegotiations];

      console.log("📋 All meetings:", allMeetings);

      // ✅ Sort by date + time (nearest first)
      allMeetings.sort((a, b) => {
        const aDate = new Date(`${a.date}T${a.time}`);
        const bDate = new Date(`${b.date}T${b.time}`);
        return aDate - bDate;
      });

      console.log("✅ Final sorted meetings:", allMeetings);

      setMeetings(allMeetings);

    } catch (error) {
      console.error("❌ Error fetching meetings:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // ✅ Format time nicely
  const formatTime = (timeString) => {
    if (!timeString) return "No time";
    
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  return (
    <div className="page active">
      <div className="meetings">
        <h2>{title}</h2>
        <br />

        {loading ? (
          <p>Loading meetings...</p>
        ) : error ? (
          <div>
            <p style={{ color: "red" }}>Error: {error}</p>
            <button className="ai-btn" onClick={fetchMeetings}>
              Retry
            </button>
          </div>
        ) : meetings.length === 0 ? (
          <p style={{ color: "var(--gray)", textAlign: "center", padding: "20px" }}>
            No meetings scheduled.
          </p>
        ) : (
          meetings.map((m) => (
            <div className="meeting-card" key={m.id}>
              <div className="meeting-info">
                <h3>{m.company}</h3>
                <div className="meeting-type">{m.type}</div>
              </div>
              <div className="meeting-time">
                {formatDate(m.date)} • {formatTime(m.time)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}