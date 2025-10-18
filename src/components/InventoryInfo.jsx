import React, { useEffect, useState } from "react";
import axios from "axios";

const InventoryInfo = () => {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get("https://backendchaki.vercel.app/api/inventory");
        setInventory(res.data);
      } catch (err) {
        console.error("Error fetching inventory:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    padding: "0px",
    minHeight: "30vh",
    backgroundColor: "#fff",
    color: "#000",
    fontFamily: "'Poppins', sans-serif",
  };

  const cardStyle = {
    backgroundColor: "#f8f8f8",
    border: "2px solid #000",
    borderRadius: "15px",
    padding: "25px",
    width: "280px",
    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    transition: "0.3s ease",
  };

  const titleStyle = {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "10px",
  };

  const valueStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
  };

  const cardHover = (e, isHover) => {
    e.currentTarget.style.transform = isHover ? "scale(1.05)" : "scale(1)";
    e.currentTarget.style.boxShadow = isHover
      ? "0 8px 20px rgba(0,0,0,0.2)"
      : "0 6px 12px rgba(0,0,0,0.1)";
  };

  if (loading)
    return (
      <div style={{ ...containerStyle, justifyContent: "center" }}>
        <h2>Loading Inventory...</h2>
      </div>
    );

  if (!inventory)
    return (
      <div style={{ ...containerStyle, justifyContent: "center" }}>
        <h2>❌ Failed to load inventory.</h2>
      </div>
    );

  return (
    <div style={containerStyle}>
      <div
        style={cardStyle}
        onMouseEnter={(e) => cardHover(e, true)}
        onMouseLeave={(e) => cardHover(e, false)}
      >
        <div style={titleStyle}>Total Flour</div>
        <div style={valueStyle}>{inventory.totalFlour} kg</div>
      </div>

      <div
        style={cardStyle}
        onMouseEnter={(e) => cardHover(e, true)}
        onMouseLeave={(e) => cardHover(e, false)}
      >
        <div style={titleStyle}>Total Value</div>
        <div style={valueStyle}>Rs. {inventory.totalValue}</div>
      </div>

      <div
        style={cardStyle}
        onMouseEnter={(e) => cardHover(e, true)}
        onMouseLeave={(e) => cardHover(e, false)}
      >
        <div style={titleStyle}>Last Updated</div>
        <div style={valueStyle}>
          {new Date(inventory.updatedAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default InventoryInfo;
