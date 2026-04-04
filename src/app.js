const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/device.routes"));
app.use("/api/auth", require("./routes/auth.routes"));

module.exports = app;

app.get("/", (req, res) => {
  res.send("🚀 MotoResQ API is running");
});