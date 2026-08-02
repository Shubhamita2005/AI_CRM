export default function Settings({ darkMode, setDarkMode, onLogout }) {
  return (
    <div className="page active">
      <div className="settings">
        <h2>Settings</h2>
        <br />
        <button className="ai-btn" onClick={() => setDarkMode(!darkMode)}>
          Toggle Dark Mode
        </button>
        <button
          className="ai-btn"
          style={{ marginLeft: "12px", background: "#EF4444" }}
          onClick={onLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}