import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import FeedCard from "../components/FeedCard";
import "../components/common.css";

export default function Dashboard() {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [feedType, setFeedType] = useState("all"); // all | global | institute


  const fetchPosts = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {

      const res = await fetch(
        `http://localhost:5050/api/posts/${feedType === "all" ? "" : feedType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setPosts(data);
      setLoading(false);

    } catch (err) {

      console.error("Fetch posts error:", err);
      setLoading(false);

    }

  };


  useEffect(() => {
    fetchPosts();
  }, [feedType]);


  // ❤️ Like / Dislike
  const handleLike = async (postId) => {

    const token = localStorage.getItem("token");

    try {

      const res = await fetch(
        `http://localhost:5050/api/posts/${postId}/like`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || "Like failed");

      setPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? { ...post, likes: data.likes, likedBy: data.likedBy }
            : post
        )
      );

    } catch (err) {
      console.error("Like error:", err);
    }

  };


  // 🗑 Delete Post
  const handleDelete = async (postId) => {

    const token = localStorage.getItem("token");

    if (!window.confirm("Delete this post?")) return;

    try {

      const res = await fetch(
        `http://localhost:5050/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setPosts(prev => prev.filter(p => p._id !== postId));

    } catch (err) {
      alert(err.message);
    }

  };


  return (
    <DashboardLayout>

      {/* Feed Switch */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>

        <button
          className={`btn-primary small ${feedType === "all" ? "active" : ""}`}
          onClick={() => setFeedType("all")}
        >
          📢 All Posts
        </button>

        <button
          className={`btn-primary small ${feedType === "global" ? "active" : ""}`}
          onClick={() => setFeedType("global")}
        >
          🌍 Global Posts
        </button>

        <button
          className={`btn-primary small ${feedType === "institute" ? "active" : ""}`}
          onClick={() => setFeedType("institute")}
        >
          🏫 Institute Posts
        </button>

      </div>


      <div className="dashboard-top">

        <input
          className="search"
          placeholder="Search startups, ideas, founders..."
        />

        <select className="filter">
          <option>All Categories</option>
          <option>AI</option>
          <option>FinTech</option>
          <option>HealthTech</option>
        </select>

      </div>


      {loading ? (
        <p>Loading feed...</p>
      ) : (

        <div className="feed-list">

          {posts.map(post => (

            <FeedCard
              key={post._id}
              post={post}
              onLike={handleLike}
              onDelete={handleDelete}
            />

          ))}

        </div>

      )}

    </DashboardLayout>
  );
}