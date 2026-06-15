process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("MotoResQ API is running");
});

// ✅ For Vercel (serverless)
module.exports = app;

// ✅ For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
  });
}