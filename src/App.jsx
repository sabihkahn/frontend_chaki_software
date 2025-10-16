import { useState, useEffect } from "react";

const API_BASE = "https://backend-chakisoftware-p8nqgagxq-sabihs-projects-0e05538d.vercel.app";

export default function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [initialWeight, setInitialWeight] = useState("");
  const [paymentType, setPaymentType] = useState("money");
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState({});
  const [sales, setSales] = useState([]);
  const [soldKg, setSoldKg] = useState("");
  const [activeTab, setActiveTab] = useState("order");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    fetchOrders();
    fetchInventory();
    fetchSales();
  };

  const fetchOrders = async () => {
    const res = await fetch(`${API_BASE}/api/orders/pending`);
    const data = await res.json();
    setOrders(data);
  };

  const fetchInventory = async () => {
    const res = await fetch(`${API_BASE}/api/inventory`);
    const data = await res.json();
    setInventory(data);
  };

  const fetchSales = async () => {
    const res = await fetch(`${API_BASE}/api/sales`);
    const data = await res.json();
    setSales(data);
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE}/api/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, initialWeight, paymentType }),
    });
    setName(""); setPhone(""); setInitialWeight("");
    fetchAll();
    alert("✅ Order added!");
  };

  const confirmOrder = async (id) => {
    await fetch(`${API_BASE}/api/order/confirm/${id}`, { method: "PUT" });
    fetchAll();
    alert("✅ Order confirmed!");
  };

  const handleSale = async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE}/api/sale`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, soldKg }),
    });
    setName(""); setPhone(""); setSoldKg("");
    fetchAll();
    alert("✅ Sale recorded!");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🌾 Flour Mill Dashboard</h1>

      {/* Navigation Tabs */}
      <div style={styles.tabs}>
        {["order", "inventory", "sales"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tabBtn,
              background: activeTab === tab ? "#4caf50" : "#ddd",
              color: activeTab === tab ? "white" : "#333",
            }}
          >
            {tab === "order" && "📋 Orders"}
            {tab === "inventory" && "📦 Inventory"}
            {tab === "sales" && "💰 Sales"}
          </button>
        ))}
      </div>

      {/* ORDER TAB */}
      {activeTab === "order" && (
        <div style={styles.card}>
          <h2>Add New Order</h2>
          <form onSubmit={handleOrder} style={styles.form}>
            <input style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
              width: "100%",
              height: "40px",
            }} placeholder="Customer Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
              width: "100%",
              height: "40px",
            }} placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <input
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
              width: "100%",
              height: "40px",
            }}
              type="number"
              placeholder="Weight (kg)"
              value={initialWeight}
              onChange={(e) => setInitialWeight(e.target.value)}
              required
            />
            <select style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
              width: "100%",
              height: "40px",
            }} value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
              <option value="money">💵 Payment in Money</option>
              <option value="flour">🌾 Payment in Flour</option>
            </select>
            <button type="submit" style={styles.btnPrimary}>Add Order</button>
          </form>

          <h3 style={{ marginTop: 20 }}>Pending Orders</h3>
          <div style={styles.listBox}>
            {orders.length === 0 ? (
              <p style={{ textAlign: "center" }}>No pending orders</p>
            ) : (
              orders.map((o) => (
                <div key={o._id} style={styles.orderItem}>
                  <div>
                    <b>{o.name}</b> ({o.initialWeight} kg - {o.paymentType})
                  </div>
                  <button style={styles.btnSmall} onClick={() => confirmOrder(o._id)}>
                    ✅ Confirm
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* INVENTORY TAB */}
      {activeTab === "inventory" && (
        <div style={styles.card}>
          <h2>📦 Inventory Status</h2>
          <div style={styles.infoBox}>
            <p><b>Total Flour:</b> {inventory.totalFlour || 0} kg</p>
            <p><b>Total Value:</b> Rs. {inventory.totalValue || 0}</p>
            <p><b>Last Updated:</b> {inventory.updatedAt ? new Date(inventory.updatedAt).toLocaleString() : "--"}</p>
          </div>
        </div>
      )}

      {/* SALES TAB */}
      {activeTab === "sales" && (
        <div style={styles.card}>
          <h2>💰 Record Sale</h2>
          <form onSubmit={handleSale} style={styles.form}>
            <input style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
              width: "100%",
              height: "40px",
            }} placeholder="Customer Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
              width: "100%",
              height: "40px",
            }} placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <input
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "16px",
                width: "100%",
                height: "40px",
              }}
              type="number"
              placeholder="Sold Flour (kg)"
              value={soldKg}
              onChange={(e) => setSoldKg(e.target.value)}
              required
            />
            <button type="submit" style={styles.btnPrimary}>Record Sale</button>
          </form>

          <h3 style={{ marginTop: 20 }}>Recent Sales</h3>
          <div style={styles.listBox}>
            {sales.length === 0 ? (
              <p style={{ textAlign: "center" }}>No sales yet</p>
            ) : (
              sales.map((s) => (
                <div key={s._id} style={styles.saleItem}>
                  <b>{s.name}</b> - {s.soldKg} kg → Rs. {s.totalAmount}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {

  container: {

    fontFamily: "Poppins, sans-serif",
    background: "linear-gradient(135deg, #e0f7e9, #f5fff9)",
    minHeight: "100vh",
    padding: "20px",
  },

  title: {
    textAlign: "center",
    color: "#2e7d32",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "10px",
  },
  tabBtn: {
    border: "none",
    borderRadius: "25px",
    padding: "10px 20px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  card: {
    background: "white",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    padding: "20px",
    maxWidth: "500px",
    margin: "auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  btnPrimary: {
    background: "#4caf50",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  btnSmall: {
    background: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "5px 10px",
    cursor: "pointer",
  },
  listBox: {
    background: "#f7f7f7",
    borderRadius: "10px",
    padding: "10px",
    maxHeight: "250px",
    overflowY: "auto",
  },
  orderItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 10px",
    background: "#e9f5ee",
    borderRadius: "8px",
    marginBottom: "8px",
  },
  saleItem: {
    background: "#fff3e0",
    padding: "8px 10px",
    borderRadius: "8px",
    marginBottom: "8px",
  },
  infoBox: {
    background: "#e8f5e9",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
  },
};
