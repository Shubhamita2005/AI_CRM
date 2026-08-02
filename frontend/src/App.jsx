import { useState } from "react";
import "./App.css";

import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";

import Hero from "./components/dashboard/Hero";
import StatCard from "./components/dashboard/StatCard";
import Pipeline from "./components/dashboard/Pipeline";
import Followups from "./components/dashboard/Followups";
import CompaniesTable from "./components/dashboard/CompaniesTable";

import Drawer from "./components/overlays/Drawer";
import NotifyPanel from "./components/overlays/NotifyPanel";
import Copilot from "./components/overlays/Copilot";
import CompanyModal from "./components/overlays/CompanyModal";
import EmailModal from "./components/overlays/EmailModal";
import Toast from "./components/overlays/Toast";

const statCards = [
  { title: "Trial Users", number: "28", growth: "↑ 12%" },
  { title: "Conversion Rate", number: "72%", growth: "↑ 5%" },
  { title: "Revenue Potential", number: "₹1.2L", growth: "↑ 18%" },
  { title: "Meetings", number: "12", growth: "Today" },
];

export default function App() {
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

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="container">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        <div className="main">
          <Navbar notifyOpen={notifyOpen} setNotifyOpen={setNotifyOpen} />

          <div className="content">
            {/* DASHBOARD */}
            {activePage === "dashboard" && (
              <div className="page active">
                <Hero />

                <div className="stats">
                  {statCards.map((s) => (
                    <StatCard key={s.title} {...s} />
                  ))}
                </div>

                <div className="dashboard-row">
                  <Pipeline />
                  <Followups />
                </div>

                <CompaniesTable
                  onView={openDrawer}
                  onAddCompany={() => setCompanyModalOpen(true)}
                />
              </div>
            )}

            {/* MEETINGS */}
            {activePage === "meetings" && (
              <div className="page active">
                <div className="meetings">
                  <h2>📅 Customer Meetings</h2>
                  <br />
                  <div className="meeting-card">
                    <div className="meeting-info">
                      <h3>InnovateX</h3>
                      <div className="meeting-type">Pricing Consultation</div>
                    </div>
                    <div className="meeting-time">Tomorrow • 11:00 AM</div>
                  </div>
                  <div className="meeting-card">
                    <div className="meeting-info">
                      <h3>FinEdge</h3>
                      <div className="meeting-type">Enterprise Discussion</div>
                    </div>
                    <div className="meeting-time">Friday • 2:30 PM</div>
                  </div>
                  <div className="meeting-card">
                    <div className="meeting-info">
                      <h3>RetailMax</h3>
                      <div className="meeting-type">Follow-up Call</div>
                    </div>
                    <div className="meeting-time">Monday • 10:00 AM</div>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVITIES */}
            {activePage === "activities" && (
              <div className="page active">
                <div className="activities">
                  <h2>📝 Recent Activities</h2>
                  <div className="timeline">
                    <div className="activity">
                      <h4>Meeting Completed</h4>
                      <p>Pricing discussion completed with InnovateX.</p>
                    </div>
                    <div className="activity">
                      <h4>AI Recommendation</h4>
                      <p>
                        HealthPlus has not logged in for five days. Suggested sending a
                        re-engagement email.
                      </p>
                    </div>
                    <div className="activity">
                      <h4>New Trial Started</h4>
                      <p>NovaTech signed up for a 14-day free trial.</p>
                    </div>
                    <div className="activity">
                      <h4>Subscription Converted</h4>
                      <p>EduVerse upgraded to the Growth Plan.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI INSIGHTS */}
            {activePage === "insights" && (
              <div className="page active">
                <div className="ai-insights">
                  <h2>AI Insights</h2>
                  <div className="ai-grid">
                    <div className="ai-box">
                      <h3>InnovateX</h3>
                      <div className="ai-score">92%</div>
                      <p>Likely to Convert</p>
                      <ul>
                        <li>17 active users</li>
                        <li>12 projects</li>
                        <li>Premium features enabled</li>
                        <li>Daily logins</li>
                      </ul>
                      <button className="ai-btn" onClick={() => setEmailModalOpen(true)}>
                        Generate Email
                      </button>
                    </div>
                    <div className="ai-box">
                      <h3>HealthPlus</h3>
                      <div className="ai-score">28%</div>
                      <p>Needs Attention</p>
                      <ul>
                        <li>No login for 5 days</li>
                        <li>Low collaboration</li>
                        <li>No meetings scheduled</li>
                      </ul>
                      <button className="ai-btn">Re-engage User</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* REPORTS */}
            {activePage === "reports" && (
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
            )}

            {/* SETTINGS */}
            {activePage === "settings" && (
              <div className="page active">
                <div className="settings">
                  <h2>Settings</h2>
                  <br />
                  <button className="ai-btn" onClick={() => setDarkMode(!darkMode)}>
                    Toggle Dark Mode
                  </button>
                </div>
              </div>
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

      <NotifyPanel open={notifyOpen} />

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