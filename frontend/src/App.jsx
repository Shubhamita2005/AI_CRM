import { useState } from "react";
import "./App.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Meetings from "./pages/Meetings";
import Activities from "./pages/Activities";
import Insights from "./pages/Insights";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import SalesDashboard from "./pages/sales/SalesDashboard";
import SalesReports from "./pages/sales/SalesReports";

import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";

import Drawer from "./components/overlays/Drawer";
import NotifyPanel from "./components/overlays/NotifyPanel";
import Copilot from "./components/overlays/Copilot";
import CompanyModal from "./components/overlays/CompanyModal";
import EmailModal from "./components/overlays/EmailModal";
import Toast from "./components/overlays/Toast";

const managerNavItems = [
  { id: "dashboard", label: "🏠 Dashboard" },
  { id: "companies", label: "🏢 Companies" },
  { id: "meetings", label: "📅 Meetings" },
  { id: "activities", label: "📝 Activities" },
  { id: "insights", label: "🤖 AI Insights" },
  { id: "reports", label: "📊 Reports" },
  { id: "settings", label: "⚙ Settings" },
];

const salesNavItems = [
  { id: "dashboard", label: "🏠 Dashboard" },
  { id: "companies", label: "🏢 My Companies" },
  { id: "meetings", label: "📅 My Meetings" },
  { id: "activities", label: "📝 My Activities" },
  { id: "insights", label: "🤖 AI Insights" },
  { id: "reports", label: "📈 My Performance" },
  { id: "settings", label: "⚙ Settings" },
];

const salesNotifyItems = [
  "🔔 Your account HealthPlus is inactive for 5 days",
  "📅 Your meeting with InnovateX is tomorrow",
  "🚀 Your deal EduVerse upgraded to Premium",
];

export default function App() {
  const [role, setRole] = useState(null); // null | "manager" | "sales"
  const [activePage, setActivePage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCompany, setDrawerCompany] = useState("InnovateX");

  const [notifyOpen, setNotifyOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const isSales = role === "sales";

  const openDrawer = (name) => {
    setDrawerCompany(name);
    setDrawerOpen(true);
  };

  const saveCompany = () => {
    setCompanyModalOpen(false);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  if (!role) {
    return (
      <Login
        onManagerLogin={() => {
          setRole("manager");
          setActivePage("dashboard");
        }}
        onSalesLogin={() => {
          setRole("sales");
          setActivePage("dashboard");
        }}
      />
    );
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="container">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          navItems={isSales ? salesNavItems : managerNavItems}
          tagline={isSales ? "Your accounts. Your quota. Your AI copilot." : "Convert Smarter. Grow Faster."}
        />

        <div className="main">
          <Navbar
            notifyOpen={notifyOpen}
            setNotifyOpen={setNotifyOpen}
            placeholder={isSales ? "Search my companies, contacts..." : "Search companies, contacts..."}
            avatarInitials={isSales ? "PG" : "SM"}
          />

          <div className="content">
            {activePage === "dashboard" &&
              (isSales ? (
                <SalesDashboard
                  onView={openDrawer}
                  onAddCompany={() => setCompanyModalOpen(true)}
                />
              ) : (
                <Dashboard onView={openDrawer} onAddCompany={() => setCompanyModalOpen(true)} />
              ))}

            {activePage === "meetings" && (
              <Meetings title={isSales ? "📅 My Meetings" : "📅 Customer Meetings"} />
            )}

            {activePage === "activities" && (
              <Activities title={isSales ? "📝 My Recent Activities" : "📝 Recent Activities"} />
            )}

            {activePage === "insights" && (
              <Insights
                onGenerateEmail={() => setEmailModalOpen(true)}
                title={isSales ? "🤖 AI Insights for My Accounts" : "AI Insights"}
              />
            )}

            {activePage === "reports" && (isSales ? <SalesReports /> : <Reports />)}

            {activePage === "settings" && (
              <Settings
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                onLogout={() => setRole(null)}
              />
            )}
          </div>
        </div>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        company={drawerCompany}
        onGenerateEmail={() => setEmailModalOpen(true)}
      />

      <NotifyPanel
        open={notifyOpen}
        onClose={() => setNotifyOpen(false)}
        items={isSales ? salesNotifyItems : undefined}
      />

      <Copilot open={copilotOpen} setOpen={setCopilotOpen} />

      <CompanyModal
        open={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        onSave={saveCompany}
        title={isSales ? "Add Lead" : "Add Company"}
      />

      <EmailModal open={emailModalOpen} onClose={() => setEmailModalOpen(false)} />

      <Toast
        visible={toastVisible}
        message={isSales ? "Lead Added Successfully!" : "Company Added Successfully!"}
      />
    </div>
  );
}