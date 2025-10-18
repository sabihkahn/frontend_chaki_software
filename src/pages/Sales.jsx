import React, { useState, useEffect } from "react";
import axios from "axios";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [soldKg, setSoldKg] = useState("");
  const [message, setMessage] = useState("");

  // Fetch sales data
  const fetchSales = async () => {
    try {
      const res = await axios.get("https://backendchaki.vercel.app/api/sales");
      setSales(res.data);
    } catch (err) {
      console.error("Error fetching sales:", err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://backendchaki.vercel.app/api/sale", {
        name,
        phone,
        soldKg: Number(soldKg),
      });
      setMessage(res.data.message);
      setName("");
      setPhone("");
      setSoldKg("");
      fetchSales(); // refresh data after adding
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

  const styles = {
    wrapper: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
      backgroundColor: "white",
      color: "black",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
    },
    form: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      justifyContent: "center",
      alignItems: "center",
    },
    input: {
      padding: "8px 12px",
      borderRadius: "8px",
      border: "1px solid black",
      outline: "none",
    },
    button: {
      padding: "8px 20px",
      backgroundColor: "black",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
    },
    listContainer: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "10px",
      height: "400px",
      overflowY: "scroll",
      width: "100%",
    },
    card: {
      border: "1px solid black",
      borderRadius: "10px",
      width: "150px",
      padding: "10px",
      backgroundColor: "white",
      boxShadow: "1px 1px 6px rgba(0,0,0,0.1)",
    },
  };

  return (
    <div style={styles.wrapper}>
      <h2>💰 Sales</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="number"
          placeholder="Sold KG"
          value={soldKg}
          onChange={(e) => setSoldKg(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Record Sale
        </button>
      </form>

      {message && <p>{message}</p>}

      <div style={styles.listContainer}>
        {sales.length === 0 ? (
          <p>No sales found</p>
        ) : (
          sales.map((sale) => (
            <div key={sale._id} style={styles.card}>
              <p><b>Name:</b> {sale.name}</p>
              <p><b>Phone:</b> {sale.phone}</p>
              <p><b>Sold:</b> {sale.soldKg} kg</p>
              <p><b>Amount:</b> Rs {(sale.totalAmount).toFixed(2)}</p>
              <p style={{ fontSize: "12px", color: "gray" }}>
                {new Date(sale.date).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sales;
