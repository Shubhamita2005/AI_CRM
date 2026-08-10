const express = require("express");
const cors = require("cors"); 

const dashboardRoutes = require("./routes/dashboard_routes");
const demoRoutes = require("./routes/demo_routes");
const negotiationRoutes = require("./routes/negotiation_routes");
const googleAuthRoutes = require("./routes/google_auth_routes");

const app = express();

app.use(cors());  
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/demo-bookings", demoRoutes);
app.use("/api/negotiation-meetings", negotiationRoutes);
app.use("/api/auth", googleAuthRoutes);

module.exports = app;