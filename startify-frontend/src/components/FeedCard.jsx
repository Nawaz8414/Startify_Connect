import { useNavigate } from "react-router-dom";

export default function FeedCard({ post, onLike, onDelete }) {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // check if current user liked the post
  const liked = post.likedBy?.some(
    id => id.toString() === user.id
  );

  return (
    <div className="feed-card-ui">

      <div className="feed-head">

        <div className="feed-avatar">
          {post.username?.[0] || "U"}
        </div>

        <div>
          <b>{post.username}</b>

          <div className="feed-time">
            {new Date(post.createdAt).toLocaleString()}
          </div>
        </div>

        {/* Delete button (only post owner) */}
        {user?.id === post.user && (
          <button
            className="delete-btn"
            onClick={() => onDelete(post._id)}
          >
            🗑️
          </button>
        )}

      </div>


      <h3 className="feed-title">
        {post.title}
      </h3>


      <p className="feed-desc">
        {post.desc}
      </p>


      <div className="feed-tags">
        {post.tags?.map((tag, i) => (
          <span key={i}>#{tag}</span>
        ))}
      </div>


      <div className="feed-actions">

        {/* ❤️ Like Button */}
        <span
          style={{
            cursor: "pointer",
            color: liked ? "#ef4444" : "#374151",
            fontWeight: "500"
          }}
          onClick={() => onLike(post._id)}
        >
          ❤️ {post.likes || 0}
        </span>


        {/* 💬 Connect Button */}
        <button
          className="btn-primary small"
          onClick={() => navigate(`/messages/${post.user}`)}
        >
          💬 Connect
        </button>

      </div>

    </div>
  );
}