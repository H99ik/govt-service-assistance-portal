import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post(
        "https://govt-service-assistance-portal.onrender.com/api/auth/forgot-password",
        {
          email,
        },
      );

      alert("OTP sent! Check console 😄");
      navigate("/verify-reset-otp", { state: { email } });
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Forgot Password</h3>

      <input
        type="email"
        placeholder="Enter your email"
        className="form-control mb-2"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="btn btn-primary" onClick={handleSubmit}>
        Send OTP
      </button>
    </div>
  );
}

export default ForgotPassword;
