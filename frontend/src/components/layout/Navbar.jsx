export default function Navbar({
  notifyOpen,
  setNotifyOpen,
  placeholder = "Search companies, contacts...",
  avatarInitials = "SM",
}) {
  return (
    <div className="navbar">
      <div className="search">
        <input type="text" placeholder={placeholder} />
      </div>
      <div className="profile">
        <div className="notification" onClick={() => setNotifyOpen(!notifyOpen)}>
          🔔
        </div>
        <div className="avatar">{avatarInitials}</div>
      </div>
    </div>
  );
}