export default function Copilot({ open, setOpen }) {
  return (
    <>
      {open && (
        <div className="copilot" style={{ display: "block" }}>
          <div className="copilot-header">
            🤖 AI Copilot
            <span className="close-copilot" onClick={() => setOpen(false)}>
              ✖
            </span>
          </div>
          <div className="copilot-body">
            <div className="chat">
              <strong>You</strong>
              <br />
              Why is InnovateX at 92%?
            </div>
            <div className="chat">
              <strong>AI</strong>
              <br />
              InnovateX has high engagement, premium feature usage, and multiple
              collaborators. I recommend scheduling a pricing meeting tomorrow.
            </div>
          </div>
          <input placeholder="Ask AI anything..." />
        </div>
      )}

      <div className="copilot-btn" onClick={() => setOpen(!open)}>
        🤖
      </div>
    </>
  );
}