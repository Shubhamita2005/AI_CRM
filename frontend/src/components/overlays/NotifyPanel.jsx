export default function NotifyPanel({ open, onClose }) {
  return (
    <div className={open ? "notify-panel open" : "notify-panel"}>
      <span className="close" onClick={onClose}>
        ✖
      </span>
      <h2>Notifications</h2>
      <br />
      <div className="notify-item">🔔 HealthPlus inactive for 5 days</div>
      <div className="notify-item">📅 Meeting with InnovateX tomorrow</div>
      <div className="notify-item">🚀 EduVerse upgraded to Premium</div>
    </div>
  );
}