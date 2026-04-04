const Device = require("../models/device.model");
const { admin, firebaseInitialized } = require("../config/firebase");
const Accident = require("../models/accident.model");

// ==========================
// 1. UPDATE (ESP32)
// ==========================
exports.updateDevice = async (req, res) => {
  try {
    const { device_id, lat, lng, speed, accident } = req.body;

    let device = await Device.findOne({ device_id });

    if (!device) {
      device = new Device({ device_id });
    }

    device.lat = lat;
    device.lng = lng;
    device.speed = speed;
    device.accident = accident;
    device.last_seen = new Date();

if (!device_id) {
  return res.status(400).json({ message: "device_id required" });
}

// 🔥 Accident Handling + Logging + Notification
if (accident === true) {
  console.log("🚨 Accident detected!");


  // 🧾 تسجيل الحادث في الداتابيز
  await Accident.create({
    device_id,
    lat,
    lng,
    speed
  });

  // 🔔 إرسال Notification لو فيه token
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

    await device.save();

    res.json({
     relay: device.relay_state,
     message: "Device updated successfully"
   });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


// ==========================
// 2. GET STATUS (Flutter)
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
      isOnline,
      last_seen: device.last_seen
    });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


// ==========================
// 3. RELAY CONTROL (Flutter)
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

//-----------------------
///register token
//-------------------------
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

//-----------------
//get accident
//-----------------------
exports.getAccidents = async (req, res) => {
  try {
    const { device_id } = req.params;

    const accidents = await Accident.find({ device_id })
      .sort({ timestamp: -1 }); // الأحدث الأول

    res.json(accidents);

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};