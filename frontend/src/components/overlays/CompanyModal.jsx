export default function CompanyModal({ open, onClose, onSave, title = "Add Company" }) {
  return (
    <div className={open ? "modal show" : "modal"}>
      <div className="modal-content">
        <h2>{title}</h2>
        <input placeholder="Company Name" />
        <input placeholder="Industry" />
        <input placeholder="Company Size" />
        <input placeholder="Country" />
        <div className="modal-buttons">
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="save" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}