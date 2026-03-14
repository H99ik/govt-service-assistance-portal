import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        "http://localhost:5000/api/notifications/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setNotifications(res.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg px-4"
      style={{ backgroundColor: "#0B3D91", color: "white" }}
    >
      <Link
        className="navbar-brand fw-bold text-white d-flex align-items-center gap-2"
        to="/"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          fill="white"
          viewBox="0 0 16 16"
        >
          <path d="M8 0L1 3v2h14V3L8 0zM2 6v6h2V6H2zm3 0v6h2V6H5zm3 0v6h2V6H8zm3 0v6h2V6h-2zM1 13v2h14v-2H1z" />
        </svg>
        Govt Portal
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-4">
          <li className="nav-item">
            <Link to="/" className="nav-link text-white">
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/services" className="nav-link text-white">
              Services
            </Link>
          </li>
        </ul>
      </div>

      <div className="ms-auto d-flex align-items-center gap-3">
        {/* If user logged in */}
        {token && user ? (
          <>
            <Link to="/my-requests" className="nav-link text-dark fw-semibold">
              My Requests
            </Link>

            {/* Notification */}
            <div className="position-relative" style={{ cursor: "pointer" }}>
              <i className="bi bi-bell-fill text-white fs-5"></i>

              {notifications.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {notifications.length}
                </span>
              )}
            </div>

            {/* Profile */}
            <div className="dropdown">
              <img
                src="https://i.pravatar.cc/40"
                alt="profile"
                className="rounded-circle"
                width="36"
                height="36"
                style={{ cursor: "pointer" }}
                data-bs-toggle="dropdown"
              />

              <ul className="dropdown-menu dropdown-menu-end shadow">
                <li className="px-3 py-2 text-muted">
                  {user.name} ({user.role})
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <button className="dropdown-item">Profile</button>
                </li>

                <li>
                  <button className="dropdown-item">Account Settings</button>
                </li>

                <li>
                  <button className="dropdown-item">Change Password</button>
                </li>

                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-success">
              Login
            </Link>

            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
