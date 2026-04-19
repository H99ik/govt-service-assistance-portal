import { QRCodeCanvas } from "qrcode.react";

function CertificateView({ data }) {
  return (
    <div
      style={{
        width: "850px",
        margin: "auto",
        padding: "40px 50px",
        border: "12px double #c9a646",
        background: "#fffdf5",
        fontFamily: "serif",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center" }}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png"
          alt="emblem"
          style={{ height: "60px", marginBottom: "10px" }}
        />

        <h2 style={{ margin: 0, fontWeight: "bold" }}>GOVERNMENT OF INDIA</h2>

        <p style={{ margin: 0 }}>Government Service Portal</p>

        <h1
          style={{
            marginTop: "20px",
            letterSpacing: "3px",
            fontSize: "28px",
          }}
        >
          CERTIFICATE
        </h1>
      </div>

      {/* DETAILS */}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <p style={{ margin: "2px" }}>Certificate No: {data.certificateId}</p>
        <p style={{ margin: "2px" }}>Date: {data.date}</p>
      </div>

      {/* BODY */}
      <div style={{ marginTop: "25px", textAlign: "center" }}>
        <p>This is to certify that</p>

        <h2
          style={{
            fontWeight: "bold",
            fontSize: "30px",
            margin: "10px 0",
            textTransform: "capitalize",
          }}
        >
          {data.citizen?.name ||
            data.citizen?.email?.split("@")[0] ||
            "Citizen"}
        </h2>

        <p>has successfully applied for</p>

        <h3 style={{ margin: "10px 0" }}>{data.serviceType?.name}</h3>

        <p>under the Government Service Portal.</p>
      </div>

      {/* BOTTOM SECTION */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: "60px",
          padding: "0 60px",
        }}
      >
        {/* LEFT - QR */}
        <div style={{ textAlign: "center" }}>
          <QRCodeCanvas
            value={`https://govt-service-assistance-portal.vercel.app/verify/${data.certificateId}`}
            size={80}
          />
          <p style={{ fontSize: "11px", marginTop: "5px" }}>Scan to Verify</p>
        </div>

        {/* RIGHT - SIGNATURE */}
        <div style={{ textAlign: "center" }}>
          <p style={{ marginBottom: "5px" }}>_____________________</p>
          <p>Authorized Officer</p>
        </div>
      </div>
    </div>
  );
}

export default CertificateView;
