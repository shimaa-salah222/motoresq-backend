const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  device_id: { type: String, required: true, unique: true },
  lat: Number,
  lng: Number,
  speed: Number,
  accident: Boolean,
  relay_state: { type: Boolean, default: false },
  last_seen: { type: Date, default: Date.now },

  device_token: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model("Device", deviceSchema);