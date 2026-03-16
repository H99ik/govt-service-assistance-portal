import { Link } from "react-router-dom";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="container-fluid mt-5">
      {/* Hero Section */}
      <div
        className="text-center py-5 mb-5"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,153,51,0.15), rgba(255,255,255,0.9), rgba(19,136,8,0.15))",
          borderRadius: "10px",
        }}
      >
        <h1 className="fw-bold">Government Service Portal</h1>

        <p className="text-muted mt-2">
          Apply for government certificates and services easily online.
        </p>

        <div className="mt-4 d-flex justify-content-center gap-3">
          <Link to="/services" className="btn btn-primary me-2">
            Browse Services
          </Link>
          {token ? (
          <Link to="/my-requests" className="btn btn-outline-primary">
            Track Application
          </Link>
         ) : (
          <Link to="/login" className="btn btn-outline-primary">
            Login to Apply
          </Link>
        )}
        </div>
      </div>
    </div>
  );
}

export default Home;
