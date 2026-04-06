import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyResetOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  if (!email) {
    return <p>Invalid access. Please try again.</p>;
  }

  const handleVerify = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/verify-reset-otp", {
        email,
        otp,
      });

      navigate("/reset-password", { state: { email } });
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Verify OTP</h3>

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

export default VerifyResetOtp;
