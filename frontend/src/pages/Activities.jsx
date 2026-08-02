const activityData = [
  { title: "Meeting Completed", note: "Pricing discussion completed with InnovateX." },
  {
    title: "AI Recommendation",
    note: "HealthPlus has not logged in for five days. Suggested sending a re-engagement email.",
  },
  { title: "New Trial Started", note: "NovaTech signed up for a 14-day free trial." },
  { title: "Subscription Converted", note: "EduVerse upgraded to the Growth Plan." },
];

export default function Activities() {
  return (
    <div className="page active">
      <div className="activities">
        <h2>📝 Recent Activities</h2>
        <div className="timeline">
          {activityData.map((a) => (
            <div className="activity" key={a.title}>
              <h4>{a.title}</h4>
              <p>{a.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}