import React from "react";

function About() {
  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 rounded-4">
        <h2 className="text-center text-primary mb-3">
          🇮🇳 About Government Service Portal
        </h2>

        <p className="text-muted text-center mb-4">
          A digital platform to simplify access to essential government services.
        </p>

        <hr />

        <p>
          The Government Service Portal is designed to provide citizens with easy
          and transparent access to various government services such as certificate
          applications, status tracking, and document verification.
        </p>

        <p>
          This platform connects citizens with authorized agents and ensures
          efficient processing of requests with real-time updates and secure
          document handling.
        </p>

        <p>
          Our goal is to reduce manual effort, eliminate long queues, and promote
          digital governance under the Digital India initiative.
        </p>

        <div className="text-center mt-4">
          <strong>Empowering Citizens through Digital Services</strong>
        </div>
      </div>
    </div>
  );
}

export default About;