import { useState, useEffect } from "react";
import Hero from "../../components/dashboard/Hero";
import StatCard from "../../components/dashboard/StatCard";
import Pipeline from "../../components/dashboard/Pipeline";
import Followups from "../../components/dashboard/Followups";
import CompaniesTable from "../../components/dashboard/CompaniesTable";
import { salesAPI } from "../../services/api";
import DemoBookings from "../../components/dashboard/DemoBookings";

export default function SalesDashboard({
  onViewStage,
  onViewCompany,
  onAddCompany,
  salesRepId,
}) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (salesRepId) {
      fetchSalesDashboardStats();
    }
  }, [salesRepId]);

  const fetchSalesDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Using existing dashboard stats route (no 404)
      const data = await salesAPI.getDashboardStats();

      const statCards = [
        {
          title: "My Trial Accounts",
          number: data.trialAccounts || 0,
        },
        {
          title: "My Conversion Rate",
          number: `${data.conversionRate || 0}%`,
        },
        {
          title: "Quota Progress",
          number: `${data.quotaProgress || 0}%`,
        },
        {
          title: "My Meetings",
          number: data.meetingsToday || 0,
          growth: "Today",
        },
      ];

      setStats(statCards);
    } catch (err) {
      console.error("Failed to load sales dashboard:", err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active">
      {/* ✅ Hero Section */}
      <Hero
        title="Good Morning, Sales Representative 👋"
        subtitle="Welcome back to FlowCRM AI. You have trial accounts that need attention today. Let AI Copilot help you prioritize follow-ups, prepare for meetings, and close more deals."
      />

      {/* ✅ Stats Section */}
      <div className="stats">
        {loading && (
          <p style={{ textAlign: "center", padding: "20px" }}>
            Loading dashboard...
          </p>
        )}

        {error && (
          <p style={{ color: "red", textAlign: "center", padding: "20px" }}>
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      {/* ✅ Pipeline */}
      <div style={{ marginTop: "30px" }}>
        <Pipeline
          title="My Pipeline"
          onViewStage={onViewStage}
          onViewCompany={onViewCompany}
          salesRepId={salesRepId}
        />
      </div>

      {/* ✅ Followups BELOW Pipeline */}
      <div style={{ marginTop: "30px" }}>
        <Followups
          title="My Follow-ups"
          salesRepId={salesRepId}
        />
      </div>
      <DemoBookings salesRepId={salesRepId} />

      {/* ✅ Companies Table */}
      <div style={{ marginTop: "30px" }}>
        <CompaniesTable
          onView={onViewCompany}
          onAddCompany={onAddCompany}
          title="🏢 My Companies"
          searchPlaceholder="Search my companies"
          addLabel="Add Lead"
          salesRepId={salesRepId}
        />
      </div>
    </div>
  );
}