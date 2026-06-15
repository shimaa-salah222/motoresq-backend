const Device = require("../models/device.model");
const Accident = require("../models/accident.model");
const { admin, firebaseInitialized } = require("../config/firebase");

// ==========================
// 1. UPDATE (ESP32)
// ==========================
exports.updateDevice = async (req, res) => {
  try {
    const { device_id, lat, lng, speed, accident } = req.body;

    if (!device_id) {
      return res.status(400).json({ message: "device_id required" });
    }

    let device = await Device.findOne({ device_id });

    if (!device) {
      device = new Device({ device_id });
    }

    device.lat = lat;
    device.lng = lng;
    device.speed = speed;
    device.accident = accident;
    device.last_seen = new Date();

    await device.save();

    // Accident Handling + Logging + Notification
    if (accident === true) {
      console.log("🚨 Accident detected!");

      await Accident.create({
        device_id,
        lat,
        lng,
        speed
      });

      if (firebaseInitialized && device.device_token) {
        try {
          await admin.messaging().send({
            notification: {
              title: "Accident Alert 🚨",
              body: "حادث تم اكتشافه!"
            },
            token: device.device_token
          });
          console.log("Notification sent ✅");
        } catch (err) {
          console.log("Notification error ❌", err.message);
        }
      } else {
        console.log("No device token found ❌");
      }
    }

    res.json({
      relay: device.relay_state,
      message: "Device updated successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================
// UPDATE HEART RATE
// ==========================
exports.updateHeartRate = async (req, res) => {
  try {
    const { device_id, heart_rate } = req.body;

    if (!device_id || heart_rate === undefined) {
      return res.status(400).json({
        success: false,
        message: "device_id and heart_rate required ❌"
      });
    }

    let device = await Device.findOne({ device_id });

    if (!device) {
      device = new Device({ device_id });
    }

    device.heart_rate = heart_rate;
    device.last_seen = new Date();
    await device.save();

    res.json({
      success: true,
      heart_rate: device.heart_rate,
      relay_state: device.relay_state,
      message: "Heart rate updated ✅"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

// ==========================
// GET STATUS
// ==========================
exports.getStatus = async (req, res) => {
  try {
    const { device_id } = req.params;

    const device = await Device.findOne({ device_id });

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    const now = new Date();
    const diff = now - device.last_seen;
    const isOnline = diff <= 90000;

    res.json({
      lat: device.lat,
      lng: device.lng,
      speed: device.speed,
      accident: device.accident,
      relay_state: device.relay_state,
      heart_rate: device.heart_rate,
      isOnline,
      last_seen: device.last_seen
    });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================
// RELAY CONTROL
// ==========================
exports.controlRelay = async (req, res) => {
  try {
    const { device_id, state } = req.body;

    const device = await Device.findOne({ device_id });

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    device.relay_state = state;
    await device.save();

    res.json({
      success: true,
      relay_state: device.relay_state
    });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================
// REGISTER TOKEN
// ==========================
exports.registerToken = async (req, res) => {
  try {
    const { device_id, token } = req.body;

    if (!device_id || !token) {
      return res.status(400).json({ message: "device_id and token required" });
    }

    const device = await Device.findOne({ device_id });

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    device.device_token = token;
    await device.save();

    res.json({
      success: true,
      message: "Token saved successfully"
    });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================
// GET ACCIDENTS BY DEVICE
// ==========================
exports.getAccidents = async (req, res) => {
  try {
    const { device_id } = req.params;

    const accidents = await Accident.find({ device_id })
      .sort({ timestamp: -1 });

    res.json(accidents);

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================
// GET ALL ACCIDENTS
// ==========================
exports.getAllAccidents = async (req, res) => {
  try {
    const accidents = await Accident.find().sort({ timestamp: -1 });
    res.json(accidents);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================
// DELETE ACCIDENT
// ==========================
exports.deleteAccident = async (req, res) => {
  try {
    const { id } = req.params;
    await Accident.findByIdAndDelete(id);
    res.json({ message: "Accident deleted ✅" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================
// RESOLVE ACCIDENT
// ==========================
exports.resolveAccident = async (req, res) => {
  try {
    const { id } = req.params;
    const accident = await Accident.findByIdAndUpdate(
      id,
      { resolved: true },
      { new: true }
    );
    res.json(accident);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ==========================
// GET STATS
// ==========================
exports.getStats = async (req, res) => {
  try {
    const totalAccidents = await Accident.countDocuments();
    const resolvedAccidents = await Accident.countDocuments({ resolved: true });
    const activeAccidents = await Accident.countDocuments({ resolved: false });
    const devices = await Device.countDocuments();

    res.json({
      totalAccidents,
      resolvedAccidents,
      activeAccidents,
      devices
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};