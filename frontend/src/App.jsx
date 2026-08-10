import { useState, useEffect } from "react";
import "./App.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Meetings from "./pages/Meetings";
import Activities from "./pages/Activities";
import Settings from "./pages/Settings";
import StageDetail from "./pages/StageDetail";
import CompanyDetail from "./pages/Companydetail";

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

import { activitiesAPI } from "./services/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);

  const [pageView, setPageView] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCompany, setDrawerCompany] = useState(null);

  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [copilotOpen, setCopilotOpen] = useState(false);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const isSales = user?.role === "sales";
  const salesRepId = user?.id;

  /* ✅ Fetch notifications dynamically */
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]); // ✅ Fixed: was 'role', now 'user'

  const fetchNotifications = async () => {
    try {
      const data = await activitiesAPI.getFollowups(
        isSales ? salesRepId : null // ✅ Pass dynamic sales rep ID
      );
      setNotifications(data?.slice(0, 3) || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setNotifications([]);
    }
  };

  /* ✅ Drawer */
  const openDrawer = (companyId) => {
    setDrawerCompany(companyId);
    setDrawerOpen(true);
  };

  /* ✅ View Stage */
  const viewStage = (stageData) => {
    setPageView({ type: "stage", stage: stageData });
  };

  /* ✅ View Company */
  const viewCompany = (customer_id) => {
    if (!customer_id) {
      console.error("No customer_id provided to viewCompany");
      return;
    }

    console.log("Viewing company:", customer_id);

    setPageView({
      type: "company",
      customer_id: customer_id,
    });
  };

  const backToDashboard = () => setPageView(null);

  const goToPage = (page) => {
    setPageView(null);
    setActivePage(page);
  };

  const saveCompany = () => {
    setCompanyModalOpen(false);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  /* ✅ LOGIN SCREEN */
  if (!user) {
    return (
      <Login
        onManagerLogin={() => {
          setUser({ role: "manager", id: null });
          setActivePage("dashboard");
        }}
        onSalesLogin={(repId) => {
          setUser({ role: "sales", id: repId });
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
          setActivePage={goToPage}
          navItems={
            isSales
              ? [
                  { id: "dashboard", label: "🏠 Dashboard" },
                  { id: "companies", label: "🏢 My Companies" },
                  { id: "meetings", label: "📅 My Meetings" },
                  { id: "activities", label: "📝 My Activities" },
                  { id: "settings", label: "⚙ Settings" },
                ]
              : [
                  { id: "dashboard", label: "🏠 Dashboard" },
                  { id: "companies", label: "🏢 Companies" },
                 // { id: "meetings", label: "📅 Meetings" },
                  { id: "activities", label: "📝 Activities" },
                  { id: "settings", label: "⚙ Settings" },
                ]
          }
          tagline={
            isSales
              ? "Your accounts. Your quota. Your AI copilot."
              : "Convert Smarter. Grow Faster."
          }
        />

        <div className="main">
          <Navbar
            notifyOpen={notifyOpen}
            setNotifyOpen={setNotifyOpen}
            activePage={activePage}
            placeholder={
              isSales
                ? "Search my companies, contacts..."
                : "Search companies, contacts..."
            }
            avatarInitials={isSales ? "PG" : "SM"}
          />

          <div className="content">
            {/* ✅ STAGE VIEW */}
            {pageView?.type === "stage" && (
              <StageDetail
                stage={pageView.stage}
                onBack={backToDashboard}
                onViewCompany={viewCompany}
              />
            )}

            {/* ✅ COMPANY VIEW */}
            {pageView?.type === "company" && (
              <CompanyDetail
                companyId={pageView.customer_id}
                onBack={backToDashboard}
                onGenerateEmail={() => setEmailModalOpen(true)}
              />
            )}

            {/* ✅ DASHBOARD */}
            {!pageView &&
              activePage === "dashboard" &&
              (isSales ? (
                <SalesDashboard
                  onAddCompany={() => setCompanyModalOpen(true)}
                  onViewStage={viewStage}
                  onViewCompany={viewCompany}
                  salesRepId={salesRepId} // ✅ Pass dynamic ID
                />
              ) : (
                <Dashboard
                  onView={openDrawer}
                  onAddCompany={() => setCompanyModalOpen(true)}
                  onViewStage={viewStage}
                  onViewCompany={viewCompany}
                />
              ))}

           {!pageView && activePage === "meetings" && (
  <Meetings salesRepId={salesRepId} />
)}
            {!pageView && activePage === "activities" && <Activities />}
            {!pageView &&
              activePage === "reports" &&
              (isSales ? <SalesReports /> : null)}

            {!pageView && activePage === "settings" && (
              <Settings
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                onLogout={() => setUser(null)} // ✅ Fixed: was setRole
              />
            )}
          </div>
        </div>
      </div>

      {/* ✅ OVERLAYS */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        companyId={drawerCompany}
        onGenerateEmail={() => setEmailModalOpen(true)}
      />

      <NotifyPanel
        open={notifyOpen}
        onClose={() => setNotifyOpen(false)}
        items={notifications.map((n) => n.reason || n.action)}
      />

      <Copilot open={copilotOpen} setOpen={setCopilotOpen} />

      <CompanyModal
        open={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        onSave={saveCompany}
        title={isSales ? "Add Lead" : "Add Company"}
      />

      <EmailModal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
      />

      <Toast
        visible={toastVisible}
        message={
          isSales ? "Lead Added Successfully!" : "Company Added Successfully!"
        }
      />
    </div>
  );
}