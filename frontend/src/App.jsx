import React from "react";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import AllRoutes from "./routes/AllRoutes";

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <AllRoutes />
    </div>
  );
};

export default App;
