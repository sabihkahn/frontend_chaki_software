import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://backendchaki.vercel.app";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [finalWeights, setFinalWeights] = useState({}); // store finalWeight per order

  // Fetch all pending orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/orders/pending`);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Handle input change for final weight
  const handleWeightChange = (id, value) => {
    setFinalWeights({ ...finalWeights, [id]: value });
  };

  // PUT request for adding final weight
  const handleAddFinalWeight = async (id) => {
    const finalWeight = finalWeights[id];
    if (!finalWeight) {
      setMessage("❌ Please enter a final weight before submitting.");
      return;
    }
    try {
      const res = await axios.put(`${BASE_URL}/apifinal/${id}`, { finalWeight });
      setMessage(res.data.message);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, finalWeight: res.data.finalWeight } : o
        )
      );
    } catch (err) {
      setMessage("❌ Failed to update final weight.",err);
    }
  };

  // PUT request for confirming order
  const handleConfirmOrder = async (id) => {
    try {
      const res = await axios.put(`${BASE_URL}/order/confirm/${id}`);
      setMessage(res.data.message);
      // remove order from pending list
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      setMessage("❌ Failed to confirm order.",err);
    }
  };

  // --- Inline styles ---
  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
    alignItems: "flex-start",
    background: "#fff",
    color: "#000",
    fontFamily: "'Poppins', sans-serif",
    minHeight: "100vh",
    padding: "30px",
  };

  const cardStyle = {
    background: "#f9f9f9",
    border: "2px solid #000",
    borderRadius: "15px",
    padding: "20px",
    width: "300px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    transition: "0.3s ease",
  };

  const cardHover = (e, hover) => {
    e.currentTarget.style.transform = hover ? "scale(1.03)" : "scale(1)";
    e.currentTarget.style.boxShadow = hover
      ? "0 8px 20px rgba(0,0,0,0.2)"
      : "0 5px 15px rgba(0,0,0,0.1)";
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "1rem",
  };

  const buttonStyle = {
    background: "#000",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "10px",
    fontSize: "0.9rem",
    transition: "0.3s",
  };

  return (
    <div style={containerStyle}>
      {loading ? (
        <h2>Loading Pending Orders...</h2>
      ) : orders.length === 0 ? (
        <h2>No pending orders found.</h2>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={cardStyle}
            onMouseEnter={(e) => cardHover(e, true)}
            onMouseLeave={(e) => cardHover(e, false)}
          >
            <h3 style={{ marginBottom: "8px" }}>{order.name}</h3>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Initial Weight:</strong> {order.initialWeight} kg</p>
            <p><strong>Final Weight:</strong> {order.finalWeight} kg</p>
            <p><strong>Payment:</strong> {order.paymentType}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>

            {/* Input for adding final weight */}
            <input
              type="number"
              placeholder="Enter final weight"
              value={finalWeights[order._id] || ""}
              onChange={(e) =>
                handleWeightChange(order._id, e.target.value)
              }
              style={inputStyle}
            />

            <div>
              <button
                style={{ ...buttonStyle, background: "#333" }}
                onClick={() => handleAddFinalWeight(order._id)}
              >
                Add Final Weight
              </button>
              <button
                style={{
                  ...buttonStyle,
                  background: "#0b8457",
                  marginTop: "10px",
                }}
                onClick={() => handleConfirmOrder(order._id)}
              >
                Confirm
              </button>
            </div>
          </div>
        ))
      )}

      {message && (
        <div
          style={{
            width: "100%",
            textAlign: "center",
            marginTop: "20px",
            fontWeight: "bold",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default PendingOrders;
