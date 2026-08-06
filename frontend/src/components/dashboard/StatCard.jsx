export default function StatCard({ title, number, growth }) {
  return (
    <div className="stat-card">
      <div className="stat-title">{title}</div>
      <div className="stat-number">{number}</div>

      {growth && (
        <div className="stat-growth">{growth}</div>
      )}
    </div>
  );
}