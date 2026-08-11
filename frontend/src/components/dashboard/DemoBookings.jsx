import { useState, useEffect } from "react";

export default function DemoBookings({ salesRepId = null }) {
  const [demoBookings, setDemoBookings] = useState([]);
  const [negotiationBookings, setNegotiationBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("demos"); // ✅ Tab switcher

  useEffect(() => {
    fetchAllBookings();
  }, [salesRepId]);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);

      // ✅ Fetch demo bookings
      let demoData = [];
      try {
        const demoRes = await fetch(
          "https://ai-crm-83jh.onrender.com/api/demo-bookings"
        );
        if (demoRes.ok) {
          demoData = await demoRes.json();
        }
      } catch (err) {
        console.warn("⚠️ Could not fetch demo bookings:", err.message);
      }

      // ✅ Fetch negotiation bookings
      let negotiationData = [];
      try {
        const negotiationRes = await fetch(
          "https://ai-crm-83jh.onrender.com/api/negotiation-meetings"
        );
        if (negotiationRes.ok) {
          const contentType = negotiationRes.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            negotiationData = await negotiationRes.json();
          }
        }
      } catch (err) {
        console.warn("⚠️ Could not fetch negotiation meetings:", err.message);
      }

      // ✅ Filter by salesRepId
      const filteredDemos = salesRepId
        ? demoData.filter(
            (b) => Number(b.sales_rep_id) === Number(salesRepId)
          )
        : demoData;

      const filteredNegotiations = salesRepId
        ? negotiationData.filter(
            (b) => Number(b.sales_rep_id) === Number(salesRepId)
          )
        : negotiationData;

      setDemoBookings(filteredDemos);
      setNegotiationBookings(filteredNegotiations);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // ✅ Format time
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
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

  if (loading) {
    return (
      <div
        style={{
          marginTop: "30px",
          background: "white",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
        }}
      >
        <p style={{ color: "var(--gray)", textAlign: "center" }}>
          Loading bookings...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "30px",
        background: "white",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
      }}
    >
      {/* ===== Header ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h2 style={{ fontSize: "22px" }}>🗓️ My Scheduled Meetings</h2>

        {/* ✅ Tab Switcher */}
        <div
          style={{
            display: "flex",
            background: "#f3f4f6",
            borderRadius: "12px",
            padding: "4px",
            gap: "4px",
          }}
        >
          <button
            onClick={() => setActiveTab("demos")}
            style={{
              padding: "8px 20px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              fontFamily: "Poppins, sans-serif",
              background:
                activeTab === "demos"
                  ? "linear-gradient(135deg, #403d88, #8b639b)"
                  : "transparent",
              color: activeTab === "demos" ? "white" : "#6b7280",
              transition: "all 0.2s ease",
            }}
          >
            📅 Demos ({demoBookings.length})
          </button>

          <button
            onClick={() => setActiveTab("negotiations")}
            style={{
              padding: "8px 20px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              fontFamily: "Poppins, sans-serif",
              background:
                activeTab === "negotiations"
                  ? "linear-gradient(135deg, #f59e0b, #d97706)"
                  : "transparent",
              color: activeTab === "negotiations" ? "white" : "#6b7280",
              transition: "all 0.2s ease",
            }}
          >
            🤝 Negotiations ({negotiationBookings.length})
          </button>
        </div>
      </div>

      {/* ===== DEMO BOOKINGS TAB ===== */}
      {activeTab === "demos" && (
        <>
          {demoBookings.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#6b7280",
              }}
            >
              <p style={{ fontSize: "40px", marginBottom: "12px" }}>📅</p>
              <p style={{ fontWeight: "600", fontSize: "16px" }}>
                No demo meetings scheduled
              </p>
              <p style={{ fontSize: "14px", marginTop: "6px" }}>
                Schedule a demo from your follow-ups section.
              </p>
            </div>
          ) : (
            <table className="company-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {demoBookings.map((booking) => (
                  <tr key={booking.demo_id || booking.id}>
                    <td>
                      <strong>{booking.company_name || "N/A"}</strong>
                    </td>
                    <td>📅 {formatDate(booking.demo_date)}</td>
                    <td>⏰ {formatTime(booking.demo_time)}</td>
                    <td>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: "600",
                          background:
                            booking.status === "scheduled"
                              ? "#dcfce7"
                              : "#f3f4f6",
                          color:
                            booking.status === "scheduled"
                              ? "#166534"
                              : "#374151",
                          textTransform: "capitalize",
                        }}
                      >
                        {booking.status || "Scheduled"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* ===== NEGOTIATION BOOKINGS TAB ===== */}
      {activeTab === "negotiations" && (
        <>
          {negotiationBookings.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#6b7280",
              }}
            >
              <p style={{ fontSize: "40px", marginBottom: "12px" }}>🤝</p>
              <p style={{ fontWeight: "600", fontSize: "16px" }}>
                No negotiation meetings scheduled
              </p>
              <p style={{ fontSize: "14px", marginTop: "6px" }}>
                Schedule a negotiation from your follow-ups section.
              </p>
            </div>
          ) : (
            <table className="company-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {negotiationBookings.map((booking) => (
                  <tr key={booking.negotiation_id || booking.id}>
                    <td>
                      <strong>{booking.company_name || "N/A"}</strong>
                    </td>
                    <td>📅 {formatDate(booking.negotiation_date)}</td>
                    <td>⏰ {formatTime(booking.negotiation_time)}</td>
                    <td>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: "600",
                          background:
                            booking.status === "scheduled"
                              ? "#fef3c7"
                              : "#f3f4f6",
                          color:
                            booking.status === "scheduled"
                              ? "#92400e"
                              : "#374151",
                          textTransform: "capitalize",
                        }}
                      >
                        {booking.status || "Scheduled"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}