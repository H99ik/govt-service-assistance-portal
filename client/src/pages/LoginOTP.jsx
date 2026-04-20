import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginOTP() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showOtp, setShowOtp] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!/^\d{10}$/.test(phone)) {
      return alert("Enter valid 10-digit phone number");
    }

    try {
      console.log("Send OTP clicked", phone);

      const res = await axios.post(
        "https://govt-service-assistance-portal.onrender.com/api/auth/login-otp",
        { phone },
      );

      const otpValue = res.data?.otp;

      console.log("OTP VALUE:", otpValue); // debug

      if (otpValue) {
        setShowOtp(otpValue);

        alert(`Your OTP is ${otpValue}`);

        setTimeout(() => setShowOtp(""), 10000);
      }

      alert("OTP sent!");
      setOtpSent(true);
      setAttempts(0);
    } catch (err) {
      console.log("FULL ERROR:", err.response);
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
        { phone, otp },
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const user = res.data.user;

      if (user.role === "admin") navigate("/admin-dashboard");
      else if (user.role === "agent") navigate("/agent-dashboard");
      else navigate("/");
    } catch (err) {
      setAttempts(attempts + 1);
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Login with OTP</h3>

      {/* PHONE INPUT */}
      <input
        type="text"
        placeholder="Enter Phone"
        className="form-control mb-2"
        onChange={(e) => setPhone(e.target.value)}
      />

      {/* SEND OTP */}
      <button className="btn btn-primary mb-2" onClick={sendOtp}>
        Send OTP
      </button>

      {/* 🔥 SHOW OTP */}
      {showOtp && (
        <div className="alert alert-warning text-center">
          Your OTP is: <strong>{showOtp}</strong> (valid for 10 sec)
        </div>
      )}

      {/* OTP SECTION */}
      {otpSent && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="form-control mb-2"
            onChange={(e) => setOtp(e.target.value)}
          />

          <button className="btn btn-success mb-2" onClick={verifyOtp}>
            Verify & Login
          </button>

          {/* RESEND OTP */}
          <button className="btn btn-outline-secondary" onClick={sendOtp}>
            Resend OTP
          </button>
        </>
      )}
    </div>
  );
}

export default LoginOTP;
