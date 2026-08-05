import { useState, useEffect } from "react";
import Hero from "../../components/dashboard/Hero";
import StatCard from "../../components/dashboard/StatCard";
import Pipeline from "../../components/dashboard/Pipeline";
import Followups from "../../components/dashboard/Followups";
import CompaniesTable from "../../components/dashboard/CompaniesTable";
import { salesAPI } from "../../services/api";

export default function SalesDashboard(props) {
  const {
    onViewStage,
    onViewCompany,
    onAddCompany,
  } = props;

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSalesDashboardStats();
  }, []);

  const fetchSalesDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await salesAPI.getDashboardStats();

      const statCards = [
        {
          title: "My Trial Accounts",
          number: data.trialAccounts || 0,
          growth: `↑ ${data.newTrials || 0} this week`,
        },
        {
          title: "My Conversion Rate",
          number: `${data.conversionRate || 0}%`,
          growth: `↑ ${data.conversionGrowth || 0}%`,
        },
        {
          title: "Quota Progress",
          number: `${data.quotaProgress || 0}%`,
          growth: `₹${data.salesAchieved || 0} / ₹${data.salesTarget || 0}`,
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
      <Hero
        title="Good Morning, Sales Representative 👋"
        subtitle="Welcome back to FlowCRM AI. You have trial accounts that need attention today. Let AI Copilot help you prioritize follow-ups, prepare for meetings, and close more deals."
      />

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
          stats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
      </div>

      <div className="dashboard-row">
        <Pipeline
          title="My Pipeline"
          onViewStage={onViewStage}
          onViewCompany={onViewCompany}
        />

        <Followups title="My Follow-ups" />
      </div>

      <CompaniesTable
        onView={onViewCompany}
        onAddCompany={onAddCompany}
        title="🏢 My Companies"
        searchPlaceholder="Search my companies"
        addLabel="Add Lead"
      />
    </div>
  );
}