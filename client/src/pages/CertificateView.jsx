import { QRCodeCanvas } from "qrcode.react";

function CertificateView({ data }) {
  return (
    <div
      style={{
        width: "850px",
        margin: "auto",
        padding: "50px",
        border: "12px double #c9a646",
        background: "#fffdf5",
        fontFamily: "serif",
        position: "relative",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center" }}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png"
          alt="emblem"
          style={{ height: "60px", marginBottom: "10px" }}
        />

        <h2 style={{ fontWeight: "bold", margin: 0 }}>
          Government of India
        </h2>

        <p style={{ margin: 0 }}>Government Service Portal</p>

        <h1 style={{ marginTop: "20px", letterSpacing: "3px" }}>
          CERTIFICATE OF APPROVAL
        </h1>
      </div>

      {/* BODY */}
      <p style={{ marginTop: "40px", fontSize: "18px", textAlign: "center" }}>
        This is to certify that <strong>{data.name}</strong> has successfully
        completed the process for{" "}
        <strong>{data.service}</strong> under the Government Service Portal.
      </p>

      {/* DETAILS */}
      <div style={{ marginTop: "40px", fontSize: "16px" }}>
        <p>
          <strong>Certificate ID:</strong> {data.certificateId}
        </p>
        <p>
          <strong>Date of Issue:</strong> {data.date}
        </p>
      </div>

      {/* SIGNATURE + SEAL */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "80px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p>_____________________</p>
          <p>Authorized Officer</p>
        </div>

        <div style={{ textAlign: "center" }}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png"
            alt="seal"
            style={{ width: "70px", opacity: 0.8 }}
          />
          <p>Official Seal</p>
        </div>
      </div>

      {/* QR CODE */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "40px",
        }}
      >
        <QRCodeCanvas
          value={`http://localhost:5173/verify/${data.certificateId}`}
          size={90}
        />
      </div>
    </div>
  );
}

export default CertificateView;