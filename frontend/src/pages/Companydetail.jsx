const companiesData = [
  {
    name: "InnovateX",
    industry: "IT",
    size: "11-50",
    location: "India",
    score: 92,
    conversionSummary: "High engagement and premium feature usage.",
    usage: {
      projects: 85,
      collaborators: 72,
      storage: 58,
    },
    recommendation:
      "Contact this company within the next 24 hours. Generate a personalized pricing email and schedule an enterprise consultation.",
  },
  {
    name: "HealthPlus",
    industry: "Healthcare",
    size: "51-200",
    location: "India",
    score: 28,
    conversionSummary:
      "Low engagement — no login activity in the past 5 days.",
    usage: {
      projects: 20,
      collaborators: 15,
      storage: 12,
    },
    recommendation:
      "Send a re-engagement email highlighting unused features and offer a personalized onboarding call.",
  },
  {
    name: "RetailMax",
    industry: "Retail",
    size: "201-500",
    location: "India",
    score: 64,
    conversionSummary:
      "Moderate engagement during trial, but the trial period has now expired.",
    usage: {
      projects: 50,
      collaborators: 40,
      storage: 35,
    },
    recommendation:
      "Offer a trial extension or a discounted first-month plan to re-engage before the lead goes cold.",
  },
  {
    name: "EduVerse",
    industry: "Education",
    size: "11-50",
    location: "India",
    score: 97,
    conversionSummary:
      "Fully converted to the Growth Plan with excellent adoption across the team.",
    usage: {
      projects: 95,
      collaborators: 88,
      storage: 70,
    },
    recommendation:
      "Check in quarterly and look for upsell opportunities as their team grows.",
  },
  {
    name: "NovaTech",
    industry: "Technology",
    size: "1-10",
    location: "India",
    score: 40,
    conversionSummary:
      "Just signed up — too early to assess engagement.",
    usage: {
      projects: 5,
      collaborators: 3,
      storage: 4,
    },
    recommendation:
      "Send a welcome email with a quick-start guide to drive early activation.",
  },
  {
    name: "FinEdge",
    industry: "Finance",
    size: "51-200",
    location: "India",
    score: 71,
    conversionSummary:
      "Good engagement, a follow-up email has already been scheduled.",
    usage: {
      projects: 60,
      collaborators: 45,
      storage: 38,
    },
    recommendation:
      "Follow up on the scheduled email with a pricing call to move them toward conversion.",
  },
  {
    name: "ABC Technologies",
    industry: "IT",
    size: "11-50",
    location: "India",
    score: 80,
    conversionSummary:
      "Strong engagement, meeting scheduled for tomorrow.",
    usage: {
      projects: 70,
      collaborators: 55,
      storage: 48,
    },
    recommendation:
      "Use the upcoming meeting to walk through premium plan benefits.",
  },
];

export default function CompanyDetail({
  companyName,
  onBack,
  onGenerateEmail,
}) {
  const company = companiesData.find((c) => c.name === companyName);

  if (!company) {
    return (
      <div className="page active">
        <div className="companies">
          <div className="companies-header">
            <h2>Company Not Found</h2>
            <button className="ai-btn" onClick={onBack}>
              ←
            </button>
          </div>

          <p style={{ color: "var(--gray)" }}>
            Detailed information for this company isn't available yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page active">
      <div className="companies">
        <div className="companies-header">
          <h2>{company.name}</h2>
          <button className="ai-btn" onClick={onBack}>
            ← 
          </button>
        </div>

        <p style={{ color: "var(--gray)", marginBottom: "20px" }}>
          {company.industry} • {company.location} • {company.size} Employees
        </p>

        <div className="drawer-card">
          <h3>AI Conversion Score</h3>
          <h1 style={{ color: "#403D88", marginTop: "10px" }}>
            {company.score}%
          </h1>
          <p style={{ marginTop: "10px" }}>
            {company.conversionSummary}
          </p>
        </div>

        <div className="drawer-card">
          <h3>Product Usage</h3>

          <p style={{ marginTop: "12px" }}>Projects Created</p>
          <div className="progress">
            <span
              style={{ width: `${company.usage.projects}%` }}
            ></span>
          </div>

          <p style={{ marginTop: "18px" }}>Collaborators</p>
          <div className="progress">
            <span
              style={{ width: `${company.usage.collaborators}%` }}
            ></span>
          </div>

          <p style={{ marginTop: "18px" }}>Storage Used</p>
          <div className="progress">
            <span
              style={{ width: `${company.usage.storage}%` }}
            ></span>
          </div>
        </div>

        <div className="drawer-card">
          <h3>AI Recommendation</h3>
          <p style={{ marginTop: "12px", lineHeight: "1.8" }}>
            {company.recommendation}
          </p>

          <button
            className="ai-btn"
            onClick={onGenerateEmail}
          >
            Generate Email
          </button>
        </div>
      </div>
    </div>
  );
}