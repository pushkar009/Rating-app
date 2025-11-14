// src/routes/ProtectedRoute.jsx
import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, setUser } = useContext(AuthContext);

  // Load user from localStorage if not already in context
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [user, setUser]);

  // If still no user, redirect to login
  if (!user) return <Navigate to="/" replace />;

  // If role is specified and doesn't match, redirect to home
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}
