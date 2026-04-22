import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../components/BackButton";
import "../components/common.css";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = location.state?.role || "founder"; // 👈 get role from AuthChoice

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");

    // frontend validation
    if (role === "institute" && !email.endsWith("@bvrit.ac.in")) {
      setError("Institute accounts must use @bvrit.ac.in email");
      return;
    }

    try {
      const res = await fetch("http://localhost:5050/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          name,
          email,
          password,
          role   // 👈 send role to backend
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || "Signup failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-center">
      <div className="auth-card" style={{ position: "relative" }}>
        <BackButton to="/auth" />

        <h2>Create Account</h2>

        {/* show selected role */}
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

        <button className="btn-primary full" onClick={handleSignup}>
          Sign Up
        </button>
      </div>
    </div>
  );
}