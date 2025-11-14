import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import 'primeicons/primeicons.css';
import "./NavBar.css";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChangeEvent = () => {
    navigate("/update-password");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title"> 
          <BsStars color="#defcff" size={30} />
          StarFlow 
        </h1>
      </div>

      <div className="navbar-right">
        <div
          className="profile-icon"
          title={user?.username || "Profile"}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <FaUserCircle size={28} />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <p className="dropdown-item" onClick={handleChangeEvent}>Update Password</p>
              <p className="dropdown-item " onClick={handleLogout}>
                Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
