import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./common.css";

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // 👈 go to landing page
  };

  const navItem = (to, label, icon) => (
    <Link
      to={to}
      className={`side-item ${pathname === to ? "active" : ""}`}
    >
      <span>{icon}</span>
      {label}
    </Link>
  );

  return (
    <aside className="sidebar">
      <div>
        <div className="side-logo">🚀 Startify</div>

        <nav className="side-nav">
          {navItem("/dashboard", "Feed", "🏠")}
          {navItem("/messages", "Messages", "💬")}
          {navItem("/profile", "Profile", "👤")}
          {navItem("/post", "Create Post", "➕")}
          {navItem("/ai", "AI Assistant", "✨")}
        </nav>
      </div>

      {user && (
        <div className="side-user">
          <div className="side-user-info">
            <div className="avatar">
              {user.name?.[0] || "U"}
            </div>
            <div>
              <p className="user-name">{user.name}</p>
              <p className="user-mail">{user.email}</p>
            </div>
          </div>

          <button
            className="btn-primary full"
            onClick={handleLogout}
            style={{ marginTop: "10px" }}
          >
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}
