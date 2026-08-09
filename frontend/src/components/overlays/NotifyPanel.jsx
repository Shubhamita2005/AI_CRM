const managerItems = [
  "🔔 HealthPlus inactive for 5 days",
  "📅 Meeting with InnovateX tomorrow",
  "🚀 EduVerse upgraded to Premium",
];

export default function NotifyPanel({
  open,
  onClose,
  items = managerItems,
}) {
  return (
    <div className={open ? "notify-panel open" : "notify-panel"}>
      <span className="close" onClick={onClose}>
        ✖
      </span>

      <h2>Notifications</h2>
      <br />

      {items.length === 0 ? (
        <div className="notify-empty">
          No notifications available
        </div>
      ) : (
        items.map((item, index) => (
          <div className="notify-item" key={`${index}-${item}`}>
            {item}
          </div>
        ))
      )}
    </div>
  );
}