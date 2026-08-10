import { useState } from "react";

const salesActivities = [
  {
    id: 1,
    company: "TechCorp Solutions",
    activities: [
      {
        id: 1,
        type: "CALL",
        icon: "📞",
        title: "Discovery Call",
        description:
          "Discussed product requirements and pricing. Customer showed strong interest in enterprise plan.",
        date: "2026-08-20",
        time: "10:30 AM",
        duration: "45 mins",
        outcome: "Positive",
        color: "#8b5cf6",
      },
      {
        id: 2,
        type: "EMAIL",
        icon: "✉️",
        title: "Sent Proposal",
        description:
          "Sent customized pricing proposal with enterprise features breakdown and ROI analysis.",
        date: "2026-08-19",
        time: "2:15 PM",
        duration: null,
        outcome: "Sent",
        color: "#3b82f6",
      },
      {
        id: 3,
        type: "MEETING",
        icon: "📅",
        title: "Demo Meeting",
        description:
          "Live product demo conducted. Showcased AI features, pipeline management and reporting.",
        date: "2026-08-18",
        time: "11:00 AM",
        duration: "60 mins",
        outcome: "Completed",
        color: "#10b981",
      },
      {
        id: 4,
        type: "NOTE",
        icon: "📝",
        title: "AI Insight",
        description:
          "AI recommends follow-up within 3 days. High conversion probability at 78%. Customer is evaluating 2 other vendors.",
        date: "2026-08-17",
        time: "9:00 AM",
        duration: null,
        outcome: "AI Generated",
        color: "#f59e0b",
      },
      {
        id: 5,
        type: "CALL",
        icon: "📞",
        title: "Follow-up Call",
        description:
          "Customer had questions about data security and GDPR compliance. Sent compliance documentation.",
        date: "2026-08-15",
        time: "3:00 PM",
        duration: "20 mins",
        outcome: "Follow-up Needed",
        color: "#8b5cf6",
      },
    ],
  },
  {
    id: 2,
    company: "FinEdge Capital",
    activities: [
      {
        id: 1,
        type: "MEETING",
        icon: "🤝",
        title: "Negotiation Meeting",
        description:
          "Price negotiation in progress. Customer requesting 15% discount for annual commitment.",
        date: "2026-08-21",
        time: "2:00 PM",
        duration: "90 mins",
        outcome: "In Progress",
        color: "#f59e0b",
      },
      {
        id: 2,
        type: "EMAIL",
        icon: "✉️",
        title: "Contract Sent",
        description:
          "Sent updated contract with revised pricing. Awaiting legal team review from customer side.",
        date: "2026-08-20",
        time: "5:30 PM",
        duration: null,
        outcome: "Awaiting Response",
        color: "#3b82f6",
      },
      {
        id: 3,
        type: "NOTE",
        icon: "📝",
        title: "AI Insight",
        description:
          "AI flags high urgency. Trial ending in 5 days. Recommend immediate follow-up to prevent churn.",
        date: "2026-08-19",
        time: "8:00 AM",
        duration: null,
        outcome: "High Priority",
        color: "#ef4444",
      },
      {
        id: 4,
        type: "CALL",
        icon: "📞",
        title: "Intro Call",
        description:
          "Initial discovery call. Identified pain points around manual reporting and lack of CRM integration.",
        date: "2026-08-10",
        time: "11:00 AM",
        duration: "30 mins",
        outcome: "Positive",
        color: "#8b5cf6",
      },
    ],
  },
  {
    id: 3,
    company: "RetailMax India",
    activities: [
      {
        id: 1,
        type: "EMAIL",
        icon: "✉️",
        title: "Follow-up Email",
        description:
          "Sent follow-up after trial period. Highlighted key features used and ROI metrics.",
        date: "2026-08-22",
        time: "10:00 AM",
        duration: null,
        outcome: "Sent",
        color: "#3b82f6",
      },
      {
        id: 2,
        type: "NOTE",
        icon: "📝",
        title: "AI Insight",
        description:
          "Customer has low engagement in last 7 days. Only 2 logins. Risk of churn is high.",
        date: "2026-08-21",
        time: "9:00 AM",
        duration: null,
        outcome: "Risk Alert",
        color: "#ef4444",
      },
      {
        id: 3,
        type: "CALL",
        icon: "📞",
        title: "Check-in Call",
        description:
          "Quick check-in call. Customer mentioned they are busy with product launch. Will reconnect next week.",
        date: "2026-08-18",
        time: "4:00 PM",
        duration: "15 mins",
        outcome: "Callback Scheduled",
        color: "#8b5cf6",
      },
    ],
  },
];

