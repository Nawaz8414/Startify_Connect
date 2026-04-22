import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import "../components/common.css";

export default function EditProfile() {

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");

  const token = localStorage.getItem("token");

  const handleUpdate = async () => {

    try {
      // ✅ Only send password if user entered it
      const bodyData = {
        name,
        email
      };

      if (password.trim() !== "") {
        bodyData.password = password;
      }

      const res = await fetch("http://localhost:5050/api/users/update", {
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

      // ✅ Update localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Profile updated successfully");

      navigate("/profile");

    } catch (err) {
      alert(err.message);
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
          >
            Save Changes
          </button>

        </div>

      </div>

    </DashboardLayout>
  );
}