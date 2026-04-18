import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function VerifyCertificate() {
  const { certificateId } = useParams(); // ✅ FIXED
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/services/verify/${certificateId}`)
      .then((res) => setData(res.data.data))
      .catch((err) => console.log(err));
  }, [certificateId]);

  if (!data)
    return <h3 className="text-center mt-5">🔄 Verifying Certificate...</h3>;

  <h4 className="text-center mb-4 fw-bold text-primary">
    🇮🇳 Government Certificate Verification Portal
  </h4>;

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div
        className="card shadow-lg p-4 text-center border-0"
        style={{
          maxWidth: "600px",
          width: "100%",
          border: "2px solid #c9a646",
          borderRadius: "12px",
        }}
      >
        {/* HEADER */}
        <h5 className="fw-bold text-primary mb-2">🇮🇳 Government of India</h5>
        <p className="text-muted mb-3">Certificate Verification Portal</p>

        <hr />

        {/* STATUS */}
        <h3 className="text-success mb-3">✔ Certificate Verified</h3>

        <p className="text-muted">
          This certificate is officially verified and valid.
        </p>

        <hr />

        {/* DETAILS */}
        <div className="text-start mt-3">
          <p>
            <strong>👤 Name:</strong> {data.citizen?.name}
          </p>
          <p>
            <strong>📄 Service:</strong> {data.serviceType?.name}
          </p>
          <p>
            <strong>🆔 Certificate ID:</strong> {data.certificateId}
          </p>
        </div>

        {/* BADGE */}
        <div className="mt-4">
          <span
            className="badge px-4 py-2"
            style={{ background: "#0B3D91", fontSize: "14px" }}
          >
            ✔ Verified by Government Portal
          </span>
        </div>
      </div>
    </div>
  );
}

export default VerifyCertificate;
