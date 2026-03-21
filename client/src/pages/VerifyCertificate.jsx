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
        className="card shadow-lg p-4 text-center"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2 className="text-success mb-3">✅ Certificate Verified</h2>

        <p className="text-muted">
          This certificate is valid and issued by Government Service Portal
        </p>

        <hr />

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

        <div className="mt-4">
          <span className="badge bg-success px-3 py-2">✔ Verified</span>
        </div>
      </div>
    </div>
  );
}

export default VerifyCertificate;
