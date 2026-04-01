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
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
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
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh", background: "#f5f7fa" }}
    >
      <div className="card shadow p-4" style={{ width: "360px" }}>
        <h3 className="text-center mb-3 fw-bold">Login</h3>

        <div className="mb-3">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3 position-relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="form-control"
            placeholder="Password"
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
            }}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>

        <button className="btn btn-success w-100" onClick={handleLogin}>
          Login
        </button>

        {/* OTP FIELD */}
        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="form-control mb-2"
              onChange={(e) => setOtp(e.target.value)}
            />

            <button className="btn btn-primary w-100" onClick={verifyOtp}>
              Verify & Login
            </button>
          </>
        )}

        {/* PHONE OTP BUTTON */}
        {!otpSent && (
          <button
            className="btn btn-outline-primary mt-2 w-100"
            onClick={() => navigate("/login-otp")}
          >
            Login with Phone OTP
          </button>
        )}

        {/* 🔥 Switch */}
        <p className="text-center mt-3 small">
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
