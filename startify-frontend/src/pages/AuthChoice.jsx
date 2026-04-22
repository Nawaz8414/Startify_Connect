import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "../components/common.css";

export default function AuthChoice() {
  const navigate = useNavigate();

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

        {/* LOGIN SECTION */}
        <div className="choice-section">
          <h3 className="choice-heading">Login</h3>

          <button
            className="choice-btn primary"
            onClick={() =>
              navigate("/login", { state: { role: "institute" } })
            }
          >
            🏛️ Institute Login
          </button>

          <button
            className="choice-btn outline"
            onClick={() =>
              navigate("/login", { state: { role: "founder" } })
            }
          >
            🌍 Global Login
          </button>
        </div>

        <div className="choice-divider">
          <span>or</span>
        </div>

        {/* SIGNUP SECTION */}
        <div className="choice-section">
          <h3 className="choice-heading">New here?</h3>

          <button
            className="choice-btn primary"
            onClick={() =>
              navigate("/signup", { state: { role: "founder" } })
            }
          >
            🚀 Create New Account
          </button>

          <button
            className="choice-btn outline"
            onClick={() =>
              navigate("/signup", { state: { role: "institute" } })
            }
          >
            🏫 Institute Signup
          </button>
        </div>

      </div>
    </div>
  );
}