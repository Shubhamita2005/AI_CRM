import { useState } from "react";

export default function NegotiationBookingForm({
  open,
  onClose,
  customer,
  salesRepId,
  onSuccess,
}) {
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open || !customer) return null;

  const handleSubmit = async () => {
    if (!meetingDate || !meetingTime) {
      alert("Please select date and time");
      return;
    }

    // ✅ Create payload
    const payload = {
      customer_id: Number(customer.customer_id),
      negotiation_date: meetingDate,
      negotiation_time: meetingTime.slice(0, 5),
      sales_rep_id: salesRepId,
    };

    // ✅ Debug logs
    console.log("📤 Sending negotiation booking payload:", payload);
    console.log("📊 salesRepId type:", typeof salesRepId, "| value:", salesRepId);

    try {
      setLoading(true);

      const response = await fetch(
        "https://ai-crm-83jh.onrender.com/api/negotiation-meetings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();
      console.log("📥 Backend response:", responseData);

      if (!response.ok) {
        alert(responseData.message || "Failed to schedule");
        return;
      }

      console.log("✅ Negotiation meeting created successfully!");

      // ✅ Pass booking data to parent for toast notification
      if (onSuccess) {
        onSuccess({
          company_name: customer.company,
          negotiation_date: meetingDate,
          negotiation_time: meetingTime.slice(0, 5),
        });
      }

      onClose();

      // Reset form
      setMeetingDate("");
      setMeetingTime("");
    } catch (error) {
      console.error("❌ Failed to schedule negotiation:", error);
      alert("Failed to schedule negotiation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        background: "rgba(0,0,0,0.5)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          width: "400px",
          borderRadius: "12px",
          margin: "20px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginBottom: "20px", color: "#403d88" }}>
          🤝 Schedule Negotiation Meeting
        </h2>

        <div
          style={{
            background: "#fef3c7",
            padding: "15px",
            borderRadius: "12px",
            marginBottom: "20px",
            border: "2px solid #fbbf24",
          }}
        >
          <p style={{ marginBottom: "8px" }}>
            <strong>Company:</strong> {customer.company}
          </p>
          <p style={{ marginBottom: "8px" }}>
            <strong>Contact:</strong> {customer.contact}
          </p>
          <p>
            <strong>Email:</strong> {customer.email}
          </p>
        </div>

        <div style={{ marginTop: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Date:
          </label>
          <input
            type="date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "5px",
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              outline: "none",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginTop: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Time:
          </label>
          <input
            type="time"
            value={meetingTime}
            onChange={(e) => setMeetingTime(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "5px",
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              outline: "none",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginTop: "25px", display: "flex", gap: "10px" }}>
          <button
            className="ai-btn"
            onClick={handleSubmit}
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? "Scheduling..." : "Schedule Negotiation"}
          </button>

          <button
            className="ai-btn"
            style={{ background: "#6b7280", flex: 1 }}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}