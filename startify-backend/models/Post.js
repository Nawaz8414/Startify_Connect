const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  username: String,

  role: {
    type: String,
    enum: ["founder", "institute"]
  },

  title: String,

  desc: String,

  tags: [String],

  likes: { type: Number, default: 0 },

  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]

},
{ timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);