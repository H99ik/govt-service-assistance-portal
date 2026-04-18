import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [editMode, setEditMode] = useState(false);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.user);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        "http://localhost:5000/api/users/profile",
        {
          name: user.name,
          phone: user.phone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Profile updated");
      setEditMode(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card p-4 shadow-lg rounded-4"
        style={{ maxWidth: "500px", margin: "auto" }}
      >
        {/* 🔥 PROFILE HEADER */}
        <div className="text-center mb-3">
          {/* Avatar with edit icon */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={
                user.avatar
                  ? `http://localhost:5000${user.avatar}`
                  : "https://i.pravatar.cc/100"
              }
              className="rounded-circle"
              alt="avatar"
              width="100"
              height="100"
            />

            {editMode && (
              <label
                style={{
                  position: "absolute",
                  bottom: "5px",
                  right: "5px",
                  background: "#0B3D91",
                  color: "white",
                  borderRadius: "50%",
                  padding: "6px 8px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                ✏️
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const formData = new FormData();
                    formData.append("avatar", file);

                    const token = localStorage.getItem("token");

                    try {
                      const res = await axios.post(
                        "http://localhost:5000/api/auth/upload-avatar",
                        formData,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                          },
                        },
                      );

                      const updatedUser = {
                        ...user,
                        avatar: res.data.avatar,
                      };

                      setUser(updatedUser);
                      localStorage.setItem("user", JSON.stringify(updatedUser));
                    } catch (err) {
                      alert("Upload failed");
                    }
                  }}
                />
              </label>
            )}
          </div>

          <h4 className="mt-2">{user.name}</h4>
          <p className="text-muted">{user.email}</p>
        </div>

        {/* 🔥 FORM */}
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            name="name"
            className="form-control rounded-3"
            value={user.name}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>

        <div className="mb-3">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            className="form-control rounded-3"
            value={user.phone}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>

        {/* 🔥 BUTTON */}
        {!editMode ? (
          <button
            className="btn btn-primary w-100 rounded-3 fw-semibold"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        ) : (
          <button
            className="btn btn-success w-100 rounded-3 fw-semibold"
            onClick={handleUpdate}
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
