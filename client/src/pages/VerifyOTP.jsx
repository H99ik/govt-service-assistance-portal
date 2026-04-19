import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function VerifyOTP() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");

    if (!savedEmail) {
      navigate("/register");
    } else {
      setEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleVerify = async () => {
    try {
      await axios.post(
        "https://govt-service-assistance-portal.onrender.com/api/auth/verify-otp",
        {
          email,
          otp,
        },
      );

      localStorage.removeItem("email");
      localStorage.removeItem("phone");

      alert("Account verified successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    }
  };

  const handleResend = async () => {
    try {
      await axios.post(
        "https://govt-service-assistance-portal.onrender.com/api/auth/resend-otp",
        {
          email,
        },
      );

      setTimer(30);
      setCanResend(false);

      alert("OTP resent!");
    } catch (err) {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Verify OTP</h3>

      <p className="text-muted">Verifying: {email}</p>

      <input
        type="text"
        placeholder="Enter OTP"
        className="form-control mb-2"
        onChange={(e) => setOtp(e.target.value)}
      />

      <button className="btn btn-success" onClick={handleVerify}>
        Verify OTP
      </button>

      {!canResend ? (
        <p className="text-muted">Resend OTP in {timer}s</p>
      ) : (
        <button className="btn btn-link" onClick={handleResend}>
          Resend OTP
        </button>
      )}
    </div>
  );
}

export default VerifyOTP;
