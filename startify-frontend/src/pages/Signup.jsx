import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../components/BackButton";
import { API_URL } from "../config";   // ✅ added
import "../components/common.css";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = location.state?.role || "founder";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ added

  const handleSignup = async () => {
    setError("");

    if (role === "institute" && !email.endsWith("@bvrit.ac.in")) {
      setError("Institute accounts must use @bvrit.ac.in email");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/signup`, { // ✅ fixed URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || "Signup failed");

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

        <h2>Create Account</h2>

        <p style={{ color: "#64748b", marginBottom: "10px" }}>
          Signing up as <b>{role}</b>
        </p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

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
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"} {/* ✅ better UX */}
        </button>
      </div>
    </div>
  );
}