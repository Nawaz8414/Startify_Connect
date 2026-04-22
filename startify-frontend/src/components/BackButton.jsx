import { useNavigate } from "react-router-dom";
import "./common.css";

export default function BackButton({ to }) {
  const navigate = useNavigate();

  return (
    <button
      className="back-btn"
      onClick={() => (to ? navigate(to) : navigate(-1))}
    >
      ← Back
    </button>
  );
}
