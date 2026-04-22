import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import "../components/common.css";

export default function Profile() {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateUser = () => {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    };

    updateUser();

    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <DashboardLayout>

      <div className="page-center">

        <div className="profile-card">

          <div className="profile-avatar">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>

          <h2>{user.name}</h2>
          <p>{user.email}</p>

          <button
            className="btn-primary"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>

        </div>

      </div>

    </DashboardLayout>
  );
}