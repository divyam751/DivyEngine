import React, { useState } from "react";
import logo from "../../assets/Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./Register.css";
import { registerUser } from "../../redux/features/AuthSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser(formData));

    // check if it succeeded
    if (registerUser.fulfilled.match(resultAction)) {
      // 👇 navigate only after successful registration
      navigate("/");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <img src={logo} alt="logo" className="register-logo" />
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullname">Fullname</label>
            <input
              name="fullname"
              type="text"
              id="fullname"
              placeholder="Enter your fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Register as</label>
            <select
              name="role"
              id="role"
              defaultValue="customer"
              onChange={handleChange}
              required
            >
              <option value="customer">Customer</option>
              <option value="lister">Lister</option>
            </select>
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Registering in..." : "Register"}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Don’t have an account?{" "}
            <a href="/" className="login-link">
              login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
