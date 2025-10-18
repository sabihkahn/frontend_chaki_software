import React, { useState } from "react";
import axios from "axios";

const OrderForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [initialWeight, setInitialWeight] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [status, setStatus] = useState("pending");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = { name, phone, initialWeight, paymentType, status };

    try {
      const res = await axios.post("https://backendchaki.vercel.app/order", data);
      setMessage(res.data.message);
      setName("");
      setPhone("");
      setInitialWeight("");
      setPaymentType("");
      setStatus("pending");
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // --- Inline CSS ---
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
    background: "linear-gradient(135deg, #ffffffff, #fbfbfbff)",
    fontFamily: "'Poppins', sans-serif",
  };

  const formStyle = {
    background: "#fff",
    padding: "40px",
    borderRadius: "15px",
    width: "350px",
    boxShadow: "0 8px 20px rgba(39, 38, 38, 0.3)",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
  };

  const buttonStyle = {
    background: "#4CAF50",
    color: "white",
    padding: "12px",
    width: "100%",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "0.3s",
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center", marginBottom: "15px", color: "#333" }}>
          Add New Order
        </h2>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="text"
          placeholder="Enter Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="number"
          placeholder="Enter Initial Weight (kg)"
          value={initialWeight}
          onChange={(e) => setInitialWeight(e.target.value)}
          style={inputStyle}
          required
        />

        <select
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
          style={inputStyle}
          required
        >
          <option value="">Select Payment Type</option>
          <option value="money">Money</option>
          <option value="flour">Flour</option>
         
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={inputStyle}
          required
        >
          <option value="pending">Pending</option>
          
        </select>

        <button
          type="submit"
          style={{
            ...buttonStyle,
            background: loading ? "#777" : "#4CAF50",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Order"}
        </button>

        {message && (
          <p
            style={{
              marginTop: "15px",
              textAlign: "center",
              fontWeight: "bold",
              color: message.includes("✅") ? "green" : "red",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default OrderForm;
