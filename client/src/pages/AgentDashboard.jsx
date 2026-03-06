import { useEffect, useState } from "react";
import axios from "axios";

function AgentDashboard() {
  const [requests, setRequests] = useState([]);
  const [assignedRequests, setAssignedRequests] = useState([]);

  useEffect(() => {
    fetchPendingRequests();
    fetchAssignedRequests();
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

  const fetchAssignedRequests = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "http://localhost:5000/api/services/my-assigned",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAssignedRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching assigned requests:", error);
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

      fetchPendingRequests();
      fetchAssignedRequests(); // refresh list
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5000/api/services/update-status/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Status updated!");

      fetchPendingRequests();
      fetchAssignedRequests(); // refresh list
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
        requests
          .filter((req) => req.status === "Pending")
          .map((req) => (
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

      <h3 className="mt-5">My Assigned Requests</h3>

      {assignedRequests.length === 0 ? (
        <p>No assigned requests.</p>
      ) : (
        assignedRequests.map((req) => (
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

            {req.status === "In Progress" && (
              <button
                className="btn btn-primary"
                onClick={() => updateStatus(req._id, "Completed")}
              >
                Mark Completed
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default AgentDashboard;
