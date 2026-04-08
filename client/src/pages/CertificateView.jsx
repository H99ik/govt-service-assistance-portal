function CertificateView({ data }) {
  return (
    <div
      style={{
        width: "800px",
        margin: "auto",
        padding: "40px",
        border: "10px solid #c9a646",
        background: "#fffdf5",
        fontFamily: "serif",
      }}
    >
      <div className="text-center">
        <h2 style={{ fontWeight: "bold" }}>
          Government Service Portal
        </h2>
        <p>Government of India</p>

        <h1 style={{ marginTop: "20px", letterSpacing: "2px" }}>
          CERTIFICATE
        </h1>
      </div>

      <p style={{ marginTop: "30px", fontSize: "18px" }}>
        This is to certify that <strong>{data.name}</strong>
      </p>

      <p>
        has successfully applied for <strong>{data.service}</strong>
      </p>

      <p>
        Certificate ID: <strong>{data.certificateId}</strong>
      </p>

      <p>
        Issued Date: <strong>{data.date}</strong>
      </p>

      <div className="d-flex justify-content-between mt-5">
        <div>
          <p>________________</p>
          <p>Authorized Officer</p>
        </div>

        <div>
          <p>________________</p>
          <p>Department Seal</p>
        </div>
      </div>
    </div>
  );
}

export default CertificateView;