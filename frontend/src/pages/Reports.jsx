export default function Reports() {
  return (
    <div className="page active">
      <div className="reports">
        <h2>Reports & Analytics</h2>
        <div className="chart-grid">
          <div className="chart-card">
            <h3>Monthly Conversions</h3>
            <div className="fake-chart">
              <div className="bar" style={{ height: "70px" }}></div>
              <div className="bar" style={{ height: "120px" }}></div>
              <div className="bar" style={{ height: "90px" }}></div>
              <div className="bar" style={{ height: "160px" }}></div>
              <div className="bar" style={{ height: "140px" }}></div>
            </div>
          </div>

          <div className="chart-card">
            <h3>Trial vs Paid</h3>
            <div className="fake-chart">
              <div className="bar" style={{ height: "150px" }}></div>
              <div className="bar" style={{ height: "80px" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}