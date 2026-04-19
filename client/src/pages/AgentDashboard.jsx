import { useEffect, useState } from "react";
import axios from "axios";

function AgentDashboard() {
  const [requests, setRequests] = useState([]);
  const [assignedRequests, setAssignedRequests] = useState([]);

  useEffect(() => {
    setRequests([]);
    setAssignedRequests([]);

    fetchPendingRequests();
    fetchAssignedRequests();
  }, []);

  const fetchPendingRequests = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "https://govt-service-assistance-portal.onrender.com/api/services/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setRequests(response.data.data.filter((req) => req.status === "Pending"));

      setAssignedRequests(
        response.data.data.filter((req) => req.status === "In Progress"),
      );
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      console.log("ERROR:", error.response?.data || error.message);
    }
  };

  const fetchAssignedRequests = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "https://govt-service-assistance-portal.onrender.com/api/services/my-assigned",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAssignedRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching assigned requests:", error);
      console.log("ERROR:", error.response?.data || error.message);
    }
  };

  const handleAccept = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `https://govt-service-assistance-portal.onrender.com/api/services/accept/${id}`,
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
        `https://govt-service-assistance-portal.onrender.com/api/services/update-status/${id}`,
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
          ?.filter((req) => req.status === "Pending")
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

              {req.documents?.length > 0 && (
                <div className="mb-2">
                  <strong>Uploaded Documents:</strong>

                  {req.documents.map((doc, index) => (
                    <div key={index}>
                      <a
                        href={`https://govt-service-assistance-portal.onrender.com/uploads/${doc}`}
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
                  <div className="d-flex gap-2 mt-2">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleAccept(req._id)}
                    >
                      Accept
                    </button>
                  </div>
                )}

                {req.status === "In Progress" && (
                  <div className="d-flex gap-2 mt-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => updateStatus(req._id, "SubmittedToAdmin")}
                    >
                      Submit
                    </button>
                  </div>
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

            <p className="badge bg-dark">Tracking ID: {req.trackingId}</p>

            {req.documents?.length > 0 && (
              <div className="mb-2">
                <strong>Uploaded Documents:</strong>

                {req.documents.map((doc, index) => (
                  <div key={index}>
                    <a
                      href={`https://govt-service-assistance-portal.onrender.com/uploads/${doc}`}
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
                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => updateStatus(req._id, "SubmittedToAdmin")}
                  >
                    Submit
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => updateStatus(req._id, "Rejected")}
                  >
                    Reject
                  </button>
                </div>

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
