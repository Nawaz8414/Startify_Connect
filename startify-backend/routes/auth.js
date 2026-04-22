const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// Signup
router.post("/signup", async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    // ✅ Institute email restriction
    if (role === "institute" && !email.endsWith("@bvrit.ac.in")) {
      return res.status(400).json({
        msg: "Institute accounts must use @bvrit.ac.in email"
      });
    }

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role
    });

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {

    console.error("Signup error:", err);

    res.status(500).json({
      msg: "Server error"
    });

  }
});


// Login
router.post("/login", async (req, res) => {
  try {

    const { email, password, role } = req.body;

    // ✅ Restrict institute login
    if (role === "institute" && !email.endsWith("@bvrit.ac.in")) {
      return res.status(400).json({
        msg: "Institute login requires @bvrit.ac.in email"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {

    console.error("Login error:", err);

    res.status(500).json({
      msg: "Server error"
    });

  }
});

module.exports = router;