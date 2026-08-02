import { useState } from "react";
import "./App.css";

const companiesData = [
  {
    id: 1,
    name: "InnovateX",
    industry: "IT",
    size: "11-50",
    trial: "Day 12",
    score: 92,
    scoreClass: "high",
    status: "Active",
    statusClass: "active",
  },
  {
    id: 2,
    name: "HealthPlus",
    industry: "Healthcare",
    size: "51-200",
    trial: "Day 4",
    score: 28,
    scoreClass: "low",
    status: "Active",
    statusClass: "active",
  },
  {
    id: 3,
    name: "RetailMax",
    industry: "Retail",
    size: "201-500",
    trial: "Expired",
    score: 64,
    scoreClass: "medium",
    status: "Expired",
    statusClass: "expired",
  },
  {
    id: 4,
    name: "EduVerse",
    industry: "Education",
    size: "11-50",
    trial: "Converted",
    score: 97,
    scoreClass: "high",
    status: "Paid",
    statusClass: "converted",
  },
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
  const [searchValue, setSearchValue] = useState("");

  const openDrawer = (name) => {
    setDrawerCompany(name);
    setDrawerOpen(true);
  };

  const saveCompany = () => {
    setCompanyModalOpen(false);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const filteredCompanies = companiesData.filter((c) =>
    Object.values(c).join(" ").toLowerCase().includes(searchValue.toLowerCase())
  );

  const navItems = [
    { id: "dashboard", label: "🏠 Dashboard" },
    { id: "companies", label: "🏢 Companies" },
    { id: "meetings", label: "📅 Meetings" },
    { id: "activities", label: "📝 Activities" },
    { id: "insights", label: "🤖 AI Insights" },
    { id: "reports", label: "📊 Reports" },
    { id: "settings", label: "⚙ Settings" },
  ];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="container">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="logo">FlowCRM AI</div>
          <div className="tagline">Convert Smarter. Grow Faster.</div>
          <div className="menu">
            {navItems.map((item) => (
              <a
                key={item.id}
                className={activePage === item.id ? "active nav-link" : "nav-link"}
                onClick={() => setActivePage(item.id)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* MAIN */}
        <div className="main">
          <div className="navbar">
            <div className="search">
              <input type="text" placeholder="Search companies, contacts..." />
            </div>
            <div className="profile">
              <div className="notification" onClick={() => setNotifyOpen(!notifyOpen)}>
                🔔
              </div>
              <div className="avatar">SM</div>
            </div>
          </div>

          <div className="content">
            {/* DASHBOARD */}
            {activePage === "dashboard" && (
              <div className="page active" id="dashboard">
                <div className="hero">
                  <h1>Good Morning 👋</h1>
                  <p>
                    Welcome back to FlowCRM AI. Monitor trial users, manage customer
                    relationships, track conversions, and let AI help your sales team
                    convert more free-trial customers into paying subscribers.
                  </p>
                </div>

                <div className="stats">
                  <div className="stat-card">
                    <div className="stat-title">Trial Users</div>
                    <div className="stat-number">28</div>
                    <div className="stat-growth">↑ 12%</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-title">Conversion Rate</div>
                    <div className="stat-number">72%</div>
                    <div className="stat-growth">↑ 5%</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-title">Revenue Potential</div>
                    <div className="stat-number">₹1.2L</div>
                    <div className="stat-growth">↑ 18%</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-title">Meetings</div>
                    <div className="stat-number">12</div>
                    <div className="stat-growth">Today</div>
                  </div>
                </div>

                <div className="dashboard-row">
                  <div className="pipeline">
                    <h2>Sales Pipeline</h2>
                    <div className="pipeline-grid">
                      <div className="stage">
                        <h3>Lead</h3>
                        <div className="deal">
                          <h4>NovaTech</h4>
                          <p>New Signup</p>
                        </div>
                      </div>
                      <div className="stage">
                        <h3>Trial</h3>
                        <div className="deal">
                          <h4>HealthPlus</h4>
                          <p>Day 5</p>
                        </div>
                        <div className="deal">
                          <h4>RetailMax</h4>
                          <p>Day 8</p>
                        </div>
                      </div>
                      <div className="stage">
                        <h3>Follow-up</h3>
                        <div className="deal">
                          <h4>FinEdge</h4>
                          <p>Email Scheduled</p>
                        </div>
                      </div>
                      <div className="stage">
                        <h3>Meeting</h3>
                        <div className="deal">
                          <h4>InnovateX</h4>
                          <p>Tomorrow 11:00 AM</p>
                        </div>
                      </div>
                      <div className="stage">
                        <h3>Converted</h3>
                        <div className="deal">
                          <h4>EduVerse</h4>
                          <p>Growth Plan</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="followups">
                    <h2>Upcoming Follow-ups</h2>
                    <div className="follow-item">
                      <div className="follow-avatar">AB</div>
                      <div className="follow-info">
                        <h4>ABC Technologies</h4>
                        <p>Meeting Tomorrow</p>
                      </div>
                    </div>
                    <div className="follow-item">
                      <div className="follow-avatar">HP</div>
                      <div className="follow-info">
                        <h4>HealthPlus</h4>
                        <p>Inactive for 5 Days</p>
                      </div>
                    </div>
                    <div className="follow-item">
                      <div className="follow-avatar">FE</div>
                      <div className="follow-info">
                        <h4>FinEdge</h4>
                        <p>Upgrade Opportunity</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="companies">
                  <div className="companies-header">
                    <h2>🏢 Companies</h2>
                    <div className="company-actions">
                      <input
                        type="text"
                        placeholder="Search company"
                        id="search"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                      />
                      <button onClick={() => setCompanyModalOpen(true)}>Add Company</button>
                    </div>
                  </div>
                  <table className="company-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Industry</th>
                        <th>Size</th>
                        <th>Trial</th>
                        <th>AI Score</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCompanies.map((c) => (
                        <tr key={c.id}>
                          <td className="company-name">{c.name}</td>
                          <td>{c.industry}</td>
                          <td>{c.size}</td>
                          <td>{c.trial}</td>
                          <td className={`score ${c.scoreClass}`}>{c.score}%</td>
                          <td>
                            <span className={`status ${c.statusClass}`}>{c.status}</span>
                          </td>
                          <td>
                            <button className="view-btn" onClick={() => openDrawer(c.name)}>
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MEETINGS */}
            {activePage === "meetings" && (
              <div className="page active" id="meetings">
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
              <div className="page active" id="activities">
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
              <div className="page active" id="insights">
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
              <div className="page active" id="reports">
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
              <div className="page active" id="settings">
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

      {/* DRAWER */}
      <div className={drawerOpen ? "drawer open" : "drawer"} id="drawer">
        <span className="close" onClick={() => setDrawerOpen(false)}>
          ✖
        </span>
        <h2 id="companyTitle">{drawerCompany}</h2>
        <p>Healthcare • India • 11-50 Employees</p>

        <div className="drawer-card">
          <h3>AI Conversion Score</h3>
          <h1 style={{ color: "#403D88", marginTop: "10px" }}>92%</h1>
          <p style={{ marginTop: "10px" }}>High engagement and premium feature usage.</p>
        </div>

        <div className="drawer-card">
          <h3>Product Usage</h3>
          <p style={{ marginTop: "12px" }}>Projects Created</p>
          <div className="progress">
            <span style={{ width: "85%" }}></span>
          </div>
          <p style={{ marginTop: "18px" }}>Collaborators</p>
          <div className="progress">
            <span style={{ width: "72%" }}></span>
          </div>
          <p style={{ marginTop: "18px" }}>Storage Used</p>
          <div className="progress">
            <span style={{ width: "58%" }}></span>
          </div>
        </div>

        <div className="drawer-card">
          <h3>AI Recommendation</h3>
          <p style={{ marginTop: "12px", lineHeight: "1.8" }}>
            Contact this company within the next 24 hours. Generate a personalized pricing
            email and schedule an enterprise consultation.
          </p>
          <button className="ai-btn" onClick={() => setEmailModalOpen(true)}>
            Generate Email
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className={notifyOpen ? "notify-panel open" : "notify-panel"} id="notify">
        <h2>Notifications</h2>
        <br />
        <div className="notify-item">🔔 HealthPlus inactive for 5 days</div>
        <div className="notify-item">📅 Meeting with InnovateX tomorrow</div>
        <div className="notify-item">🚀 EduVerse upgraded to Premium</div>
      </div>

      {/* COPILOT */}
      {copilotOpen && (
        <div className="copilot" style={{ display: "block" }}>
          <div className="copilot-header">
            🤖 AI Copilot
            <span className="close-copilot" onClick={() => setCopilotOpen(false)}>
              ✖
            </span>
          </div>
          <div className="copilot-body">
            <div className="chat">
              <strong>You</strong>
              <br />
              Why is InnovateX at 92%?
            </div>
            <div className="chat">
              <strong>AI</strong>
              <br />
              InnovateX has high engagement, premium feature usage, and multiple
              collaborators. I recommend scheduling a pricing meeting tomorrow.
            </div>
          </div>
          <input placeholder="Ask AI anything..." />
        </div>
      )}

      {/* ADD COMPANY MODAL */}
      <div className={companyModalOpen ? "modal show" : "modal"} id="companyModal">
        <div className="modal-content">
          <h2>Add Company</h2>
          <input id="companyName" placeholder="Company Name" />
          <input placeholder="Industry" />
          <input placeholder="Company Size" />
          <input placeholder="Country" />
          <div className="modal-buttons">
            <button className="cancel" onClick={() => setCompanyModalOpen(false)}>
              Cancel
            </button>
            <button className="save" onClick={saveCompany}>
              Save
            </button>
          </div>
        </div>
      </div>

      {/* EMAIL MODAL */}
      <div className={emailModalOpen ? "modal show" : "modal"} id="emailModal">
        <div className="modal-content">
          <h2>AI Generated Email</h2>
          <p>
            Hi InnovateX Team,
            <br />
            <br />
            We noticed your team has been actively using FlowCRM AI. Based on your recent
            activity we'd love to schedule a quick demo of our Premium plan. Would Thursday
            at 11 AM work?
            <br />
            Regards,
            <br />
            Sales Team
          </p>
          <div className="modal-buttons">
            <button className="save" onClick={() => setEmailModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      </div>

      {/* TOAST */}
      <div className="toast" id="toast" style={{ display: toastVisible ? "block" : "none" }}>
        Company Added Successfully!
      </div>

      {/* COPILOT FLOATING BUTTON */}
      <div className="copilot-btn" onClick={() => setCopilotOpen(!copilotOpen)}>
        🤖
      </div>
    </div>
  );
}