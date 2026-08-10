import { useState } from "react";

const salesReps = [
  {
    id: 1,
    name: "Priya Sharma",
    initials: "PS",
    role: "Senior Sales Rep",
    color: "#403d88",
    stats: { calls: 5, emails: 4, meetings: 2, insights: 1 },
    activities: [
      {
        id: 1,
        type: "MEETING",
        icon: "📅",
        company: "TechCorp Solutions",
        title: "Demo Meeting Completed",
        description:
          "Successfully completed product demo. Customer highly impressed with AI pipeline feature. Moving to negotiation stage.",
        date: "2026-08-21",
        time: "11:00 AM",
        duration: "60 mins",
        outcome: "Completed",
        color: "#10b981",
      },
      {
        id: 2,
        type: "CALL",
        icon: "📞",
        company: "FinEdge Capital",
        title: "Negotiation Call",
        description:
          "Discussed final pricing terms. Customer agreed on annual plan. Contract being prepared.",
        date: "2026-08-20",
        time: "3:00 PM",
        duration: "45 mins",
        outcome: "Positive",
        color: "#8b5cf6",
      },
      {
        id: 3,
        type: "EMAIL",
        icon: "✉️",
        company: "TechCorp Solutions",
        title: "Proposal Sent",
        description:
          "Sent detailed proposal with enterprise pricing and custom integration options.",
        date: "2026-08-19",
        time: "10:00 AM",
        duration: null,
        outcome: "Sent",
        color: "#3b82f6",
      },
      {
        id: 4,
        type: "NOTE",
        icon: "📝",
        company: "RetailMax India",
        title: "AI Insight",
        description:
          "AI flags churn risk. Customer engagement dropped 60% in last 7 days. Immediate action recommended.",
        date: "2026-08-18",
        time: "9:00 AM",
        duration: null,
        outcome: "Risk Alert",
        color: "#ef4444",
      },
    ],
  },
  {
    id: 2,
    name: "Rahul Mehta",
    initials: "RM",
    role: "Sales Representative",
    color: "#8b639b",
    stats: { calls: 4, emails: 3, meetings: 2, insights: 1 },
    activities: [
      {
        id: 1,
        type: "MEETING",
        icon: "🤝",
        company: "DataFlow Systems",
        title: "Negotiation Meeting",
        description:
          "Price negotiation ongoing. Customer wants 20% discount for 2-year commitment. Escalated to manager.",
        date: "2026-08-22",
        time: "2:00 PM",
        duration: "90 mins",
        outcome: "In Progress",
        color: "#f59e0b",
      },
      {
        id: 2,
        type: "EMAIL",
        icon: "✉️",
        company: "CloudBase Inc",
        title: "Follow-up Email",
        description:
          "Sent follow-up after product demo. Included case studies from similar companies.",
        date: "2026-08-21",
        time: "11:30 AM",
        duration: null,
        outcome: "Awaiting Response",
        color: "#3b82f6",
      },
      {
        id: 3,
        type: "CALL",
        icon: "📞",
        company: "DataFlow Systems",
        title: "Discovery Call",
        description:
          "Initial discovery. Customer needs CRM integration with Salesforce. Technical requirements documented.",
        date: "2026-08-19",
        time: "10:00 AM",
        duration: "35 mins",
        outcome: "Positive",
        color: "#8b5cf6",
      },
      {
        id: 4,
        type: "NOTE",
        icon: "📝",
        company: "CloudBase Inc",
        title: "AI Insight",
        description:
          "AI recommends scheduling demo within 48 hours. High engagement score - 92% trial feature usage.",
        date: "2026-08-18",
        time: "8:00 AM",
        duration: null,
        outcome: "AI Generated",
        color: "#f59e0b",
      },
    ],
  },
  {
    id: 3,
    name: "Ananya Patel",
    initials: "AP",
    role: "Junior Sales Rep",
    color: "#af719d",
    stats: { calls: 3, emails: 3, meetings: 1, insights: 1 },
    activities: [
      {
        id: 1,
        type: "CALL",
        icon: "📞",
        company: "GrowthLabs",
        title: "Intro Call",
        description:
          "First contact with GrowthLabs. Identified need for team collaboration and reporting features.",
        date: "2026-08-22",
        time: "10:00 AM",
        duration: "30 mins",
        outcome: "Positive",
        color: "#8b5cf6",
      },
      {
        id: 2,
        type: "EMAIL",
        icon: "✉️",
        company: "ScaleUp Ventures",
        title: "Introduction Email",
        description:
          "Sent product introduction email with free trial link. Highlighted key features for startups.",
        date: "2026-08-21",
        time: "9:00 AM",
        duration: null,
        outcome: "Sent",
        color: "#3b82f6",
      },
      {
        id: 3,
        type: "MEETING",
        icon: "📅",
        company: "GrowthLabs",
        title: "Product Demo",
        description:
          "First demo with GrowthLabs team. 5 stakeholders attended. Very engaged, asked detailed questions.",
        date: "2026-08-20",
        time: "3:00 PM",
        duration: "60 mins",
        outcome: "Completed",
        color: "#10b981",
      },
      {
        id: 4,
        type: "NOTE",
        icon: "📝",
        company: "ScaleUp Ventures",
        title: "AI Insight",
        description:
          "Low trial engagement. Customer hasn't logged in for 4 days. Recommend personalized outreach.",
        date: "2026-08-19",
        time: "9:00 AM",
        duration: null,
        outcome: "Risk Alert",
        color: "#ef4444",
      },
    ],
  },
];

