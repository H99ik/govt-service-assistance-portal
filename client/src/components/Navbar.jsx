import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">
        Govt Portal
      </Link>

      <div className="ms-auto d-flex align-items-center">
        {token && user && (
          <span className="text-white me-3">
            {user.name} ({user.role})
          </span>
        )}

        {token ? (
          <>
            <Link to="/my-requests" className="btn btn-info me-2">
              My Requests
            </Link>

            {user.role === "agent" && (
              <Link to="/agent-dashboard" className="btn btn-warning me-2">
                Agent Dashboard
              </Link>
            )}

            {user?.role === "admin" && (
              <Link to="/admin-dashboard" className="btn btn-light me-2">
                Admin Dashboard
              </Link>
            )}

            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-success me-2">
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
