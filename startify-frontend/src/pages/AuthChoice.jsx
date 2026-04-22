import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "../components/common.css";

export default function AuthChoice() {
  const navigate = useNavigate();

  const goTo = (path, role) => {
    navigate(path, { state: { role } });
  };

  return (
    <div className="page-center">
      <div className="choice-card big">

        {/* ⬅ Back */}
        <BackButton to="/" />

        <h1 className="choice-title">
          Choose How You Want to Continue
        </h1>

        <p className="choice-sub">
          Login if you already have an account, or create a new one to get started
        </p>

        {/* LOGIN */}
        <div className="choice-section">
          <h3 className="choice-heading">Login</h3>

          <button
            className="choice-btn primary"
            onClick={() => goTo("/login", "institute")}
          >
            🏛️ Institute Login
          </button>

          <button
            className="choice-btn outline"
            onClick={() => goTo("/login", "founder")}
          >
            🌍 Global Login
          </button>
        </div>

        <div className="choice-divider">
          <span>or</span>
        </div>

        {/* SIGNUP */}
        <div className="choice-section">
          <h3 className="choice-heading">New here?</h3>

          <button
            className="choice-btn primary"
            onClick={() => goTo("/signup", "founder")}
          >
            🚀 Create New Account
          </button>

          <button
            className="choice-btn outline"
            onClick={() => goTo("/signup", "institute")}
          >
            🏫 Institute Signup
          </button>
        </div>

      </div>
    </div>
  );
}