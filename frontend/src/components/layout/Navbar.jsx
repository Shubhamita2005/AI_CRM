export default function Navbar({
  notifyOpen,
  setNotifyOpen,
  activePage,
  placeholder = "Search companies, contacts...",
  avatarInitials = "SM",
}) {

  // 👇 Add it HERE
  const showSearch =
    activePage !== "dashboard" &&
    activePage !== "settings";

  return (
    <div className="navbar">

      {showSearch && (
        <div className="search">
          <input type="text" placeholder={placeholder} />
        </div>
      )}

      <div className="profile">
        <div
          className="notification"
          onClick={() => setNotifyOpen(!notifyOpen)}
        >
          🔔
        </div>

        <div className="avatar">{avatarInitials}</div>
      </div>
    </div>
  );
}