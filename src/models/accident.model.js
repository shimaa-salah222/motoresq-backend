const mongoose = require("mongoose");

const accidentSchema = new mongoose.Schema({
  device_id: String,
  lat: Number,
  lng: Number,
  speed: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Accident", accidentSchema);