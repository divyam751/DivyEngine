import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AllLinks = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const protectedRoutes = ["/dashboard"];
    if (!isAuthenticated && protectedRoutes.includes(location.pathname)) {
      navigate("/");
    }
  }, [isAuthenticated, navigate, location]);

  return (
    <div className="routing-Links">
      <Link to="/aboutus">About Us</Link>
      <Link to="/dashboard">Dashboard</Link>
    </div>
  );
};

export default AllLinks;
