import { useState, useEffect } from "react";
import axios from "axios";

function AccountSettings() {
  const [user, setUser] = useState(null);
  const [emailNotify, setEmailNotify] = useState(true);
  const [smsNotify, setSmsNotify] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  return (
    <div className="container mt-5">
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{ maxWidth: "600px", margin: "auto" }}
      >
        <h4 className="mb-4 text-center">⚙️ Account Settings</h4>

        {/* Profile Info */}
        <div className="mb-4 text-center">
          <img
            src={
              user?.avatar
                ? `http://localhost:5000${user.avatar}`
                : "https://i.pravatar.cc/100"
            }
            className="rounded-circle mb-2"
            width="80"
            height="80"
            alt="avatar"
          />
          <h5>{user?.name}</h5>
          <p className="text-muted small">{user?.email}</p>
        </div>

        <hr />

        {/* Notification Settings */}
        <h6 className="mb-3">🔔 Notification Preferences</h6>

        <div className="form-check mb-2">
          <input
            type="checkbox"
            className="form-check-input"
            checked={emailNotify}
            onChange={() => setEmailNotify(!emailNotify)}
          />
          <label className="form-check-label">Email Notifications</label>
        </div>

        <div className="form-check mb-4">
          <input
            type="checkbox"
            className="form-check-input"
            checked={smsNotify}
            onChange={() => setSmsNotify(!smsNotify)}
          />
          <label className="form-check-label">SMS Notifications</label>
        </div>

        <hr />

        {/* Account Info */}
        <h6 className="mb-3">📄 Account Info</h6>

        <p className="mb-1">
          <strong>Role:</strong> {user?.role}
        </p>

        <p className="mb-4">
          <strong>User ID:</strong> {user?.id}
        </p>

        <hr />

        {/* Danger Zone */}
        <h6 className="text-danger">⚠️ Danger Zone</h6>

        <button className="btn btn-outline-danger w-100 mt-2">
          Delete Account (Coming Soon)
        </button>
      </div>
    </div>
  );
}

export default AccountSettings;