export default function Activities() {
  const [selectedRep, setSelectedRep] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const filters = ["ALL", "CALL", "EMAIL", "MEETING", "NOTE"];

  const filteredActivities = selectedRep
    ? selectedRep.activities.filter(
        (a) => filter === "ALL" || a.type === filter
      )
    : [];

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
          📝 Team Activities
        </h2>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>
          Monitor all sales rep activities — calls, emails, meetings and AI
          insights.
        </p>
      </div>

      {!selectedRep ? (
        // ===== SALES REP CARDS =====
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {salesReps.map((rep) => (
            <div
              key={rep.id}
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "24px",
                boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "2px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = rep.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "transparent";
              }}
              onClick={() => setSelectedRep(rep)}
            >
              {/* Rep Info */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "55px",
                    height: "55px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${rep.color}, #af719d)`,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "18px",
                  }}
                >
                  {rep.initials}
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", marginBottom: "4px" }}>
                    {rep.name}
                  </h3>
                  <p style={{ color: "#6b7280", fontSize: "13px" }}>
                    {rep.role}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                {[
                  { label: "Calls", value: rep.stats.calls, icon: "📞", bg: "#ede9fe" },
                  { label: "Emails", value: rep.stats.emails, icon: "✉️", bg: "#dbeafe" },
                  { label: "Meetings", value: rep.stats.meetings, icon: "📅", bg: "#dcfce7" },
                  { label: "Insights", value: rep.stats.insights, icon: "📝", bg: "#fef3c7" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: stat.bg,
                      borderRadius: "12px",
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "18px", marginBottom: "4px" }}>
                      {stat.icon}
                    </div>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "20px",
                        color: "#1f2937",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* View Button */}
              <button
                style={{
                  width: "100%",
                  padding: "12px",
                  background: `linear-gradient(135deg, ${rep.color}, #af719d)`,
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                View Activities →
              </button>
            </div>
          ))}
        </div>
      ) : (
        // ===== SELECTED REP TIMELINE =====
        <div>
          {/* Back Button */}
          <button
            onClick={() => {
              setSelectedRep(null);
              setFilter("ALL");
            }}
            style={{
              background: "white",
              border: "2px solid #ececf2",
              padding: "10px 20px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "Poppins, sans-serif",
              color: "#374151",
            }}
          >
            ← Back to Team
          </button>

          {/* Rep Header + Filters */}
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${selectedRep.color}, #af719d)`,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "18px",
                }}
              >
                {selectedRep.initials}
              </div>
              <div>
                <h3 style={{ fontSize: "20px", marginBottom: "4px" }}>
                  {selectedRep.name}
                </h3>
                <p style={{ color: "#6b7280", fontSize: "13px" }}>
                  {selectedRep.role} • {filteredActivities.length} activities
                </p>
              </div>
            </div>

            {/* Filters */}
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
                        ? `linear-gradient(135deg, ${selectedRep.color}, #af719d)`
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
              background: "white",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
            }}
          >
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
                    {/* Dot */}
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

                    {/* Card */}
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
                          marginBottom: "8px",
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
                          <div>
                            <h4
                              style={{
                                fontSize: "16px",
                                color: "#1f2937",
                              }}
                            >
                              {activity.title}
                            </h4>
                            <p
                              style={{
                                fontSize: "12px",
                                color: "#8b5cf6",
                                fontWeight: "600",
                              }}
                            >
                              {activity.company}
                            </p>
                          </div>
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

                      {/* Meta */}
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
      )}
    </div>
  );
}