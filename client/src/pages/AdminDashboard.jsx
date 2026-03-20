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
    fetchServices();
  }, []);

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "http://localhost:5000/api/services/admin-requests",
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
      fetchServices();

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

  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/services");
      setServices(res.data.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const deleteService = async (id) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Delete this service?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Service deleted");
      fetchServices();
    } catch (error) {
      console.error(error);
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

      alert("Status updated successfully");

      // refresh admin requests
      fetchRequests();
    } catch (error) {
      console.error("Status update error:", error);
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
      <h4 className="mt-4">Manage Services</h4>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Charge</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {services.map((service) => (
            <tr key={service._id}>
              <td>{service.name}</td>
              <td>₹{service.serviceCharge}</td>
              <td>{service.estimatedTime}</td>

              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteService(service._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

            <p className="badge bg-dark">Tracking ID: {req.trackingId}</p>

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

            {req.status === "SubmittedToAdmin" && (
              <div className="mt-2">
                <button
                  className="btn btn-success me-2"
                  onClick={() => updateStatus(req._id, "Completed")}
                >
                  Approve & Generate Certificate
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => updateStatus(req._id, "Rejected")}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
