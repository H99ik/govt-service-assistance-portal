import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VerifyOTP() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });

      alert("Account verified successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Verify OTP</h3>

      <input
        type="email"
        placeholder="Enter Email"
        className="form-control mb-2"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="text"
        placeholder="Enter OTP"
        className="form-control mb-2"
        onChange={(e) => setOtp(e.target.value)}
      />

      <button className="btn btn-success" onClick={handleVerify}>
        Verify OTP
      </button>
    </div>
  );
}

export default VerifyOTP;