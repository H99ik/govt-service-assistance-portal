import { useEffect, useState } from "react";
import axios from "axios";

function MyRequests() {
  const [requests, setRequests] = useState([]);

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
        }
      );

      setRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>My Service Requests</h2>

      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        requests.map((req) => (
          <div key={req._id} className="card p-3 mb-3">
            <h5>{req.serviceType?.name}</h5>
            <p>{req.description}</p>
            <p>
              <strong>Status:</strong> {req.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyRequests;