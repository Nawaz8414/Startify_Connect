import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/common.css";

export default function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to create a post.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5050/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          desc,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to create post");

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="auth-card">
        <h2>Create Post</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="text"
          placeholder="Startup / Idea Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          rows="4"
          placeholder="Describe your idea or what you're looking for..."
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />

        <input
          type="text"
          placeholder="Tags (comma separated, e.g. ai, fintech, hiring)"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />

        <button
          className="btn-primary full"
          onClick={handlePost}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
