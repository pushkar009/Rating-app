import React, { useState, useEffect, useContext } from "react";
import NavBar from "../components/NavBar";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import StoreCard from "../components/StoreCard";

const UserDashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useContext(AuthContext);
    const [stores, setStores] = useState([]);

    const fetchStores = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/auth/search?query=${searchQuery}`);
            setStores(res.data.stores || []);
        } catch (err) {
            console.error("Failed to fetch filtered data:", err);
        }
    };

    useEffect(() => {
        fetchStores();
    }, [searchQuery]);

    const submitRating = async (storeName, stars, userRatingObj) => {
        try {
            const method = userRatingObj ? "PATCH" : "POST";
            await axios[method.toLowerCase()](
                "http://localhost:5000/auth/rate", 
                { store_name: storeName, stars },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            fetchStores();
        } catch (err) {
            console.error("Failed to submit rating:", err);
            alert(err.response?.data?.message || "Failed to submit rating");
        }
    };

    return (
        <div style={{ width: "99vw", height: "-webkit-fill-available", backgroundColor: "#f4f6f8" }}>
            <NavBar role="user" />

            <div style={{ padding: "20px" }}>
                <h1 style={{ marginBottom: "20px", fontWeight: "bold", color: "#222" }}>
                    Explore Stores Near You
                </h1>

                <div style={{ marginBottom: "20px" }}>
                    <input
                        type="text"
                        placeholder="Search stores by Name and Address"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            marginBottom: "20px",
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            width: "100%",
                            maxWidth: "400px",
                        }}
                    />
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "20px",
                        padding: "20px",
                    }}>
                    {stores.length > 0 ? (
                        stores.map((store) => {
                            const userRatingObj = store.ratings?.find((r) => r.user_id === user.id);
                            const userRating = userRatingObj ? userRatingObj.stars : null;
                            return (
                                <StoreCard
                                    key={store.name}
                                    store={store}
                                    userRating={userRating}
                                    onSubmitRating={(stars) => submitRating(store.name, stars, userRatingObj)}
                                />
                            );
                        })
                    ) : (
                        <p>No stores available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
