import { useEffect, useState } from "react";
import axios from "axios";

function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/services"
      );
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
        }
      );

      alert("Service request submitted!");
    } catch (error) {
      alert(error.response?.data?.message || "Request failed");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Government Services</h1>

      {services.map((service) => (
        <div key={service._id} className="card p-3 mb-3">
          <h5>{service.name}</h5>
          <p>{service.description}</p>
          <p>Charge: ₹{service.serviceCharge}</p>

          <button
            className="btn btn-primary"
            onClick={() => handleApply(service._id)}
          >
            Apply Now
          </button>
        </div>
      ))}
    </div>
  );
}

export default Services;