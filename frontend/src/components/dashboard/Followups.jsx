import { useState, useEffect, useRef } from "react";
import { activitiesAPI } from "../../services/api";
import DemoBookingForm from "../overlays/DemoBookingForm";
import NegotiationBookingForm from "../overlays/NegotiationBookingForm";

export default function Followups({ 
  title = "Follow-ups",
  salesRepId = null
}) {
  const [followups, setFollowups] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [demoCustomer, setDemoCustomer] = useState(null);
  const [negotiationCustomer, setNegotiationCustomer] = useState(null);
  const [demoBookings, setDemoBookings] = useState([]);
  const [negotiationBookings, setNegotiationBookings] = useState([]);

  const [popupBooking, setPopupBooking] = useState(null);
  const [popupType, setPopupType] = useState(null);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchFollowups();
    fetchBookings();
  }, [salesRepId]);

  const fetchFollowups = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await activitiesAPI.getFollowups(salesRepId);
      setFollowups(data || []);
    } catch (err) {
      console.error("Failed to load follow-ups:", err);
      setError("Failed to load follow-ups");
      setFollowups([]);
    } finally {
      setLoading(false);
    }
  };

 const fetchBookings = async () => {
  try {
    // ✅ Fetch demo bookings
    let demoData = [];
    try {
      const demoRes = await fetch(
        "https://ai-crm-83jh.onrender.com/api/demo-bookings"
      );
      if (demoRes.ok) {
        demoData = await demoRes.json();
      } else {
        console.warn("⚠️ Demo bookings endpoint returned:", demoRes.status);
      }
    } catch (err) {
      console.warn("⚠️ Could not fetch demo bookings:", err.message);
    }

    setDemoBookings(Array.isArray(demoData) ? demoData : []);

    // ✅ Fetch negotiation meetings (with proper error handling)
    let negotiationData = [];
    try {
      const negotiationRes = await fetch(
        "https://ai-crm-83jh.onrender.com/api/negotiation-meetings"
      );
      
      if (negotiationRes.ok) {
        const contentType = negotiationRes.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          negotiationData = await negotiationRes.json();
        } else {
          console.warn("⚠️ Negotiation endpoint returned non-JSON response");
        }
      } else {
        console.warn("⚠️ Negotiation meetings endpoint not available (404)");
      }
    } catch (err) {
      console.warn("⚠️ Could not fetch negotiation meetings:", err.message);
    }

    setNegotiationBookings(Array.isArray(negotiationData) ? negotiationData : []);

  } catch (error) {
    console.error("Failed to fetch bookings:", error);
  }
};

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      
      return `${displayHour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  const showToast = (type, companyName, date, time) => {
    const messages = {
      demo: {
        icon: "🎉",
        title: "Demo Successfully Booked!",
        message: `Your demo with ${companyName} is scheduled for ${formatDate(date)} at ${formatTime(time)}. Get ready to showcase!`
      },
      negotiation: {
        icon: "🤝",
        title: "Negotiation Meeting Set!",
        message: `Negotiation with ${companyName} confirmed for ${formatDate(date)} at ${formatTime(time)}. Time to close the deal!`
      }
    };

    setToast({ ...messages[type], type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="followups">
        <h2>{title}</h2>
        <p className="followup-empty">Loading follow-ups...</p>
      </div>
    );
  }

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
            
            // ✅ Better detection: check if text is actually long
            const noteText = item.note || "No details available.";
            const noteLines = noteText.split('\n').length;
            const isLongText = noteText.length > 150 || noteLines > 3; // ✅ Increased threshold

            const demoBooking = demoBookings.find(
              (b) => Number(b.customer_id) === Number(item.customer_id)
            );

            const negotiationBooking = negotiationBookings.find(
              (b) => Number(b.customer_id) === Number(item.customer_id)
            );

            return (
              <div key={id} className="followup-card">
                <div className="followup-top">
                  <div>
                    <h3>{item.company_name || item.company}</h3>

                    <p style={{ fontSize: "12px", color: "var(--gray)" }}>
                      Customer ID: {item.customer_id}
                    </p>

                    <p className="followup-time">
                      ⏰ {item.time || "No timeframe"}
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

                <p className={expanded ? "followup-note expanded" : "followup-note"}>
                  {noteText}
                </p>

                <div className="followup-footer">
                  {isLongText && (
                    <button
                      className="followup-link"
                      onClick={() => toggleExpand(id)}
                    >
                      {expanded ? "Show less" : "Show more"}
                    </button>
                  )}

                  <div className="followup-actions">

                    {item.action === "CALL" && (
                      <button className="followup-action-btn call">
                        📞 Call
                      </button>
                    )}

                    {item.action === "EMAIL" && (
                      <button className="followup-action-btn email">
                        ✉️ Send Email
                      </button>
                    )}

                    {item.action === "MEETING" &&
                      item.meeting_type === "DEMO" && (
                      demoBooking ? (
                        <button
                          className="followup-action-btn booked"
                          onClick={() => {
                            setPopupBooking(demoBooking);
                            setPopupType("demo");
                          }}
                        >
                          ✅ Demo Booked
                        </button>
                      ) : (
                        <button
                          className="followup-action-btn meeting"
                          onClick={() =>
                            setDemoCustomer({
                              customer_id: item.customer_id,
                              company: item.company,
                              contact: item.contact || "N/A",
                              email: item.email || "N/A",
                            })
                          }
                        >
                          📅 Schedule Demo
                        </button>
                      )
                    )}

                    {item.action === "MEETING" &&
                      item.meeting_type === "NEGOTIATION" && (
                      negotiationBooking ? (
                        <button
                          className="followup-action-btn booked"
                          onClick={() => {
                            setPopupBooking(negotiationBooking);
                            setPopupType("negotiation");
                          }}
                        >
                          ✅ Negotiation Booked
                        </button>
                      ) : (
                        <button
                          className="followup-action-btn negotiation"
                          onClick={() =>
                            setNegotiationCustomer({
                              customer_id: item.customer_id,
                              company: item.company,
                              contact: item.contact || "N/A",
                              email: item.email || "N/A",
                            })
                          }
                        >
                          🤝 Schedule Negotiation
                        </button>
                      )
                    )}

                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {toast && (
        <div className={`custom-toast ${toast.type}`}>
          <div className="custom-toast-icon">{toast.icon}</div>
          <div className="custom-toast-content">
            <div className="custom-toast-title">{toast.title}</div>
            <div className="custom-toast-message">{toast.message}</div>
          </div>
        </div>
      )}

      {popupBooking && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setPopupBooking(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "30px",
              width: "360px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPopupBooking(null)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#6b7280",
              }}
            >
              ✕
            </button>

            <h3 style={{ marginBottom: "16px", color: "#403d88" }}>
              {popupType === "demo"
                ? "📅 Demo Meeting Details"
                : "🤝 Negotiation Meeting Details"}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={detailRow}>
                <span style={detailLabel}>Company</span>
                <span style={detailValue}>
                  {popupBooking.company_name || "N/A"}
                </span>
              </div>

              <div style={detailRow}>
                <span style={detailLabel}>Date</span>
                <span style={detailValue}>
                  📅{" "}
                  {formatDate(
                    popupType === "demo"
                      ? popupBooking.demo_date
                      : popupBooking.negotiation_date
                  )}
                </span>
              </div>

              <div style={detailRow}>
                <span style={detailLabel}>Time</span>
                <span style={detailValue}>
                  ⏰{" "}
                  {formatTime(
                    popupType === "demo"
                      ? popupBooking.demo_time
                      : popupBooking.negotiation_time
                  )}
                </span>
              </div>

              <div style={detailRow}>
                <span style={detailLabel}>Status</span>
                <span
                  style={{
                    background: "#dcfce7",
                    color: "#166534",
                    padding: "4px 12px",
                    borderRadius: "999px",
                    fontWeight: "600",
                    fontSize: "13px",
                  }}
                >
                  {popupBooking.status || "Scheduled"}
                </span>
              </div>
            </div>

            <button
              className="ai-btn"
              onClick={() => setPopupBooking(null)}
              style={{ marginTop: "24px", width: "100%" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <DemoBookingForm
        open={!!demoCustomer}
        customer={demoCustomer}
        salesRepId={salesRepId}
        onClose={() => setDemoCustomer(null)}
        onSuccess={(bookingData) => {
          fetchBookings();
          showToast(
            'demo',
            bookingData.company_name || demoCustomer?.company,
            bookingData.demo_date,
            bookingData.demo_time
          );
        }}
      />

      <NegotiationBookingForm
        open={!!negotiationCustomer}
        customer={negotiationCustomer}
        salesRepId={salesRepId}
        onClose={() => setNegotiationCustomer(null)}
        onSuccess={(bookingData) => {
          fetchBookings();
          showToast(
            'negotiation',
            bookingData.company_name || negotiationCustomer?.company,
            bookingData.negotiation_date,
            bookingData.negotiation_time
          );
        }}
      />
    </div>
  );
}

const detailRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid #f3f4f6",
};

const detailLabel = {
  color: "#6b7280",
  fontSize: "14px",
};

const detailValue = {
  fontWeight: "600",
  fontSize: "14px",
  color: "#1f2937",
};