import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "http://localhost:5000/api/services/my-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <button className="btn btn-secondary" onClick={() => navigate(1)}>
          Forward →
        </button>
      </div>

      <h2 className="fw-bold mb-4">My Service Requests</h2>

      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        requests.map((req) => (
          <div key={req._id} className="card shadow-sm border-0 mb-3">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">
                  <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                  {req.serviceType?.name}
                </h5>

                <p className="text-muted mb-0">
                  {req.description || "Requested via portal"}
                </p>
              </div>

              <span
                className={`badge px-3 py-2 ${
                  req.status === "Completed"
                    ? "bg-success"
                    : req.status === "In Progress"
                      ? "bg-warning text-dark"
                      : req.status === "Pending"
                        ? "bg-secondary"
                        : "bg-danger"
                }`}
              >
                {req.status}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyRequests;
