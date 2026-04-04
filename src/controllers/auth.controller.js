const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================
// REGISTER
// ==========================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required ❌" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters ❌" });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.json({ message: "User created ✅" });

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

    // ✅ Validation
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

    // ✅ استخدام env بدل secret ثابت
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



