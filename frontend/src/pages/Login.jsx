import { api } from "../api";
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import './style.css';
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { username, password });
      login(res.data.user);
      localStorage.setItem("token", res.data.token);
      setUsername('');
      setPassword('');
      if (res.data.user.role === "admin") navigate("/admin");
      else if (res.data.user.role === "store-owner") navigate("/store-owner");
      else navigate("/user");
    } catch (err) {
      // console.error("Login Error:", err);  Logging the full error for debugging in console
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2> Login </h2>
        <form onSubmit={handleLogin}>
          <div>
            <label> Username </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label> Password </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="error" >{error}</div>
          )}
          <button type="submit" style={{ width: "100%" }}> Login </button>
        </form>
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
