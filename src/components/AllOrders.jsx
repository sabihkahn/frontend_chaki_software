import React, { useEffect, useState } from "react";
import axios from "axios";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://backendchaki.vercel.app/alldata");
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);

  const styles = {
    container: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      justifyContent: "center",
      alignItems: "flex-start",
      backgroundColor: "white",
      color: "black",
      padding: "10px",
      height: "400px", // fixed height
      overflowY: "scroll", // scrollable vertically
    //   border: "1px solid black",
      borderRadius: "12px",
      boxShadow: "12px 12px 8px rgba(0,0,0,0.1)",
    },
    card: {

      borderRadius: "10px",
      padding: "10px",
      width: "220px",
      backgroundColor: "white",
      color: "black",
      boxShadow: "12px 12px 8px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    title: {
      textAlign: "center",
      fontSize: "18px",
      fontWeight: "600",
      textTransform: "uppercase",
      marginBottom: "10px",
    },
  };

  return (
    <div style={styles.container}>
      {orders.length === 0 ? (
        <p>Loading orders...</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={styles.card}>
            <div className="names"  style={styles.title}>{order.name}</div>
            <p className="textfix"><b>Phone:</b> {order.phone}</p>
            <p className="textfix"><b>Initial:</b> {order.initialWeight} kg</p>
            <p className="textfix"><b>Final:</b> {order.finalWeight} kg</p>
            <p className="textfix"><b>Payment:</b> {order.paymentType}</p>
            <p className="textfix"><b>Status:</b> {order.status}</p>
            <p style={{ fontSize: "12px", color: "gray" }}>
              {new Date(order.date).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default AllOrders;
