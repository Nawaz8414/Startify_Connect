const router = require("express").Router();
const Message = require("../models/Message");
const auth = require("../middleware/auth");

// Get conversation with a user
router.get("/:userId", auth, async (req, res) => {
  const myId = req.user.id;
  const otherId = req.params.userId;

  const msgs = await Message.find({
    $or: [
      { from: myId, to: otherId },
      { from: otherId, to: myId },
    ],
  }).sort({ createdAt: 1 });

  res.json(msgs);
});

// Send message
router.post("/", auth, async (req, res) => {
  const { to, text, toName } = req.body;

  const msg = await Message.create({
    from: req.user.id,
    to,
    fromName: req.user.name,
    toName: toName || "",
    text,
  });

  res.status(201).json(msg);
});

module.exports = router;
