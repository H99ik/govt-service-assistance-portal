import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
    };
  };

  const passwordChecks = validatePassword(formData.password);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Name"
            onChange={handleChange}
            required
          />
        </div>

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
            className="form-control pe-5"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <i
            className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
            style={{
              position: "absolute",
              top: "50%",
              right: "15px",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "18px",
              color: "#6c757d",
            }}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>

        {formData.password && (
        <div className="mt-2 small">
          <p
            className={
              passwordChecks.minLength ? "text-success" : "text-danger"
            }
          >
            • Minimum 8 characters
          </p>
          <p
            className={passwordChecks.hasUpper ? "text-success" : "text-danger"}
          >
            • At least one uppercase letter
          </p>
          <p
            className={passwordChecks.hasLower ? "text-success" : "text-danger"}
          >
            • At least one lowercase letter
          </p>
          <p
            className={
              passwordChecks.hasNumber ? "text-success" : "text-danger"
            }
          >
            • At least one number
          </p>
          <p
            className={
              passwordChecks.hasSpecial ? "text-success" : "text-danger"
            }
          >
            • At least one special character (!@#$%^&*)
          </p>
        </div>
        )}

        <button className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
}

export default Register;
