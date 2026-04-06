import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  
  if (!email) {
    return <p>Invalid access. Please try again.</p>;
  }

  const handleReset = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        password,
      });

      alert("Password updated!");
      navigate("/login");
    } catch (err) {
      alert("Error resetting password");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Set New Password</h3>

      <input
        type="password"
        placeholder="New Password"
        className="form-control mb-2"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn btn-primary" onClick={handleReset}>
        Update Password
      </button>
    </div>
  );
}

export default ResetPassword;
