require("dotenv").config();

const app = require("./src/app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.listen(PORT, () => {//THIS is where requests start entering. Starts HTTP server on PORT
        console.log(`Server running on http://localhost:${PORT}`);
      });
      