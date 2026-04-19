import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginOTP() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!/^\d{10}$/.test(phone)) {
      return alert("Enter valid 10-digit phone number");
    }

    try {
      console.log("Send OTP clicked", phone);
      await axios.post(
        "https://govt-service-assistance-portal.onrender.com/api/auth/login-otp",
        {
          phone,
        },
      );
      alert("OTP sent!");
      setOtpSent(true);
      setAttempts(0);
    } catch (err) {
      console.log("FULL ERROR:", err.response);
      console.log("DATA:", err.response?.data);

      alert(err.response?.data?.message || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    if (attempts >= 3) {
      return alert("Too many attempts. Try again later.");
    }

    try {
      const res = await axios.post(
        "https://govt-service-assistance-portal.onrender.com/api/auth/verify-otp-login",
        {
          phone,
          otp,
        },
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const user = res.data.user;

      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "agent") {
        navigate("/agent-dashboard");
      } else {
        navigate("/"); // citizen
      }
    } catch (err) {
      setAttempts(attempts + 1);
      alert(err.response?.data?.message || "invalid OTP");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Login with OTP</h3>

      <input
        type="text"
        placeholder="Enter Phone"
        className="form-control mb-2"
        onChange={(e) => setPhone(e.target.value)}
      />

      <button className="btn btn-primary mb-2" onClick={sendOtp}>
        Send OTP
      </button>

      <input
        type="text"
        placeholder="Enter OTP"
        className="form-control mb-2"
        onChange={(e) => setOtp(e.target.value)}
      />

      <button className="btn btn-success" onClick={verifyOtp}>
        Login
      </button>

      {otpSent && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="form-control mb-2"
            onChange={(e) => setOtp(e.target.value)}
          />

          <button className="btn btn-success" onClick={verifyOtp}>
            Verify & Login
          </button>
        </>
      )}
    </div>
  );
}

export default LoginOTP;
