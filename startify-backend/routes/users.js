const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user.id } },
      "_id name email"
    );
    res.json(users);
  } catch (err) {
    console.error("Users fetch error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// 🔥 Update Profile (ADDED)
router.put("/update", auth, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;

    // If password provided → hash it
    if (password) {
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    );

    res.json({
      msg: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;