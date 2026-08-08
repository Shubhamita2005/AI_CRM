const express = require("express");
const cors = require("cors"); 
const dashboardRoutes = require("./routes/dashboard_routes");
const demoRoutes = require("./routes/demo_routes");

const app = express();

app.use(cors());  
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/demo-bookings", demoRoutes);

module.exports = app;