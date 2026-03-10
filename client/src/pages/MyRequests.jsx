import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

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
        },
      );

      setRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const uploadDocument = async (requestId) => {
    const token = localStorage.getItem("token");

    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post(
        `http://localhost:5000/api/services/upload/${requestId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert("Document uploaded successfully!");
      fetchRequests(); // Refresh the requests to show the new document
      setSelectedFile(null); // Clear the selected file
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <button className="btn btn-secondary" onClick={() => navigate(1)}>
          Forward →
        </button>
      </div>

      <h2 className="fw-bold mb-4">My Service Requests</h2>

      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        requests.map((req) => (
          <div key={req._id} className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="mb-1">
                    <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                    {req.serviceType?.name}
                  </h5>

                  <p className="text-muted mb-0">
                    {req.description || "Requested via portal"}
                  </p>
                </div>

                <span
                  className={`badge px-3 py-2 ${
                    req.status === "Completed"
                      ? "bg-success"
                      : req.status === "In Progress"
                        ? "bg-warning text-dark"
                        : req.status === "Pending"
                          ? "bg-secondary"
                          : "bg-danger"
                  }`}
                >
                  {req.status}
                </span>
              </div>

              {/* Upload Section */}

              {req.status === "In Progress" && (
                <div className="d-flex gap-2 mt-3">
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />

                  <button
                    className="btn btn-primary"
                    onClick={() => uploadDocument(req._id)}
                  >
                    Upload
                  </button>
                </div>
              )}

              {/* Show Uploaded Documents */}

              {req.documents && req.documents.length > 0 && (
                <div className="mt-3">
                  <strong>Uploaded Documents:</strong>

                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    {req.documents.map((doc, index) => {
                      const fileUrl = `http://localhost:5000/uploads/${doc}`;

                      return (
                        <div key={index} className="d-flex gap-2">
                          {/* Preview Button */}
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                          >
                            👁 Preview
                          </a>

                          {/* Download Button */}
                          <a
                            href={fileUrl}
                            download
                            className="btn btn-sm btn-outline-success"
                          >
                            ⬇ Download
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyRequests;
