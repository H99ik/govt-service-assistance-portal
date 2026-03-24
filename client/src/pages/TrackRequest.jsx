import { useState } from "react";
import axios from "axios";

function TrackRequest() {
  const [trackingId, setTrackingId] = useState("");
  const [data, setData] = useState(null);

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/services/track/${trackingId}`,
      );
      setData(res.data);
    } catch (err) {
      alert("Request not found");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Track Your Application</h3>

      <input
        type="text"
        placeholder="Enter Tracking ID"
        className="form-control my-3"
        value={trackingId}
        onChange={(e) => setTrackingId(e.target.value)}
      />

      <button className="btn btn-primary" onClick={handleSearch}>
        Track
      </button>

      {data && (
        <div className="mt-4">
          <p>Status: {data.status}</p>
          <p>Service: {data.serviceType?.name}</p>
        </div>
      )}
    </div>
  );
}

export default TrackRequest;
