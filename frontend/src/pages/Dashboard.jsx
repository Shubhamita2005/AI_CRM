import Hero from "../components/dashboard/Hero";
import StatCard from "../components/dashboard/StatCard";
import Pipeline from "../components/dashboard/Pipeline";
import Followups from "../components/dashboard/Followups";
import CompaniesTable from "../components/dashboard/CompaniesTable";

const statCards = [
  { title: "Trial Users", number: "28", growth: "↑ 12%" },
  { title: "Conversion Rate", number: "72%", growth: "↑ 5%" },
  { title: "Revenue Potential", number: "₹1.2L", growth: "↑ 18%" },
  { title: "Meetings", number: "12", growth: "Today" },
];

export default function Dashboard({
  onView,
  onAddCompany,
  onViewStage,
  onViewCompany,
}) {
  return (
    <div className="page active">
      <Hero />

      <div className="stats">
        {statCards.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="dashboard-row">
        <Pipeline
          title="Sales Pipeline"
          onViewStage={onViewStage}
          onViewCompany={onViewCompany}
        />
        <Followups />
      </div>

      <CompaniesTable
        onView={onView}
        onAddCompany={onAddCompany}
      />
    </div>
  );
}