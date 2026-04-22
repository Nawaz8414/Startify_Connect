const router = require("express").Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");


// Get ALL posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Fetch posts error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// 🌍 Get Global (Founder) Posts
router.get("/global", async (req, res) => {

  try {

    const posts = await Post.find({ role: "founder" })
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {

    res.status(500).json({ msg: "Server error" });

  }

});


// 🏫 Get Institute Posts
router.get("/institute", async (req, res) => {

  try {

    const posts = await Post.find({ role: "institute" })
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {

    res.status(500).json({ msg: "Server error" });

  }

});


// Get logged-in user's posts
router.get("/me", auth, async (req, res) => {
  try {

    const posts = await Post.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {

    console.error("Fetch user posts error:", err);

    res.status(500).json({ msg: "Server error" });

  }
});


router.post("/", auth, async (req, res) => {

  try {

    const { title, desc, tags } = req.body;

    const post = await Post.create({

      user: req.user.id,

      username: req.user.name,

      role: req.user.role,   // ⭐ important

      title,
      desc,
      tags

    });

    res.status(201).json(post);

  } catch (err) {

    res.status(500).json({ msg: "Server error" });

  }

});

// ❤️ Toggle Like / Dislike
router.put("/:id/like", auth, async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const userId = req.user.id;

    const alreadyLiked = post.likedBy.some(
      id => id.toString() === userId
    );

    if (alreadyLiked) {

      post.likes = Math.max(post.likes - 1, 0);

      post.likedBy = post.likedBy.filter(
        id => id.toString() !== userId
      );

    } else {

      post.likes += 1;

      post.likedBy.push(userId);

    }

    await post.save();

    res.json({
      likes: post.likes,
      likedBy: post.likedBy
    });

  } catch (err) {

    console.error("Like error:", err);

    res.status(500).json({
      msg: "Server error"
    });

  }
});


// Delete post
router.delete("/:id", auth, async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this post" });
    }

    await post.deleteOne();

    res.json({ msg: "Post deleted successfully" });

  } catch (err) {

    console.error("Delete post error:", err);

    res.status(500).json({ msg: "Server error" });

  }
});

module.exports = router;