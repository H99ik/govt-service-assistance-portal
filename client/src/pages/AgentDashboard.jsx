import { useEffect, useState } from "react";
import axios from "axios";

function AgentDashboard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "http://localhost:5000/api/services/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  const handleAccept = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5000/api/services/accept/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Request accepted!");

      fetchPendingRequests(); // refresh list
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5000/api/auth/update/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Status updated!");

      fetchPendingRequests();
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Agent Dashboard - Pending Requests</h2>

      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        requests.map((req) => (
          <div key={req._id} className="card p-3 mb-3">
            <h5>{req.serviceType?.name}</h5>

            <p>
              <strong>Description:</strong> {req.description}
            </p>

            <p>
              <strong>Citizen:</strong> {req.citizen?.name}
            </p>

            <p>
              <strong>Status:</strong> {req.status}
            </p>

            <div className="mt-2">
              {req.status === "Pending" && (
                <button
                  className="btn btn-success me-2"
                  onClick={() => handleAccept(req._id)}
                >
                  Accept
                </button>
              )}

              {req.status === "In Progress" && (
                <button
                  className="btn btn-primary"
                  onClick={() => updateStatus(req._id, "Completed")}
                >
                  Mark Completed
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AgentDashboard;
