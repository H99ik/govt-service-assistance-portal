import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

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
        "http://localhost:5000/api/auth/verify-otp-login",
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
        display: "flex",
        backgroundColor: "#f4f6f9",
      }}
    >
      {/* LEFT SIDE - LOGIN */}
      <div
        style={{
          flex: 1,
          width: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="card shadow-lg border-0"
          style={{
            width: "380px",
            padding: "25px",
            borderRadius: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(5px)",
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
            className="btn btn-success w-100 fw-semibold"
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

      {/* RIGHT SIDE - TRANSPARENT IMAGE */}
      <div
        style={{
          width: "55%",
          backgroundColor: "#e9ecef", 
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/512px-Emblem_of_India.svg.png"
          alt="gov"
          style={{
            width: "300px",
            opacity: 0.15,
          }}
        />
      </div>
    </div>
  );
}

export default Login;
