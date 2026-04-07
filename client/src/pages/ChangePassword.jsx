import { useState } from "react";
import axios from "axios";

function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        "http://localhost:5000/api/users/change-password",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Password changed successfully 😌");
      setForm({ oldPassword: "", newPassword: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Error changing password");
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card p-4 shadow-lg rounded-4"
        style={{ maxWidth: "450px", margin: "auto" }}
      >
        <h3 className="text-center mb-3">Change Password</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Old Password</label>
            <input
              type="password"
              name="oldPassword"
              className="form-control"
              value={form.oldPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              className="form-control"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary w-100">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;