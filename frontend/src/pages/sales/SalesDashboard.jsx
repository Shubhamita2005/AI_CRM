console.log("SalesDashboard file loaded");
import Hero from "../../components/dashboard/Hero";
import StatCard from "../../components/dashboard/StatCard";
import Pipeline from "../../components/dashboard/Pipeline";
import Followups from "../../components/dashboard/Followups";
import CompaniesTable from "../../components/dashboard/CompaniesTable";

const statCards = [
  { title: "My Trial Accounts", number: "9", growth: "↑ 2 this week" },
  { title: "My Conversion Rate", number: "68%", growth: "↑ 4%" },
  { title: "Quota Progress", number: "74%", growth: "₹87k / ₹1.2L" },
  { title: "My Meetings", number: "3", growth: "Today" },
];

export default function SalesDashboard(props) {
  console.log("SalesDashboard props:", props);

  const {
    onViewStage,
    onViewCompany,
    onAddCompany,
  } = props;
  console.log("SalesDashboard onViewStage:", onViewStage);
  return (
    <div className="page active">
      <Hero
        title="Good Morning, Sales Representative 👋"
        subtitle="Welcome back to FlowCRM AI. You have 3 trial accounts that need attention today. Let AI Copilot help you prioritize follow-ups, prep for meetings, and close more of your own pipeline."
      />

      <div className="stats">
        {statCards.map((s) => (
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