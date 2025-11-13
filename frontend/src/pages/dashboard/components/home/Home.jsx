import React from "react";
import "./Home.css";
import { useSelector } from "react-redux";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="dashboard-home">
      <h1>Welcome to the Dashboard {user}</h1>
    </div>
  );
};

export default Home;
