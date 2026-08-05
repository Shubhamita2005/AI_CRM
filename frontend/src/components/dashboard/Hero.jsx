export default function Hero({ title, subtitle, userName }) {
  // Optional: Get current time for dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 16) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="hero">
      <h1>{title || `${getGreeting()}, ${userName || "User"} 👋`}</h1>
      <p>Welcome back to FlowCRM AI. Monitor trial users, manage customer relationships, track conversions, and let AI help your sales team convert more free-trial customers into paying subscribers </p>
    </div>
  );
}