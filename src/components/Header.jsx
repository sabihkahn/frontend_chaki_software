import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const headerStyle = {
    background: "linear-gradient(90deg, #1a1a1a, #2c2c54)",
    color: "white",
    padding: "15px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    fontFamily: "'Poppins', sans-serif",
  };

  const logoStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    letterSpacing: "1px",
  };

  const navStyle = {
    display: menuOpen ? "flex" : "none",
    flexDirection: "column",
    position: "absolute",
    top: "65px",
    right: "10px",
    background: "#2c2c54",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    padding: "15px",
    gap: "15px",
    transition: "all 0.3s ease-in-out",
  };

  const navDesktopStyle = {
    display: "flex",
    gap: "25px",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "white",
    fontWeight: 500,
    fontSize: "1rem",
    transition: "0.3s ease",
  };

  const hoverEffect = (e, isHovering) => {
    e.target.style.color = isHovering ? "#00f5d4" : "white";
    e.target.style.transform = isHovering ? "scale(1.1)" : "scale(1)";
  };

  const menuButtonStyle = {
    display: "none",
    flexDirection: "column",
    justifyContent: "center",
    cursor: "pointer",
  };

  const barStyle = {
    width: "25px",
    height: "3px",
    backgroundColor: "white",
    margin: "4px 0",
    transition: "0.4s",
  };

  return (
    <header style={headerStyle}>
      <div style={logoStyle}>🌟 ChakiSoftware</div>

      {/* Desktop Navigation */}
      <nav className="nav-desktop" style={navDesktopStyle}>
        <Link
          to="/"
          style={linkStyle}
          onMouseEnter={(e) => hoverEffect(e, true)}
          onMouseLeave={(e) => hoverEffect(e, false)}
        >
          Dashboard
        </Link>
        <Link
          to="/pendingorders"
          style={linkStyle}
          onMouseEnter={(e) => hoverEffect(e, true)}
          onMouseLeave={(e) => hoverEffect(e, false)}
        >
          Pending Orders
        </Link>
        <Link
          to="/sales"
          style={linkStyle}
          onMouseEnter={(e) => hoverEffect(e, true)}
          onMouseLeave={(e) => hoverEffect(e, false)}
        >
          Sales
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <div
        className="menu-btn"
        style={{ ...menuButtonStyle, display: "flex" }}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div style={{ ...barStyle, transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "" }}></div>
        <div style={{ ...barStyle, opacity: menuOpen ? 0 : 1 }}></div>
        <div style={{ ...barStyle, transform: menuOpen ? "rotate(-45deg) translate(6px, -6px)" : "" }}></div>
      </div>

      {/* Mobile Navigation */}
      <div className="nav-mobile" style={navStyle}>
        <Link
          to="/"
          style={linkStyle}
          onClick={() => setMenuOpen(false)}
        >
          Dashboard
        </Link>
        <Link
          to="/pendingorders"
          style={linkStyle}
          onClick={() => setMenuOpen(false)}
        >
          Pending Orders
        </Link>
        <Link
          to="/sales"
          style={linkStyle}
          onClick={() => setMenuOpen(false)}
        >
          Sales
        </Link>
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .nav-desktop {
              display: none !important;
            }
            .menu-btn {
              display: flex !important;
            }
          }
          @media (min-width: 769px) {
            .nav-mobile {
              display: none !important;
            }
          }
        `}
      </style>
    </header>
  );
};

export default Header;
