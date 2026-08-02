export default function SalesReports() {
  return (
    <div className="page active">
      <div className="reports">
        <h2>📈 My Performance</h2>
        <div className="chart-grid">
          <div className="chart-card">
            <h3>My Monthly Conversions</h3>
            <div className="fake-chart">
              <div className="bar" style={{ height: "40px" }}></div>
              <div className="bar" style={{ height: "65px" }}></div>
              <div className="bar" style={{ height: "55px" }}></div>
              <div className="bar" style={{ height: "90px" }}></div>
              <div className="bar" style={{ height: "100px" }}></div>
            </div>
          </div>

          <div className="chart-card">
            <h3>My Trials vs Converted</h3>
            <div className="fake-chart">
              <div className="bar" style={{ height: "150px" }}></div>
              <div className="bar" style={{ height: "55px" }}></div>
            </div>
          </div>

          <div className="chart-card">
            <h3>Quota Attainment</h3>
            <div className="fake-chart">
              <div className="bar" style={{ height: "120px" }}></div>
            </div>
            <p style={{ color: "var(--gray)", marginTop: "14px", fontSize: "14px" }}>
              74% of ₹1.2L monthly quota reached · ₹33k remaining
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}