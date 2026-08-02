const meetingsData = [
  { company: "InnovateX", type: "Pricing Consultation", time: "Tomorrow • 11:00 AM" },
  { company: "FinEdge", type: "Enterprise Discussion", time: "Friday • 2:30 PM" },
  { company: "RetailMax", type: "Follow-up Call", time: "Monday • 10:00 AM" },
];

export default function Meetings() {
  return (
    <div className="page active">
      <div className="meetings">
        <h2>📅 Customer Meetings</h2>
        <br />
        {meetingsData.map((m) => (
          <div className="meeting-card" key={m.company}>
            <div className="meeting-info">
              <h3>{m.company}</h3>
              <div className="meeting-type">{m.type}</div>
            </div>
            <div className="meeting-time">{m.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}