export default function SalesActivities() {
  const [selectedCompany, setSelectedCompany] = useState(salesActivities[0]);
  const [filter, setFilter] = useState("ALL");

  const filters = ["ALL", "CALL", "EMAIL", "MEETING", "NOTE"];

  const filteredActivities = selectedCompany.activities.filter(
    (a) => filter === "ALL" || a.type === filter
  );

  const getOutcomeStyle = (outcome) => {
    if (outcome === "Positive" || outcome === "Completed")
      return { background: "#dcfce7", color: "#166534" };
    if (outcome === "High Priority" || outcome === "Risk Alert")
      return { background: "#fee2e2", color: "#b91c1c" };
    if (outcome === "In Progress" || outcome === "Awaiting Response")
      return { background: "#fef3c7", color: "#92400e" };
    if (outcome === "AI Generated")
      return { background: "#ede9fe", color: "#5b21b6" };
    return { background: "#f3f4f6", color: "#374151" };
  };

  return (
    <div className="page active">
      {/* Header */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>
          📝 My Activities
        </h2>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>
          Track all your calls, emails, meetings and AI insights per company.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "24px",
        }}
      >
        {/* ===== LEFT: Company List ===== */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
            height: "fit-content",
          }}
        >
          <h3
            style={{
              marginBottom: "16px",
              fontSize: "16px",
              color: "#374151",
            }}
          >
            My Companies
          </h3>

          {salesActivities.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedCompany(item);
                setFilter("ALL");
              }}
              style={{
                padding: "14px 16px",
                borderRadius: "12px",
                marginBottom: "8px",
                cursor: "pointer",
                background:
                  selectedCompany.id === item.id
                    ? "linear-gradient(135deg, #403d88, #8b639b)"
                    : "#f8f8fb",
                color:
                  selectedCompany.id === item.id ? "white" : "#374151",
                transition: "all 0.25s ease",
                border:
                  selectedCompany.id === item.id
                    ? "none"
                    : "1px solid #ececf2",
              }}
            >
              <div style={{ fontWeight: "600", fontSize: "14px" }}>
                {item.company}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  marginTop: "4px",
                  opacity: 0.75,
                }}
              >
                {item.activities.length} activities
              </div>
            </div>
          ))}
        </div>

        {/* ===== RIGHT: Activity Timeline ===== */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "28px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header + Filters */}
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
            <div>
              <h3 style={{ fontSize: "20px", marginBottom: "4px" }}>
                {selectedCompany.company}
              </h3>
              <p style={{ color: "#6b7280", fontSize: "13px" }}>
                {filteredActivities.length} activities shown
              </p>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "999px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                    fontFamily: "Poppins, sans-serif",
                    background:
                      filter === f
                        ? "linear-gradient(135deg, #403d88, #8b639b)"
                        : "#f3f4f6",
                    color: filter === f ? "white" : "#374151",
                    transition: "all 0.2s ease",
                  }}
                >
                  {f === "ALL"
                    ? "All"
                    : f === "CALL"
                    ? "📞 Calls"
                    : f === "EMAIL"
                    ? "✉️ Emails"
                    : f === "MEETING"
                    ? "📅 Meetings"
                    : "📝 Insights"}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div
            style={{
              borderLeft: "3px solid #ede9fe",
              paddingLeft: "28px",
              marginLeft: "12px",
            }}
          >
            {filteredActivities.length === 0 ? (
              <p
                style={{
                  color: "#6b7280",
                  textAlign: "center",
                  padding: "40px",
                }}
              >
                No activities found for this filter.
              </p>
            ) : (
              filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  style={{ marginBottom: "28px", position: "relative" }}
                >
                  {/* Timeline Dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: "-40px",
                      top: "4px",
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: activity.color,
                      boxShadow: `0 0 0 4px white, 0 0 0 6px ${activity.color}30`,
                    }}
                  />

                  {/* Activity Card */}
                  <div
                    style={{
                      background: "#fafafa",
                      border: "1px solid #ececf2",
                      borderRadius: "16px",
                      padding: "18px 20px",
                      transition: "all 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(0,0,0,0.08)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {/* Top Row */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "10px",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span style={{ fontSize: "20px" }}>
                          {activity.icon}
                        </span>
                        <h4 style={{ fontSize: "16px", color: "#1f2937" }}>
                          {activity.title}
                        </h4>
                      </div>

                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: "600",
                          ...getOutcomeStyle(activity.outcome),
                        }}
                      >
                        {activity.outcome}
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        color: "#374151",
                        fontSize: "14px",
                        lineHeight: "1.7",
                        marginBottom: "12px",
                      }}
                    >
                      {activity.description}
                    </p>

                    {/* Meta Info */}
                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        fontSize: "13px",
                        color: "#6b7280",
                        flexWrap: "wrap",
                      }}
                    >
                      <span>📅 {activity.date}</span>
                      <span>⏰ {activity.time}</span>
                      {activity.duration && (
                        <span>⏱ {activity.duration}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}