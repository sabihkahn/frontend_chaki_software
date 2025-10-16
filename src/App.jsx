// App.jsx - Complete Flour Mill Management Frontend
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'https://backend-chakisoftware-pn9pq6g6f-sabihs-projects-0e05538d.vercel.app';

// API Service Functions
const api = {
  // Order APIs
  createOrder: (orderData) => axios.post(`${BASE_URL}/api/order`, orderData),
  getPendingOrders: () => axios.get(`${BASE_URL}/api/orders/pending`),
  getCompletedOrders: () => axios.get(`${BASE_URL}/odercompleted`),
  confirmOrder: (id) => axios.put(`${BASE_URL}/api/order/confirm/${id}`),
  updateFinalWeight: (id, finalWeight) => 
    axios.put(`${BASE_URL}/apifinal/${id}`, { finalWeight }),
  
  // Inventory APIs
  getInventory: () => axios.get(`${BASE_URL}/api/inventory`),
  
  // Sales APIs
  recordSale: (saleData) => axios.post(`${BASE_URL}/api/sale`, saleData),
  getSales: () => axios.get(`${BASE_URL}/api/sales`),
};

// Navbar Component
const Navbar = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'sales', label: 'Sales', icon: '💰' }
  ];

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <div style={styles.navBrand}>
          🌾 Flour Mill Management
        </div>
        <ul style={styles.navLinks}>
          {navItems.map(item => (
            <li key={item.id} style={styles.navListItem}>
              <button
                style={{
                  ...styles.navButton,
                  ...(currentPage === item.id ? styles.navButtonActive : {})
                }}
                onClick={() => onPageChange(item.id)}
              >
                {item.icon} {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

// Order Form Component
const OrderForm = ({ onOrderCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    initialWeight: '',
    paymentType: 'money',
    status: 'pending'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createOrder({
        ...formData,
        initialWeight: parseFloat(formData.initialWeight)
      });
      
      setFormData({
        name: '',
        phone: '',
        initialWeight: '',
        paymentType: 'money',
        status: 'pending'
      });
      
      if (onOrderCreated) {
        onOrderCreated();
      }
      
      alert('✅ Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('❌ Error creating order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>➕ Create New Order</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.grid2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Customer Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
        </div>

        <div style={styles.grid2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Initial Weight (kg)</label>
            <input
              type="number"
              step="0.01"
              name="initialWeight"
              value={formData.initialWeight}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Payment Type</label>
            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="money">Money</option>
              <option value="flour">Flour (3%)</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          style={styles.primaryButton}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Order'}
        </button>
      </form>
    </div>
  );
};

// Order List Component
const OrderList = ({ type = 'pending', refreshTrigger, onRefresh }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [type, refreshTrigger]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = type === 'pending' 
        ? await api.getPendingOrders()
        : await api.getCompletedOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
      console.log('❌ Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async (id) => {
    try {
      setUpdating(id);
      await api.confirmOrder(id);
      await loadOrders();
      if (onRefresh) onRefresh();
      alert('✅ Order confirmed successfully!');
    } catch (error) {
      console.error('Error confirming order:', error);
      console.log('❌ Error confirming order');
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdateFinalWeight = async (id) => {
    const finalWeight = prompt('Enter final weight (kg):');
    if (finalWeight && !isNaN(finalWeight)) {
      try {
        setUpdating(id);
        await api.updateFinalWeight(id, parseFloat(finalWeight));
        await loadOrders();
        alert('✅ Final weight updated successfully!');
      } catch (error) {
        console.error('Error updating final weight:', error);
        alert('❌ Error updating final weight');
      } finally {
        setUpdating(null);
      }
    }
  };

  if (loading) {
    return <div style={styles.card}>Loading orders...</div>;
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>
        {type === 'pending' ? '⏳ Pending Orders' : '✅ Completed Orders'} 
        <span style={styles.badge}>{orders.length}</span>
      </h2>
      
      {orders.length === 0 ? (
        <p>No {type} orders found.</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Name</th>
                <th style={styles.tableHeader}>Phone</th>
                <th style={styles.tableHeader}>Initial Weight</th>
                <th style={styles.tableHeader}>Final Weight</th>
                <th style={styles.tableHeader}>Difference</th>
                <th style={styles.tableHeader}>Payment</th>
                <th style={styles.tableHeader}>Date</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr 
                  key={order._id} 
                  style={{
                    ...styles.tableRow,
                    ...(hoveredRow === order._id ? styles.tableRowHover : {})
                  }}
                  onMouseEnter={() => setHoveredRow(order._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={styles.tableCell}>{order.name}</td>
                  <td style={styles.tableCell}>{order.phone}</td>
                  <td style={styles.tableCell}>{order.initialWeight} kg</td>
                  <td style={styles.tableCell}>
                    {order.finalWeight 
                      ? `${order.finalWeight} kg` 
                      : 'Not set'}
                  </td>
                  <td style={styles.tableCell}>
                    {order.weightDifference !== null && (
                      <span style={{
                        ...styles.statusBadge,
                        ...(order.weightDifference < 0 ? styles.statusWarning : styles.statusSuccess)
                      }}>
                        {order.weightDifference > 0 ? '+' : ''}{order.weightDifference} kg
                      </span>
                    )}
                  </td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.statusBadge,
                      ...(order.paymentType === 'money' ? styles.statusInfo : styles.statusSuccess)
                    }}>
                      {order.paymentType === 'money' ? '💰 Money' : '🌾 Flour'}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.buttonGroup}>
                      {type === 'pending' && (
                        <button
                          style={styles.successButton}
                          onClick={() => handleConfirmOrder(order._id)}
                          disabled={updating === order._id}
                        >
                          {updating === order._id ? '...' : '✅ Confirm'}
                        </button>
                      )}
                      <button
                        style={styles.warningButton}
                        onClick={() => handleUpdateFinalWeight(order._id)}
                        disabled={updating === order._id}
                      >
                        {updating === order._id ? '...' : '⚖️ Weight'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Inventory Component
const Inventory = ({ refreshTrigger }) => {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, [refreshTrigger]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const response = await api.getInventory();
      setInventory(response.data);
    } catch (error) {
      console.error('Error loading inventory:', error);
      alert('❌ Error loading inventory');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.card}>Loading inventory...</div>;
  }

  if (!inventory) {
    return <div style={styles.card}>No inventory data found.</div>;
  }

  return (
    <div style={styles.inventoryCard}>
      <h2 style={styles.cardTitle}>📦 Inventory Status</h2>
      <div style={styles.inventoryStats}>
        <div style={styles.statItem}>
          <div style={styles.statValue}>{inventory.totalFlour} kg</div>
          <div style={styles.statLabel}>Total Flour</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statValue}>Rs. {inventory.totalValue}</div>
          <div style={styles.statLabel}>Total Value</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statValue}>
            {new Date(inventory.updatedAt).toLocaleDateString()}
          </div>
          <div style={styles.statLabel}>Last Updated</div>
        </div>
      </div>
    </div>
  );
};

// Sales Form Component
const SalesForm = ({ onSaleRecorded }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    soldKg: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.recordSale({
        ...formData,
        soldKg: parseFloat(formData.soldKg)
      });
      
      setFormData({
        name: '',
        phone: '',
        soldKg: ''
      });
      
      if (onSaleRecorded) {
        onSaleRecorded();
      }
      
      alert('✅ Sale recorded successfully!');
    } catch (error) {
      console.error('Error recording sale:', error);
      if (error.response?.data?.error) {
        alert(`❌ ${error.response.data.error}`);
      } else {
        alert('❌ Error recording sale');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>💰 Record New Sale</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.grid2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Customer Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Flour Sold (kg)</label>
          <input
            type="number"
            step="0.01"
            name="soldKg"
            value={formData.soldKg}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <small style={styles.helpText}>Price: Rs. 300 per kg</small>
        </div>

        <button 
          type="submit" 
          style={styles.primaryButton}
          disabled={loading}
        >
          {loading ? 'Recording...' : 'Record Sale'}
        </button>
      </form>
    </div>
  );
};

// Sales History Component
const SalesHistory = ({ refreshTrigger }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    loadSales();
  }, [refreshTrigger]);

  const loadSales = async () => {
    try {
      setLoading(true);
      const response = await api.getSales();
      setSales(response.data);
    } catch (error) {
      console.error('Error loading sales:', error);
      alert('❌ Error loading sales history');
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalKgSold = sales.reduce((sum, sale) => sum + sale.soldKg, 0);

  if (loading) {
    return <div style={styles.card}>Loading sales history...</div>;
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>📈 Sales History</h2>
      
      <div style={styles.salesSummary}>
        <div style={styles.summaryItem}>
          <div style={styles.summaryValue}>{sales.length}</div>
          <div style={styles.summaryLabel}>Total Sales</div>
        </div>
        <div style={styles.summaryItem}>
          <div style={styles.summaryValue}>{totalKgSold} kg</div>
          <div style={styles.summaryLabel}>Total Flour Sold</div>
        </div>
        <div style={styles.summaryItem}>
          <div style={styles.summaryValue}>Rs. {totalRevenue}</div>
          <div style={styles.summaryLabel}>Total Revenue</div>
        </div>
      </div>

      {sales.length === 0 ? (
        <p>No sales records found.</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Name</th>
                <th style={styles.tableHeader}>Phone</th>
                <th style={styles.tableHeader}>Flour Sold</th>
                <th style={styles.tableHeader}>Amount</th>
                <th style={styles.tableHeader}>Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr 
                  key={sale._id} 
                  style={{
                    ...styles.tableRow,
                    ...(hoveredRow === sale._id ? styles.tableRowHover : {})
                  }}
                  onMouseEnter={() => setHoveredRow(sale._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={styles.tableCell}>{sale.name}</td>
                  <td style={styles.tableCell}>{sale.phone}</td>
                  <td style={styles.tableCell}>{sale.soldKg} kg</td>
                  <td style={styles.tableCell}>Rs. {sale.totalAmount}</td>
                  <td style={styles.tableCell}>
                    {new Date(sale.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Dashboard Page
const Dashboard = ({ refreshTrigger, onRefresh }) => {
  return (
    <div>
      <h1 style={styles.pageTitle}>📊 Dashboard</h1>
      <Inventory refreshTrigger={refreshTrigger} />
      
      <div style={styles.grid2}>
        <OrderList 
          type="pending" 
          refreshTrigger={refreshTrigger}
          onRefresh={onRefresh}
        />
        <OrderList 
          type="completed" 
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  );
};

// Orders Page
const OrdersPage = ({ refreshTrigger, onRefresh }) => {
  return (
    <div>
      <h1 style={styles.pageTitle}>📦 Orders Management</h1>
      <OrderForm onOrderCreated={onRefresh} />
      <div style={styles.grid2}>
        <OrderList 
          type="pending" 
          refreshTrigger={refreshTrigger}
          onRefresh={onRefresh}
        />
        <OrderList 
          type="completed" 
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  );
};

// Sales Page
const SalesPage = ({ refreshTrigger, onRefresh }) => {
  return (
    <div>
      <h1 style={styles.pageTitle}>💰 Sales Management</h1>
      <SalesForm onSaleRecorded={onRefresh} />
      <SalesHistory refreshTrigger={refreshTrigger} />
    </div>
  );
};

// Main App Component
const FlourMillApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard refreshTrigger={refreshTrigger} onRefresh={handleRefresh} />;
      case 'orders':
        return <OrdersPage refreshTrigger={refreshTrigger} onRefresh={handleRefresh} />;
      case 'sales':
        return <SalesPage refreshTrigger={refreshTrigger} onRefresh={handleRefresh} />;
      default:
        return <Dashboard refreshTrigger={refreshTrigger} onRefresh={handleRefresh} />;
    }
  };

  return (
    <div style={styles.app}>
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div style={styles.container}>
        {renderPage()}
      </div>
    </div>
  );
};

// Fixed Styles - Using proper JavaScript object syntax
const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '20px'
  },
  navbar: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '1rem 0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  navContainer: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navBrand: {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  navLinks: {
    display: 'flex',
    gap: '1rem',
    listStyle: 'none',
    margin: 0,
    padding: 0
  },
  navListItem: {
    listStyle: 'none'
  },
  navButton: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s'
  },
  navButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  pageTitle: {
    color: '#333',
    marginBottom: '2rem',
    borderBottom: '3px solid #667eea',
    paddingBottom: '0.5rem'
  },
  card: {
    background: 'white',
    borderRadius: '10px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '1.5rem'
  },
  inventoryCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '10px',
    padding: '2rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '1.5rem'
  },
  cardTitle: {
    color: 'inherit',
    marginBottom: '1rem',
    borderBottom: '2px solid currentColor',
    paddingBottom: '0.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  badge: {
    background: 'rgba(255,255,255,0.2)',
    padding: '0.25rem 0.75rem',
    borderRadius: '15px',
    fontSize: '0.875rem'
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem'
  },
  formGroup: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#555'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #e1e1e1',
    borderRadius: '5px',
    fontSize: '1rem',
    transition: 'border-color 0.3s'
  },
  helpText: {
    display: 'block',
    marginTop: '0.25rem',
    color: '#666',
    fontSize: '0.875rem'
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  successButton: {
    background: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '5px',
    fontSize: '0.875rem',
    cursor: 'pointer',
    marginRight: '0.5rem'
  },
  warningButton: {
    background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '5px',
    fontSize: '0.875rem',
    cursor: 'pointer'
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.25rem'
  },
  tableContainer: {
    overflowX: 'auto',
    marginTop: '1rem'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    padding: '0.75rem',
    textAlign: 'left',
    backgroundColor: '#f8f9fa',
    fontWeight: '600',
    color: '#555',
    borderBottom: '1px solid #e1e1e1'
  },
  tableRow: {
    borderBottom: '1px solid #e1e1e1'
  },
  tableRowHover: {
    backgroundColor: '#f8f9fa'
  },
  tableCell: {
    padding: '0.75rem',
    textAlign: 'left'
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '15px',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  statusSuccess: {
    backgroundColor: '#d1edff',
    color: '#0c5460'
  },
  statusWarning: {
    backgroundColor: '#fff3cd',
    color: '#856404'
  },
  statusInfo: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460'
  },
  inventoryStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
    textAlign: 'center'
  },
  statItem: {
    padding: '1rem'
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  },
  statLabel: {
    fontSize: '1rem',
    opacity: 0.9
  },
  salesSummary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '2rem'
  },
  summaryItem: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    textAlign: 'center'
  },
  summaryValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  },
  summaryLabel: {
    fontSize: '0.875rem',
    opacity: 0.9
  }
};

// Responsive styles
// const responsiveStyles = {
//   '@media (max-width: 768px)': {
//     grid2: {
//       gridTemplateColumns: '1fr'
//     },
//     inventoryStats: {
//       gridTemplateColumns: '1fr'
//     },
//     salesSummary: {
//       gridTemplateColumns: '1fr'
//     }
//   }
// };

export default FlourMillApp;