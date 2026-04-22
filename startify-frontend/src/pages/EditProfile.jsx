import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { API_URL } from "../config";   // ✅ added
import "../components/common.css";

export default function EditProfile() {

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;   // ✅ safe

  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);   // ✅ added

  const token = localStorage.getItem("token");

  const handleUpdate = async () => {

    if (!token) {
      alert("You are not logged in");
      return;
    }

    try {
      setLoading(true);

      const bodyData = {
        name,
        email
      };

      if (password.trim() !== "") {
        bodyData.password = password;
      }

      const res = await fetch(`${API_URL}/api/users/update`, {  // ✅ fixed
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Update failed");
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Profile updated successfully");

      navigate("/profile");

    } catch (err) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      <div className="page-center">

        <div className="profile-card" style={{ maxWidth: "400px" }}>

          <h2 style={{ marginBottom: "20px" }}>Edit Profile</h2>

          <input
            className="input-field"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="input-field"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input-field"
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="btn-primary full"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}   {/* ✅ UX */}
          </button>

        </div>

      </div>

    </DashboardLayout>
  );
}