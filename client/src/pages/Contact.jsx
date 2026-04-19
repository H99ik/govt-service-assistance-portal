import React from "react";

function Contact() {
  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 rounded-4">
        <h2 className="text-center text-primary mb-3">
          📞 Contact Us
        </h2>

        <p className="text-center text-muted mb-4">
          Reach out to us for any support or queries.
        </p>

        <hr />

        <div className="mt-3">
          <p><strong>📍 Address:</strong> CSC Center, Ahmedabad, Gujarat, India</p>
          <p><strong>📧 Email:</strong> support@govportal.in</p>
          <p><strong>📞 Phone:</strong> +91 1234567890</p>
          <p><strong>🕒 Working Hours:</strong> 9:30 AM – 6:00 PM</p>
        </div>

        <div className="mt-4">
          <iframe
            title="map"
            src="https://www.google.com/maps?q=Ahmedabad&output=embed"
            width="100%"
            height="200"
            style={{ border: 0, borderRadius: "10px" }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Contact;