import React, { useState } from "react";
import 'primeicons/primeicons.css';

const StoreCard = ({ store, userRating, onSubmitRating }) => {
  const [hoveredStar, setHoveredStar] = useState(null);
  const [selectedStar, setSelectedStar] = useState(userRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const avgRating =
    store.ratings?.length > 0
      ? (
        store.ratings.reduce((sum, r) => sum + (r.stars || 0), 0) /
        store.ratings.length
      ).toFixed(1)
      : "No ratings";

  const handleStarClick = (star) => {
    setSelectedStar(star);

    // If user does not have a rating, submit immediately
    if (userRating === null) {
      submitRating(star);
    }
  };

  const submitRating = async (stars) => {
    setIsSubmitting(true);
    try {
      await onSubmitRating(stars);
      setSelectedStar(stars);
    } catch (err) {
      console.error("Error submitting rating:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleButtonClick = () => {
    if (selectedStar === 0) {
      alert("Please select a rating before submitting");
      return;
    }
    submitRating(selectedStar);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        alignItems: "center",
      }}
    >
      {/* Store Image */}
      <img
        src={store.img_url ? `/img/${store.img_url}` : "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=60"}
        alt={store.name}
        style={{
          width: "100px",
          height: "100px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />

      {/* Store Info */}
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px", color: "#333" }}>
          {store.name}
        </h3>
        <p style={{ color: "#777", marginBottom: "12px" }}>{store.address}</p>

        {/* Ratings */}
        <div style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px", color: "#ffb400" }}>★</span>
            <span style={{ fontWeight: "bold", color: "#555" }}>{avgRating}</span>
            <span style={{ fontSize: "14px", color: "#333" }}>Overall Rating</span>
          </div>

          {userRating !== null && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "6px",
              }}
            >
              <span style={{ fontSize: "18px", color: "#4caf50" }}>★</span>
              <span style={{ fontWeight: "bold", color: "#555" }}>{userRating}</span>
              <span style={{ fontSize: "14px", color: "#333" }}>You Rated</span>
            </div>
          )}
        </div>

        {/* Interactive Star Rating */}
        <div style={{ marginBottom: "8px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
              style={{
                fontSize: "20px",
                cursor: "pointer",
                color:
                  hoveredStar >= star || selectedStar >= star
                    ? "#ffb400"
                    : "#ccc",
              }}
            >
              ★
            </span>
          ))}
        </div>

        {userRating !== null && (
          <button 
            className="pi pi-star-fill"
            style={{ 
              fontSize: '1rem', 
              color: "black",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.6 : 1,
            }}
            onClick={handleButtonClick}
            disabled={isSubmitting}
          >
            { isSubmitting ? " Submitting.." : " Submit Rating" } 
          </button>
        )}
      </div>
    </div>
  );
};

export default StoreCard;
