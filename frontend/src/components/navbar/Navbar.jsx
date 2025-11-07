import React, { useEffect, useState } from "react";
import "./Navbar.css";
import AllLinks from "../../routes/AllLinks";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/features/AuthSlice";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const location = useLocation();

  const handleRegister = () => {
    navigate("/register");
  };
  const handleLogin = () => {
    navigate("/");
  };
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  useEffect(() => {}, []);
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={handleLogin}>
          DivyEngine
        </div>

        {/* Hamburger Icon */}
        <div
          className={`menu-icon ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Links + Button */}
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <div className="links">
            <AllLinks />
          </div>
          {isAuthenticated ? (
            <button className="login-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : location.pathname === "/" ? (
            <button className="login-btn" onClick={handleRegister}>
              Register
            </button>
          ) : (
            <button className="login-btn" onClick={handleLogin}>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
