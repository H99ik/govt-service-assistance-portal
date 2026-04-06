import { Routes, Route } from "react-router-dom";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import MyRequests from "./pages/MyRequests";
import AgentDashboard from "./pages/AgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import VerifyCertificate from "./pages/VerifyCertificate";
import Footer from "./components/Footer";
import DigitalIndiaLogo from "./assets/digital_india.png";
import TrackRequest from "./pages/TrackRequest";
import VerifyOTP from "./pages/VerifyOTP";
import LoginOTP from "./pages/LoginOTP";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyResetOtp from "./pages/VerifyResetOtp";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <>
      {/* 🔥 FIXED HEADER WRAPPER */}
      <div
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
        }}
      ></div>

      {/* 🔥 TOP BAR */}
      <div
        className="d-flex justify-content-between px-4 py-1"
        style={{ background: "#f1f1f1", fontSize: "14px" }}
      >
        <div>📞 Helpdesk 123456 | Working Hours: 9:30 AM - 6:00 PM</div>
        <div>Text Size: A- A A+</div>
      </div>

      {/* 🔥 GOV HEADER FINAL */}
      <div
        className="container-fluid py-2"
        style={{ background: "#ffffff", borderBottom: "1px solid #ddd" }}
      >
        <div className="row align-items-center text-center">
          {/* LEFT */}
          <div className="col-md-4 text-start fw-bold text-primary">
            Common Services Centre (CSC)
          </div>

          {/* CENTER */}
          <div className="col-md-4 d-flex align-items-center justify-content-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png"
              alt="emblem"
              style={{ height: "55px", marginRight: "10px" }}
            />

            <div className="text-start">
              <div style={{ fontSize: "14px" }}>
                Ministry of Electronics and Information Technology
              </div>
              <strong style={{ fontSize: "14px" }}>Government of India</strong>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-md-4 text-end">
            <a
              href="https://www.digitalindia.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={DigitalIndiaLogo}
                alt="Digital India"
                style={{ height: "60px", cursor: "pointer" }}
              />
            </a>
          </div>
        </div>
      </div>

      <Navbar />
      <div style={{ marginTop: "110px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/agent-dashboard" element={<AgentDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/track" element={<TrackRequest />} />
          <Route
            path="/verify/:certificateId"
            element={<VerifyCertificate />}
          />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/login-otp" element={<LoginOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
