import { useState } from "react";
import "./App.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Meetings from "./pages/Meetings";
import Activities from "./pages/Activities";
import Insights from "./pages/Insights";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";

import Drawer from "./components/overlays/Drawer";
import NotifyPanel from "./components/overlays/NotifyPanel";
import Copilot from "./components/overlays/Copilot";
import CompanyModal from "./components/overlays/CompanyModal";
import EmailModal from "./components/overlays/EmailModal";
import Toast from "./components/overlays/Toast";

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
        onSalesLogin={() => alert("Sales Representative dashboard coming soon!")}
      />
    );
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="container">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        <div className="main">
          <Navbar notifyOpen={notifyOpen} setNotifyOpen={setNotifyOpen} />

          <div className="content">
            {activePage === "dashboard" && (
              <Dashboard onView={openDrawer} onAddCompany={() => setCompanyModalOpen(true)} />
            )}

            {activePage === "meetings" && <Meetings />}

            {activePage === "activities" && <Activities />}

            {activePage === "insights" && (
              <Insights onGenerateEmail={() => setEmailModalOpen(true)} />
            )}

            {activePage === "reports" && <Reports />}

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

      <NotifyPanel open={notifyOpen} onClose={() => setNotifyOpen(false)} />

      <Copilot open={copilotOpen} setOpen={setCopilotOpen} />

      <CompanyModal
        open={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        onSave={saveCompany}
      />

      <EmailModal open={emailModalOpen} onClose={() => setEmailModalOpen(false)} />

      <Toast visible={toastVisible} message="Company Added Successfully!" />
    </div>
  );
}