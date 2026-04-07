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
      const res = await axios.get(
        "http://localhost:5000/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
        }
      );

      alert("Profile updated");
      setEditMode(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg rounded-4" style={{ maxWidth: "500px", margin: "auto" }}>
        <div className="text-center mb-3">
          <img
            src="https://i.pravatar.cc/100"
            className="rounded-circle mb-3"
            alt="avatar"
          />
          <h4>{user.name}</h4>
          <p className="text-muted">{user.email}</p>
        </div>

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