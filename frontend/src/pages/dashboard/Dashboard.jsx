import React, { useState } from "react";
import "./Dashboard.css";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoCarOutline } from "react-icons/io5";
import { TbBrandBooking } from "react-icons/tb";
import { CiSettings } from "react-icons/ci";
import Home from "./components/home/Home";
import Settings from "./components/settings/Settings";
import { HiOutlineUser } from "react-icons/hi";
import Cars from "./components/cars/Cars";

const Dashboard = () => {
  // ✅ default is "home"
  const [active, setActive] = useState("home");

  return (
    <div className="dashboard-container">
      {/* ==== SIDE NAVIGATION ==== */}
      <div className="dashboard-sideNav">
        <div
          className={`sideNavLink ${
            active === "notifications" ? "active" : ""
          }`}
          onClick={() => setActive("notifications")}
        >
          <div className="sideNavLink-icon">
            <IoIosNotificationsOutline />
          </div>
          Notifications
        </div>

        <div
          className={`sideNavLink ${active === "cars" ? "active" : ""}`}
          onClick={() => setActive("cars")}
        >
          <div className="sideNavLink-icon">
            <IoCarOutline />
          </div>
          Cars
        </div>
        <div
          className={`sideNavLink ${active === "drivers" ? "active" : ""}`}
          onClick={() => setActive("drivers")}
        >
          <div className="sideNavLink-icon">
            <HiOutlineUser />
          </div>
          Drivers
        </div>

        <div
          className={`sideNavLink ${active === "bookings" ? "active" : ""}`}
          onClick={() => setActive("bookings")}
        >
          <div className="sideNavLink-icon">
            <TbBrandBooking />
          </div>
          Bookings
        </div>

        <div
          className={`sideNavLink ${active === "settings" ? "active" : ""}`}
          onClick={() => setActive("settings")}
        >
          <div className="sideNavLink-icon">
            <CiSettings />
          </div>
          Settings
        </div>
      </div>

      {/* ==== MAIN BODY ==== */}
      <div className="dashboard-bodyContainer">
        {active === "home" && <Home />}
        {active === "notifications" && <div>Notifications Component</div>}
        {active === "cars" && <Cars />}
        {active === "drivers" && <div>Drivers Component</div>}
        {active === "bookings" && <div>Bookings Component</div>}
        {active === "settings" && <Settings />}
      </div>
    </div>
  );
};

export default Dashboard;
