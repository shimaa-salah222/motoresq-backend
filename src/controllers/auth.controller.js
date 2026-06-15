const User = require("../models/user.model");
const Device = require("../models/device.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================
// REGISTER
// ==========================
exports.register = async (req, res) => {
  try {
    const { name, email, password, device_id } = req.body;

    if (!name || !email || !password || !device_id) {
      return res.status(400).json({
        message: "Name, email, password and device_id are required ❌"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters ❌" });
    }

    // التحقق إن الجهاز مش مربوط بمستخدم تاني
    const existingDevice = await Device.findOne({ device_id });
    if (existingDevice && existingDevice.user) {
      return res.status(400).json({
        message: "Device already linked to another user ❌"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // إنشاء أو تحديث الجهاز وربطه بالمستخدم
    let device = await Device.findOne({ device_id });
    if (!device) {
      device = await Device.create({
        device_id,
        user: user._id
      });
    } else {
      device.user = user._id;
      await device.save();
    }

    // تحديث المستخدم بمرجع الجهاز
    user.device = device._id;
    await user.save();

    res.json({
      message: "User created and linked to device ✅",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        device_id: device.device_id
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==========================
// LOGIN
// ==========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required ❌" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password ❌" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful ✅",
      token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==========================
// GET ME (PROFILE)
// ==========================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("device");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found ❌" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        device: user.device,
        created_at: user.createdAt
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};