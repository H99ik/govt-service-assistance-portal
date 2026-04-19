import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    totalRequests: 0,
    completed: 0,
    users: 0,
  });

  useEffect(() => {
    axios
      .get(
        "https://govt-service-assistance-portal.onrender.com/api/services/stats",
      )
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className="container-fluid py-5" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <div className="row align-items-center">
            {/* LEFT CONTENT */}
            <div className="col-md-7">
              <h3 className="fw-bold mb-3">
                Welcome to Government Service Portal
              </h3>

              <p className="text-muted" style={{ lineHeight: "1.8" }}>
                This portal provides easy access to various government services
                and certificates. Citizens can apply online, track their
                requests, and download certificates without visiting offices.
              </p>

              <p className="text-muted">
                Our mission is to bring transparency, efficiency, and
                accessibility to public services.
              </p>

              <div className="mt-4">
                <Link to="/services" className="btn btn-primary me-2">
                  Explore Services
                </Link>

                <Link to="/track" className="btn btn-dark">
                  Track by ID
                </Link>
              </div>
            </div>

            {/* RIGHT IMAGE + NOTICE */}
            <div className="col-md-5 mt-4 mt-md-0">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
                alt="service"
                className="img-fluid mb-3"
                style={{ maxHeight: "200px", objectFit: "contain" }}
              />

              <div className="card border-danger shadow-sm p-3">
                <h6 className="text-danger fw-bold">⚠ Important Notice</h6>
                <p className="small text-muted mb-0">
                  Do not trust any unauthorized websites or agents. Always use
                  official portal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 COUNTERS SECTION */}
      <div
        className="container mt-5 mb-5 p-4"
        style={{ background: "#f9f9f9", borderRadius: "10px" }}
      >
        <h4 className="fw-bold mb-4">Portal Statistics</h4>
        <div
          style={{
            width: "60px",
            height: "3px",
            background: "red",
            marginBottom: "20px",
          }}
        ></div>

        <div className="row g-4">
          {/* TOTAL REQUESTS */}
          <div className="col-md-3">
            <div
              className="card shadow-sm p-3 text-center"
              style={{ transition: "transform 0.3s ease" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <div className="mb-2">
                <i className="bi bi-file-earmark-text fs-3 text-primary"></i>
              </div>
              <p className="text-muted small">Total Applications</p>
              <h5 className="fw-bold text-primary">{stats.totalRequests}</h5>
            </div>
          </div>

          {/* COMPLETED */}
          <div className="col-md-3">
            <div
              className="card shadow-sm p-3 text-center"
              style={{ transition: "transform 0.3s ease" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <div className="mb-2">
                <i className="bi-check-circle fs-3 text-primary"></i>
              </div>
              <p className="text-muted small">Certificates Issued</p>
              <h5 className="fw-bold text-success">{stats.completed}</h5>
            </div>
          </div>

          {/* USERS */}
          <div className="col-md-3">
            <div
              className="card shadow-sm p-3 text-center"
              style={{ transition: "transform 0.3s ease" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <div className="mb-2">
                <i className="bi-person fs-3 text-primary"></i>
              </div>
              <p className="text-muted small">Registered Users</p>
              <h5 className="fw-bold text-danger">{stats.users}</h5>
            </div>
          </div>

          {/* EXTRA (future use) */}
          <div className="col-md-3">
            <div
              className="card shadow-sm p-3 text-center"
              style={{ transition: "transform 0.3s ease" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <div className="mb-2">
                <i className="bi-hourglass-split fs-3 text-primary"></i>
              </div>
              <p className="text-muted small">Active Requests</p>
              <h5 className="fw-bold text-dark">
                {stats.totalRequests - stats.completed}
              </h5>
            </div>
          </div>
        </div>

        <div className="container mb-5 mb-5 p-4">
          <h4 className="fw-bold mb-3">Popular Services</h4>

          <div
            style={{
              width: "60px",
              height: "3px",
              background: "red",
              marginBottom: "20px",
            }}
          ></div>

          <div className="row g-4">
            <div className="col-md-3">
              <Link
                to="/services/income-certificate"
                className="text-decoration-none"
              >
                <div
                  className="card p-3 text-center shadow-sm"
                  style={{ transition: "0.3s", cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <i className="bi bi-file-earmark-text fs-2 text-primary"></i>
                  <h6 className="mt-2">Income Certificate</h6>
                </div>
              </Link>
            </div>

            <div className="col-md-3">
              <Link
                to="/services/caste-certificate"
                className="text-decoration-none"
              >
                <div
                  className="card p-3 text-center shadow-sm"
                  style={{ transition: "0.3s", cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <i className="bi bi-person-badge fs-2 text-success"></i>
                  <h6 className="mt-2">Caste Certificate</h6>
                </div>
              </Link>
            </div>

            <div className="col-md-3">
              <Link to="/services/pan-card" className="text-decoration-none">
                <div
                  className="card p-3 text-center shadow-sm"
                  style={{ transition: "0.3s", cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <i className="bi bi-card-text fs-2 text-warning"></i>
                  <h6 className="mt-2">PAN Card</h6>
                </div>
              </Link>
            </div>

            <div className="col-md-3">
              <Link
                to="/services/birth-certificate"
                className="text-decoration-none"
              >
                <div
                  className="card p-3 text-center shadow-sm"
                  style={{ transition: "0.3s", cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <i className="bi bi-calendar-event fs-2 text-danger"></i>
                  <h6 className="mt-2">Birth Certificate</h6>
                </div>
              </Link>
            </div>
            <div className="text-center mt-4">
              <Link to="/services" className="btn btn-outline-primary">
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
