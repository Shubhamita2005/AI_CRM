const defaultNavItems = [
  { id: "dashboard", label: "🏠 Dashboard" },
  { id: "companies", label: "🏢 Companies" },
  { id: "meetings", label: "📅 Meetings" },
  { id: "activities", label: "📝 Activities" },
  { id: "settings", label: "⚙ Settings" },
];

export default function Sidebar({
  activePage,
  setActivePage,
  navItems = defaultNavItems,
  tagline = "Convert Smarter. Grow Faster.",
}) {
  return (
    <div className="sidebar">
      <div className="logo">FlowCRM AI</div>
      <div className="tagline">{tagline}</div>
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