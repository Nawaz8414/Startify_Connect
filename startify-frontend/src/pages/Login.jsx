import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../components/BackButton";
import { API_URL } from "../config";   // ✅ added
import "../components/common.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = location.state?.role || "founder";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ added

  // 🔒 Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleLogin = async () => {
    setError("");

    // frontend validation
    if (role === "institute" && !email.endsWith("@bvrit.ac.in")) {
      setError("Institute login requires @bvrit.ac.in email");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/login`, {  // ✅ fixed
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="auth-card" style={{ position: "relative" }}>
        <BackButton to="/auth" />

        <h2>Welcome Back</h2>

        <p style={{ color: "#64748b", marginBottom: "10px" }}>
          Logging in as <b>{role}</b>
        </p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          className="btn-primary full"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </div>
    </div>
  );
}