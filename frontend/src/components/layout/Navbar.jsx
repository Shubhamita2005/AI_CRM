export default function Navbar({ notifyOpen, setNotifyOpen }) {
  return (
    <div className="navbar">
      <div className="search">
        <input type="text" placeholder="Search companies, contacts..." />
      </div>
      <div className="profile">
        <div className="notification" onClick={() => setNotifyOpen(!notifyOpen)}>
          🔔
        </div>
        <div className="avatar">SM</div>
      </div>
    </div>
  );
}