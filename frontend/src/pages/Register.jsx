import axios from "axios";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import './style.css'

const Register = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, address } = formData;
    try {
      const res = await api.post("/auth/register", { username, email, password, role: "user", address });
      alert("Registration successful! Please log in.");
      navigate("/user");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed try again.");
    }
  };

  return (
      <div className="container" >
        <div className="card" >
          <h2> Register </h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label> Username </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="on"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label> Email </label>
              <input
                type="email"
                name="email"
                autoComplete="on"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label> Address </label>
              <input
                type="text"
                name="address"
                autoComplete="on"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ marginBottom: "2 rem" }}>
              <label> Password </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {error && (
            <div className="error">{error}</div>
            )}
            <button type="submit" style={{ width: "100%" }}> Register </button>
          </form>
          <p>
            Already have an account? 
            <Link to="/" className="text-blue-500 hover:underline">
            Login
            </Link>
          </p>
        </div>
      </div>
    );
};

export default Register;
