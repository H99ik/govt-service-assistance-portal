import { useEffect, useState } from "react";
import axios from "axios";

function App() {
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

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Government Services</h1>

      {services.length === 0 ? (
        <p>No services available</p>
      ) : (
        services.map((service) => (
          <div
            key={service._id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              margin: "20px 0",
              borderRadius: "8px",
            }}
          >
            <h2>{service.name}</h2>
            <p>{service.description}</p>
            <p><strong>Estimated Time:</strong> {service.estimatedTime}</p>
            <p><strong>Charge:</strong> ₹{service.serviceCharge}</p>
            <p>
              <strong>Required Documents:</strong>{" "}
              {service.requiredDocuments.join(", ")}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;