export default function Toast({ visible, message }) {
  return (
    <div className="toast" style={{ display: visible ? "block" : "none" }}>
      {message}
    </div>
  );
}