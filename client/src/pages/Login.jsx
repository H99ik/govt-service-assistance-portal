import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Emblem from "../assets/National-Emblem.png";

function Login() {
  const [otpSent, setOtpSent] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email"); // email or phone
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "https://govt-service-assistance-portal.onrender.com/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
      );

      alert("OTP sent!");
      setOtpSent(true);
      setLoginMethod("email");
    } catch (error) {
      const msg = error.response?.data?.message;

      if (
        msg?.toLowerCase().includes("password") ||
        msg?.toLowerCase().includes("otp")
      ) {
        alert("Password or OTP is incorrect ❌");
      } else {
        alert(msg || "Login failed");
      }
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        "https://govt-service-assistance-portal.onrender.com/api/auth/verify-otp-login",
        { email: formData.email, otp },
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const user = res.data.user;

      if (user.role === "admin") navigate("/admin-dashboard");
      else if (user.role === "agent") navigate("/agent-dashboard");
      else navigate("/");
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingLeft: "160px",
      }}
    >
      {/* BACKGROUND IMAGE */}
      <img
        src= {Emblem}
        alt="bg"
        style={{
          position: "absolute",
          right: "95px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "295px",
          opacity: 0.08,
          pointerEvents: "none",
        }}
      />

      {/* LEFT SIDE - LOGIN */}

      <div
        className="card shadow-lg border-0"
        style={{
          width: "380px",
          padding: "25px",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
        }}
      >
        {/* HEADER */}
        <div className="text-center mb-3">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png"
            alt="logo"
            style={{ height: "50px" }}
          />
          <h5 className="mt-2 mb-0 fw-bold">Government Service Portal</h5>
          <small className="text-muted">Secure Login</small>
        </div>

        <h3 className="text-center mb-3 fw-bold">Login</h3>

        {/* EMAIL */}
        <div className="mb-3">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter Email"
            onChange={handleChange}
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-3 position-relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="form-control"
            placeholder="Enter Password"
            onChange={handleChange}
            required
          />

          <i
            className={`bi ${
              showPassword ? "bi-eye-slash" : "bi-eye"
            } position-absolute`}
            style={{
              top: "50%",
              right: "15px",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#555",
            }}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>

        {/* LOGIN BUTTON */}
        <button
          className="btn btn-primary w-100 fw-semibold"
          onClick={handleLogin}
        >
          Login
        </button>

        {/* OTP SECTION */}
        {otpSent && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Enter OTP"
              className="form-control mb-2"
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              className="btn btn-primary w-100 fw-semibold"
              onClick={verifyOtp}
            >
              Verify & Login
            </button>
          </div>
        )}

        {/* PHONE OTP */}
        {!otpSent && (
          <button
            className="btn btn-outline-primary mt-3 w-100"
            onClick={() => navigate("/login-otp")}
          >
            📱 Login with Phone OTP
          </button>
        )}

        {/* LINKS */}
        <p className="text-center mt-3 mb-1">
          <span
            style={{ cursor: "pointer", color: "#0d6efd" }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>
        </p>

        <p className="text-center small">
          Don’t have an account?{" "}
          <a href="/register" className="fw-bold text-primary">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
