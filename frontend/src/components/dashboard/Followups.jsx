const followups = [
  { initials: "AB", name: "ABC Technologies", note: "Meeting Tomorrow" },
  { initials: "HP", name: "HealthPlus", note: "Inactive for 5 Days" },
  { initials: "FE", name: "FinEdge", note: "Upgrade Opportunity" },
];

export default function Followups({ title = "Upcoming Follow-ups" }) {
  return (
    <div className="followups">
      <h2>{title}</h2>
      {followups.map((f) => (
        <div className="follow-item" key={f.initials}>
          <div className="follow-avatar">{f.initials}</div>
          <div className="follow-info">
            <h4>{f.name}</h4>
            <p>{f.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}