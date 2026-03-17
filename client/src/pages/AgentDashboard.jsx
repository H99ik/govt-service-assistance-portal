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
    if (status === "Completed") {
      if (!window.confirm("Are you sure the documents are valid?")) return;
    }
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
        requests?.map((req) => (
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

            {req.documents?.length > 0 && (
              <div className="mb-2">
                <strong>Uploaded Documents:</strong>

                {req.documents.map((doc, index) => (
                  <div key={index}>
                    <a
                      href={`http://localhost:5000/uploads/${doc}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Document {index + 1}
                    </a>
                  </div>
                ))}
              </div>
            )}

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
                  onClick={() => updateStatus(req._id, "SubmittedToAdmin")}
                >
                  Submit to Admin
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

            {req.documents?.length > 0 && (
              <div className="mb-2">
                <strong>Uploaded Documents:</strong>

                {req.documents.map((doc, index) => (
                  <div key={index}>
                    <a
                      href={`http://localhost:5000/uploads/${doc}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Document {index + 1}
                    </a>
                  </div>
                ))}
              </div>
            )}

            {req.status === "In Progress" && (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => updateStatus(req._id, "SubmittedToAdmin")}
                >
                  Submit to Admin
                </button>
                <button
                  className="btn btn-secondary ms-2"
                  onClick={() => updateStatus(req._id, "Rejected")}
                >
                  Reject
                </button>

                {req.status === "Rejected" && (
                  <span className="badge bg-danger">Rejected</span>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default AgentDashboard;
