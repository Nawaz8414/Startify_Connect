import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./common.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // 👈 back to landing
  };

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        🏢 Startify Connect
      </Link>

      <nav className="nav-links">
        {!user ? (
          <>
            {/* 🔁 Changed to /auth */}
            <Link to="/auth" className="nav-link">
              Log in
            </Link>
            <Link to="/auth" className="btn-primary">
              Get Started
            </Link>
          </>
        ) : (
          <>
            <span className="nav-user">Hi, {user.name}</span>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} className="btn-primary">
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
