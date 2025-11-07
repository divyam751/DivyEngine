import React from "react";
import { Route, Routes } from "react-router";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Aboutus from "../pages/aboutus/Aboutus";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/aboutus" element={<Aboutus />} />
    </Routes>
  );
};

export default AllRoutes;
