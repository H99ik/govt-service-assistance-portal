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

    if (!token) return;

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
      const interval = setInterval(() => {
        fetchNotifications();
      }, 5000); // every 5 sec

      return () => clearInterval(interval);
    }
  }, [localStorage.getItem("token")]); // refetch when token changes

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNotificationClick = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        "http://localhost:5000/api/notifications/mark-read",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // clear badge instantly
      //setNotifications([]);
      fetchNotifications(); // Refresh notifications to update the list and badge
    } catch (error) {
      console.error("Error marking notifications:", error);
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg px-4"
      style={{
        backgroundColor: "#0B3D91",
        position: "fixed",
        top: "0",
        width: "100%",
        color: "white",
        zIndex: "1000",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }}
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

            {user?.role === "agent" && (
              <Link to="/agent-dashboard" className="nav-link text-white">
                Agent Dashboard
              </Link>
            )}

            {user?.role === "admin" && (
              <Link to="/admin-dashboard" className="nav-link text-white">
                Admin Dashboard
              </Link>
            )}

            {/* Notification */}
            <div className="position-relative" style={{ cursor: "pointer" }}>
              <div className="dropdown">
                <i
                  className="bi bi-bell-fill text-white fs-5"
                  data-bs-toggle="dropdown"
                  onClick={handleNotificationClick}
                  style={{ cursor: "pointer" }}
                ></i>

                <ul
                  className="dropdown-menu dropdown-menu-end shadow p-2"
                  style={{
                    width: "320px",
                    maxHeight: "250px",
                    overflowY: "auto",
                    overflowX: "hidden",
                    wordWrap: "break-word",
                  }}
                >
                  {notifications.length === 0 ? (
                    <li>No notifications</li>
                  ) : (
                    notifications.map((n, index) => (
                      <li
                        key={index}
                        className={`small mb-2 border-bottom p-2 ${!n.isRead ? "fw-bold" : "text-muted"}`}
                        style={{
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {n.message}
                        <br />
                        <small>{new Date(n.createdAt).toLocaleString()}</small>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {notifications.filter((n) => !n.isRead).length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {notifications.filter((n) => !n.isRead).length}
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
