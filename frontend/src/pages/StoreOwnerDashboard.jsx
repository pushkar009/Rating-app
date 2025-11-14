import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import { AuthContext } from "../context/AuthContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.css";

const StoreOwnerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [storeData, setStoreData] = useState({ store: {}, avgRating: "", ratings: [] });
  const [error, setError] = useState("");
  const avgRating = storeData.store?.ratings?.length > 0 ? (
    storeData.store.ratings.reduce((sum, r) => sum + (r.stars || 0), 0) / storeData.store.ratings.length
  ).toFixed(1) : 0;

  useEffect(() => {
    if (user?.username) {
      axios
        .get(`http://localhost:5000/auth/store/${user.username}`)
        .then((res) => {
          console.log("Fetched store data:", res.data);
          setStoreData(res.data);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to fetch store data. Please try again later.");
        });
    }
  }, [user?.username]);

  const renderStars = (rating) => {
    const filledStars = "★".repeat(rating);
    const emptyStars = "☆".repeat(5 - rating);
    return filledStars + emptyStars;
  };

  return (
    <div style={{ width: "99vw", height: "-webkit-fill-available", backgroundColor: "#f4f6f8" }}>
      <NavBar role="store-owner" />

      <div style={{ padding: "20px" }}>
        <h1 style={{ marginBottom: "20px", fontWeight: "bold", color: "#222" }}>
          Store Owner Dashboard
        </h1>

        {error && (
          <div
            style={{
              color: "#ff0000",
              backgroundColor: "#ffe6e6",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {storeData.store.name ? (
          <>
            {/* Average Store Rating Section */}
            <div
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                color: "#333",
                marginBottom: "20px",
              }}
            >
              <h1>{storeData.store.name}</h1>
              <h2 style={{ marginBottom: "10px" }}>Average Store Rating</h2>
              <p style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px" }}>
                {avgRating} / 5
              </p>
              <p style={{ color: "#888", marginBottom: "10px" }}>
                {storeData.store?.ratings?.length || 0} reviews
              </p>
              <p>Overall customer satisfaction for your store.</p>
            </div>

            {/* Recent User Ratings Section */}
            <div
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                color: "#333",
              }}
            >
              <h2 style={{ marginBottom: "10px" }}>Recent User Ratings</h2>
              {storeData.store.ratings?.length > 0 ? (
                <DataTable removableSort value={storeData.store.ratings}>
                  <Column field="username" header="Username" sortable></Column>
                  <Column field="email" header="Email" sortable></Column>
                  <Column 
                    field="stars" 
                    header="Rating"
                    body={(rowData) => (
                      <span style={{ fontSize: "1rem" }}>{renderStars(rowData.stars)}</span>
                    )}
                  ></Column>
                </DataTable>
              ) : (
                <p style={{ color: "#555" }}>No ratings available yet.</p>
              )}
            </div>
          </>
        ) : (
          <p style={{ color: "#555" }}>No store found for your account.</p>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
