const navItems = [
  { id: "dashboard", label: "🏠 Dashboard" },
  { id: "companies", label: "🏢 Companies" },
  { id: "meetings", label: "📅 Meetings" },
  { id: "activities", label: "📝 Activities" },
  { id: "insights", label: "🤖 AI Insights" },
  { id: "reports", label: "📊 Reports" },
  { id: "settings", label: "⚙ Settings" },
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <div className="sidebar">
      <div className="logo">FlowCRM AI</div>
      <div className="tagline">Convert Smarter. Grow Faster.</div>
      <div className="menu">
        {navItems.map((item) => (
          <a
            key={item.id}
            className={activePage === item.id ? "active nav-link" : "nav-link"}
            onClick={() => setActivePage(item.id)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}