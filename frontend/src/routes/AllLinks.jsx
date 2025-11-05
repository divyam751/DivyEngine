import React from "react";
import { Link } from "react-router-dom";

const AllLinks = () => {
  return (
    <>
      <Link to="/">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/dashboard">Dashboard</Link>
    </>
  );
};

export default AllLinks;
