import React, { useState } from "react";

const FlourManager = () => {
  const [addedFlour, setAddedFlour] = useState("");
  const [subtractedFlour, setSubtractedFlour] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://backendchaki.vercel.app"; // change to your backend URL

  const handleAddFlour = async () => {
    if (!addedFlour) return setMessage("⚠️ Enter flour amount to add");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/addflour`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addedFlour: Number(addedFlour) }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setAddedFlour("");
      } else {
        setMessage("❌ " + data.error);
      }
    } catch (err) {
      setMessage("⚠️ Server error",err);
    }
    setLoading(false);
  };

  const handleSubtractFlour = async () => {
    if (!subtractedFlour) return setMessage("⚠️ Enter flour amount to subtract");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/subtractflour`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtractedFlour: Number(subtractedFlour) }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setSubtractedFlour("");
      } else {
        setMessage("❌ " + data.error);
      }
    } catch (err) {
      setMessage("⚠️ Server error",err);
    }
    setLoading(false);
  };

  const container = {
    maxWidth: "100%",
    margin: "50px auto",
    padding: "20px",
    background: "#fffff",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(255, 255, 255, 0.3)",
    color: "black",
    fontFamily: "'Poppins', sans-serif",
  };

  const heading = {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "1.5rem",
  };

  const input = {
    width: "100%",
    padding: "10px",
    margin: "8px",
    border: "none",
    borderRadius: "8px",
    outline: "none",
    fontSize: "1rem",
  };

  const button = {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "0.3s",
  };

  const addBtn = {
    ...button,
    backgroundColor: "#000000ff",
    color: "#ffffffff",
  };

  const subBtn = {
    ...button,
    backgroundColor: "#000000ff",
    color: "#fff",
  };

  const msgStyle = {
    textAlign: "center",
    marginTop: "15px",
    fontWeight: "500",
    color: "#00f5d4",
  };

  return (
    <div style={container}>
      <h2 style={heading}>🌾 Flour Inventory Manager</h2>

      {/* Add Flour Section */}
      <label>Add Flour (kg):</label>
      <input
        type="number"
        placeholder="Enter kg to add"
        style={input}
        value={addedFlour}
        onChange={(e) => setAddedFlour(e.target.value)}
      />
      <button
        style={addBtn}
        onClick={handleAddFlour}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Flour"}
      </button>

      {/* Subtract Flour Section */}
      <label style={{ marginTop: "20px" }}>Subtract Flour (kg):</label>
      <input
        type="number"
        placeholder="Enter kg to subtract"
        style={input}
        value={subtractedFlour}
        onChange={(e) => setSubtractedFlour(e.target.value)}
      />
      <button
        style={subBtn}
        onClick={handleSubtractFlour}
        disabled={loading}
      >
        {loading ? "Subtracting..." : "Subtract Flour"}
      </button>

      {message && <div style={msgStyle}>{message}</div>}

      <style>
        {`
          @media (max-width: 500px) {
            div {
              padding: 15px !important;
            }
            h2 {
              font-size: 1.2rem !important;
            }
            input, button {
              font-size: 0.9rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default FlourManager;
