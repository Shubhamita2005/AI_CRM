import { useState, useEffect } from "react";
import Hero from "../components/dashboard/Hero";
import StatCard from "../components/dashboard/StatCard";
import Pipeline from "../components/dashboard/Pipeline";
import Followups from "../components/dashboard/Followups";
import CompaniesTable from "../components/dashboard/CompaniesTable";
import { statsAPI } from "../services/api";

export default function Dashboard({
  onView,
  onAddCompany,
  onViewStage,
  onViewCompany,
}) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await statsAPI.getDashboardStats();

      // Convert backend response into StatCard format
      const statCards = [
        {
          title: "Trial Users",
          number: data.trialUsers || 0,
          growth: `↑ ${data.trialGrowth || 0}%`,
        },
        {
          title: "Conversion Rate",
          number: `${data.conversionRate || 0}%`,
          growth: `↑ ${data.conversionGrowth || 0}%`,
        },
        {
          title: "Revenue Potential",
          number: `₹${data.revenuePotential || 0}`,
          growth: `↑ ${data.revenueGrowth || 0}%`,
        },
        {
          title: "Meetings",
          number: data.meetingsToday || 0,
          growth: "Today",
        },
      ];

      setStats(statCards);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active">
      <Hero />

      <div className="stats">
        {loading && (
          <p style={{ textAlign: "center", padding: "20px" }}>
            Loading dashboard...
          </p>
        )}

        {error && (
          <p style={{ textAlign: "center", color: "red", padding: "20px" }}>
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          stats.map((s, index) => (
            <StatCard key={index} {...s} />
          ))}
      </div>

      <Pipeline
        title="Sales Pipeline"
        onViewStage={onViewStage}
        onViewCompany={onViewCompany}
      />

      <Followups />

      <CompaniesTable
        onView={onView}
        onAddCompany={onAddCompany}
      />
    </div>
  );
}