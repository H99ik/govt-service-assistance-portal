import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
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
      navigate("/verify-otp");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh", background: "#f5f7fa" }}
    >
      <div className="card shadow p-4" style={{ width: "360px" }}>
        <h3 className="text-center mb-3 fw-bold">Register</h3>

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

          <div className="mb-3">
            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder="Mobile Number"
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
                className={
                  passwordChecks.hasUpper ? "text-success" : "text-danger"
                }
              >
                • Uppercase letter
              </p>
              <p
                className={
                  passwordChecks.hasLower ? "text-success" : "text-danger"
                }
              >
                • Lowercase letter
              </p>
              <p
                className={
                  passwordChecks.hasNumber ? "text-success" : "text-danger"
                }
              >
                • Number
              </p>
              <p
                className={
                  passwordChecks.hasSpecial ? "text-success" : "text-danger"
                }
              >
                • Special character
              </p>
            </div>
          )}

          <button className="btn btn-primary w-100">Register</button>
        </form>

        {/* 🔥 Switch */}
        <p className="text-center mt-3 small">
          Already have an account?{" "}
          <a href="/login" className="fw-bold text-primary">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
