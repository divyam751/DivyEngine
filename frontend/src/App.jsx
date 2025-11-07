import React, { useEffect } from "react";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import AllRoutes from "./routes/AllRoutes";
import { useDispatch } from "react-redux";
import { checkAuth } from "./redux/features/AuthSlice";
import EngineToast from "./utils/EngineToast";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, []);
  return (
    <div className="app">
      <Navbar />
      <AllRoutes />
      <EngineToast />
    </div>
  );
};

export default App;
