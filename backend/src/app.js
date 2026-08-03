const express = require("express");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.use("/api/dashboard", dashboardRoutes);

module.exports = app;