import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [serviceData, setServiceData] = useState({
    name: "",
    description: "",
    requiredDocuments: "",
    estimatedTime: "",
    serviceCharge: "",
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/all-requests",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleChange = (e) => {
    setServiceData({
      ...serviceData,
      [e.target.name]: e.target.value,
    });
  };

  const createService = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/services",
        {
          ...serviceData,
          requiredDocuments: serviceData.requiredDocuments.split(","),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Service created successfully");

      setServiceData({
        name: "",
        description: "",
        requiredDocuments: "",
        estimatedTime: "",
        serviceCharge: "",
      });
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>

      {/* Create Service */}
      <div className="card p-3 mb-4">
        <h4>Create New Service</h4>

        <form onSubmit={createService}>
          <input
            className="form-control mb-2"
            placeholder="Service Name"
            name="name"
            value={serviceData.name}
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-2"
            placeholder="Description"
            name="description"
            value={serviceData.description}
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-2"
            placeholder="Required Documents (comma separated)"
            name="requiredDocuments"
            value={serviceData.requiredDocuments}
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-2"
            placeholder="Estimated Time"
            name="estimatedTime"
            value={serviceData.estimatedTime}
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-2"
            placeholder="Service Charge"
            name="serviceCharge"
            value={serviceData.serviceCharge}
            onChange={handleChange}
            required
          />

          <button className="btn btn-primary">Create Service</button>
        </form>
      </div>

      {/* All Requests */}
      <h4>All Service Requests</h4>

      {requests.length === 0 ? (
        <p>No requests available</p>
      ) : (
        requests.map((req) => (
          <div key={req._id} className="card p-3 mb-3">
            <h5>{req.serviceType?.name}</h5>

            <p>
              <strong>Citizen:</strong> {req.citizen?.name}
            </p>

            <p>
              <strong>Status:</strong> {req.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
