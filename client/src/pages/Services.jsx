import { useEffect, useState } from "react";
import axios from "axios";

function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/services");
      setServices(response.data.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleApply = async (serviceId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/services/request",
        {
          serviceType: serviceId,
          description: "Requested via portal",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Service request submitted!");
    } catch (error) {
      alert(error.response?.data?.message || "Request failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "1000px" }}>
      <h2 className="fw-bold text-center mb-4">Government Services</h2>
      <div className="row g-4">
        {services.map((service) => (
          <div className="col-md-6 col-lg-4" key={service._id}>
            <div className="card h-100 shadow-sm border-0 service-card">
              <div className="card-body text-center d-flex flex-column">
                <div className="mb-3">
                  <i className="bi bi-file-earmark-text fs-1 text-primary"></i>
                </div>

                <h5 className="fw-bold">{service.name}</h5>

                <p className="text-muted small">{service.description}</p>

                <p className="fw-bold">Charge: ₹{service.serviceCharge}</p>

                <button
                  className="btn btn-primary w-100 mt-auto"
                  onClick={() => handleApply(service._id)}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
