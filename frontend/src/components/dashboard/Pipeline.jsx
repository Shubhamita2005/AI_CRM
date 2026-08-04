const stages = [
  {
    name: "Lead",
    deals: [
      { company: "NovaTech", note: "New Signup" },
      { company: "BrightWave", note: "New Signup" },
      { company: "Skyline Retail", note: "Free Trial Started" },
      { company: "ABC Technologies", note: "Contact Pending" },
      { company: "CodeCraft", note: "Demo Requested" },
    ],
  },
  {
    name: "Trial",
    deals: [
      { company: "HealthPlus", note: "Day 5" },
      { company: "RetailMax", note: "Day 8" },
    ],
  },
  {
    name: "Follow-up",
    deals: [
      { company: "FinEdge", note: "Email Scheduled" },
      { company: "Orbit Labs", note: "Call Scheduled" },
    ],
  },
  {
    name: "Meeting",
    deals: [
      { company: "InnovateX", note: "Tomorrow 11:00 AM" },
    ],
  },
  {
    name: "Converted",
    deals: [
      { company: "EduVerse", note: "Growth Plan" },
      { company: "Nimbus Health", note: "Growth Plan" },
    ],
  },
];

console.log("Pipeline file loaded");

export default function Pipeline(props) {
  console.log("Pipeline props:", props);

  const {
    title = "Sales Pipeline",
    onViewStage,
    onViewCompany,
  } = props;

  return (
    <div className="pipeline">
      <h2>{title}</h2>

      <div className="pipeline-grid">
        {stages.map((stage) => (
          <div className="stage" key={stage.name}>
            <h3>{stage.name}</h3>

            {/* Show only first 2 companies */}
            {stage.deals.slice(0, 2).map((deal) => (
              <div
                key={deal.company}
                className="deal"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (onViewCompany) {
                    onViewCompany(deal.company);
                  }
                }}
              >
                <h4>{deal.company}</h4>
                <p>{deal.note}</p>
              </div>
            ))}

            {/* More button */}
            {stage.deals.length > 2 && (
              <button
                className="more-btn"
                onClick={() => {
                  console.log("More button clicked for stage:", stage.name);
                  console.log("onViewStage =", onViewStage);

                  if (onViewStage) {
                    console.log("Calling onViewStage with:", stage.name);
                    onViewStage(stage.name);
                  } else {
                    console.error("onViewStage is undefined!");
                  }
                }}
              >
                View All
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}