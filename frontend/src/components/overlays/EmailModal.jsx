export default function EmailModal({ open, onClose }) {
  return (
    <div className={open ? "modal show" : "modal"}>
      <div className="modal-content">
        <h2>AI Generated Email</h2>
        <p>
          Hi InnovateX Team,
          <br />
          <br />
          We noticed your team has been actively using FlowCRM AI. Based on your recent
          activity we'd love to schedule a quick demo of our Premium plan. Would Thursday
          at 11 AM work?
          <br />
          Regards,
          <br />
          Sales Team
        </p>
        <div className="modal-buttons">
          <button className="save" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}