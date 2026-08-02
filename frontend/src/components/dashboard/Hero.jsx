export default function Hero({
  title = "Good Morning 👋",
  subtitle = "Welcome back to FlowCRM AI. Monitor trial users, manage customer relationships, track conversions, and let AI help your sales team convert more free-trial customers into paying subscribers.",
}) {
  return (
    <div className="hero">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}