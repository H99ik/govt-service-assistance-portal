import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VerifyLoginOTP() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  const handleVerify = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp-login",
        { email, otp },
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      localStorage.removeItem("email");

      alert("Login successful 😏🔥");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Enter OTP</h3>

      <p className="text-muted">Email: {email}</p>

      <input
        type="text"
        placeholder="Enter OTP"
        className="form-control mb-2"
        onChange={(e) => setOtp(e.target.value)}
      />

      <button className="btn btn-success" onClick={handleVerify}>
        Verify & Login
      </button>
    </div>
  );
}

export default VerifyLoginOTP;
