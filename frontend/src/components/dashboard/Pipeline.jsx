const stages = [
  {
    name: "Lead",
    deals: [{ title: "NovaTech", note: "New Signup" }],
  },
  {
    name: "Trial",
    deals: [
      { title: "HealthPlus", note: "Day 5" },
      { title: "RetailMax", note: "Day 8" },
    ],
  },
  {
    name: "Follow-up",
    deals: [{ title: "FinEdge", note: "Email Scheduled" }],
  },
  {
    name: "Meeting",
    deals: [{ title: "InnovateX", note: "Tomorrow 11:00 AM" }],
  },
  {
    name: "Converted",
    deals: [{ title: "EduVerse", note: "Growth Plan" }],
  },
];

export default function Pipeline({ title = "Sales Pipeline" }) {
  return (
    <div className="pipeline">
      <h2>{title}</h2>
      <div className="pipeline-grid">
        {stages.map((stage) => (
          <div className="stage" key={stage.name}>
            <h3>{stage.name}</h3>
            {stage.deals.map((deal) => (
              <div className="deal" key={deal.title}>
                <h4>{deal.title}</h4>
                <p>{deal.note}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}