import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  //For search functionality and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [totalRatings, setTotalRatings] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    role: "",
  });
  const fetchFilteredData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/auth/search?query=${searchQuery}`);
      setUsers(res.data.users);
      setStores(res.data.stores);
    } catch (err) {
      console.error("Failed to fetch filtered data:", err);
    }
  };

  const fetchTotalRatings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/auth/ratings/total");
      setTotalRatings(res.data.total_ratings);
    } catch (err) {
      console.error("Failed to fetch total ratings:", err);
    }
  };

  useEffect(() => {
    fetchFilteredData(searchQuery);
    fetchTotalRatings();
  }, [searchQuery]);
  const getAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return "No ratings";
    const total = ratings.reduce((sum, r) => sum + (r.stars || 0), 0);
    return (total / ratings.length).toFixed(1);
  };

  // Add new user (admin only)
  const addNewUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/auth/add-user", formData);
      alert("User added successfully!");
    } catch (err) {
      console.error("Failed to add user:", err);
      alert(err.response?.data?.message || "Failed to add user");
    }
  };

  return (
    <div style={{ width: "99vw", height: "-webkit-fill-available", backgroundColor: "#f8f9fa" }}>
      <NavBar role="admin" />
      <div style={{ padding: "20px" }}>
        <h1 style={{ marginBottom: "20px", fontWeight: "bold", color: "black" }}>Dashboard Overview</h1>
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
            color: "black",
          }}
        >
          <p>Welcome, Admin! Here’s where you can manage users, view reports, and update settings.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
            {["overview", "users", "stores", "add-user"].map((tab) => (
              <button
                key={tab}
                style={{
                  maxWidth: "230px",
                  padding: "10px 15px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  backgroundColor: activeTab === tab ? "#7f96ff" : "#fff",
                  color: activeTab === tab ? "#fff" : "#320e3b",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "overview"
                  ? "Overview"
                  : tab === "users"
                    ? "View Users"
                    : tab === "stores"
                      ? "View Stores"
                      : "Add New User"}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          {activeTab !== "overview" && (
            <input
              type="text"
              placeholder="Search by name, email, address, or role"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                color: "auto",
                padding: "10px",
                width: "100%",
                maxWidth: "400px",
                marginBottom: "20px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />
          )}

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
              <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>{users.length}</p>
                <p>Total Users</p>
              </div>
              <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>{stores.length}</p>
                <p>Total Stores</p>
              </div>
              <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                  {totalRatings}
                </p>
                <p>Total Ratings</p>
              </div>
            </div>
          )}

          {/* VIEW USERS */}
          {activeTab === "users" && (
            <div style={{ backgroundColor: "#fff", padding: "0", borderRadius: "10px" }}>
              <h2 style={{ marginBottom: "10px", fontWeight: "bold" }}>All Users</h2>
              <div style={{ overflowX: "auto", maxWidth: "100%", }} >
                <DataTable removableSort value={users} emptyMessage="No users found." scrollable scrollHeight="350px" >
                  <Column field="username" header="Name" sortable />
                  <Column field="email" header="Email" sortable />
                  <Column field="address" header="Address" sortable />
                  <Column field="role" header="Role" body={(rowData) => (
                    <span style={{ textTransform: "capitalize" }}>{rowData.role}</span>
                  )}
                  />
                </DataTable>
              </div>
            </div>
          )}

          {/* VIEW STORES */}
          {activeTab === "stores" && (
            <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "10px" }}>
              <h2 style={{ marginBottom: "10px", fontWeight: "bold" }}>All Stores</h2>
              <DataTable removableSort value={stores} emptyMessage="No stores found." scrollable scrollHeight="350px" >
                <Column field="name" header="Name" sortable />
                <Column field="address" header="Address" sortable />
                <Column field="email" header="Email" sortable />
                <Column field="ratings" header="Rating" body={(rowData) => getAverageRating(rowData.ratings)} />
              </DataTable>
            </div>
          )}

          {/* ADD NEW USER */}
          {activeTab === "add-user" && (
            <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", maxWidth: "400px" }}>
              <h2 style={{ marginBottom: "10px", fontWeight: "bold" }}>Add New User</h2>
              <form onSubmit={addNewUser}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                <input type="text" placeholder="Name" value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc"
                  }}
                />
                <input type="email" placeholder="Email" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc"
                  }}
                />
                <input type="text" placeholder="Address" value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc"
                  }}
                />
                <input type="password" placeholder="Password" value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc"
                  }}
                />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{
                    width: "90%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc"
                  }}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">Normal User</option>
                  <option value="store-owner">Store Owner</option>
                </select>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#e56399",
                    width: "fit-content",
                    color: "#fff",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "none",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Add User
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
