function Footer() {
  return (
    <footer className="text-white mt-5" style={{ backgroundColor: "#0B3D91" }}>
      <div className="container py-4">
        <div className="row">
          {/* Left */}
          <div className="col-md-6">
            <h5 className="fw-bold">Government Service Portal</h5>
            <p className="small">
              Providing easy and transparent access to government services.
            </p>
          </div>

          {/* Right */}
          <div className="col-md-6 text-md-end">
            <p className="mb-1">📧 support@govportal.com</p>
            <p className="mb-2">📞 +91 12345 67890</p>

            {/* Social Icons */}
            <div className="d-flex justify-content-md-end gap-3 mb-2">
              <i
                className="bi bi-facebook fs-5"
                style={{ cursor: "pointer" }}
              ></i>
              <i
                className="bi bi-twitter fs-5"
                style={{ cursor: "pointer" }}
              ></i>
              <i
                className="bi bi-instagram fs-5"
                style={{ cursor: "pointer" }}
              ></i>
              <i
                className="bi bi-linkedin fs-5"
                style={{ cursor: "pointer" }}
              ></i>
            </div>

            <p className="small mb-0">
              © {new Date().getFullYear()} Government Service Portal. All rights
              reserved.
            </p>
            <small style={{ opacity: 0.8 }}>Developed by HardikGiri</small>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
