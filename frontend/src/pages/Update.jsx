// src/pages/Update.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password must match.");
      return;
    }

    // Later we will call backend API here
    try {
      const token = localStorage.getItem("token");
  
      await api.patch(
        "/auth/update-password",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Password update request submitted!");
      navigate(-1); // Go back to previous page (dashboard)
    } catch (err) {
      console.error("Password update error:", err);
      setError(err.response?.data?.message || "Failed to update password.");
    }
  };

  return (
    <div 
    style={{
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div 
        style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            padding: "2rem",
            width: "60%", // Adjusted for responsiveness
            maxWidth: "400px",
          }}
      >
        <h2 
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#320e3b",
            marginBottom: "1.5rem",
          }}
        >
          Update Password
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="currentPassword" 
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#320e3b",
                fontWeight: "500",
              }}
            >
              Current Password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              style={{
                width: "90%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
              }}
              required
              />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="newPassword"
              style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#320e3b",
                  fontWeight: "500",
              }}
              >
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              style={{
                width: "90%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
              }}
              required
              />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="confirmPassword"
              style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#320e3b",
                  fontWeight: "500",
                }}
                >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                width: "90%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
              }}
              required
            />
          </div>

          {error && (
            <div style={{ color: "#ff0000", marginBottom: "1rem" }}>{error}</div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <button
              type="submit"
              style={{
                // backgroundColor: "#7f96ff",
                backgroundColor: "#7f71ff",
                color: "#fff",
                width: "96%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              >
              Update Password
            </button>

            <button
              type="button"
              style={{
                backgroundColor: "#7f96ff",
                color: "#fff",
                width: "96%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "0.5rem",
              }}
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
