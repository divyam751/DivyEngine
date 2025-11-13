import React from "react";
import "./Cars.css";
import AddNewCar from "./addNewCar/AddNewCar";

const Cars = () => {
  return (
    <div className="dashboard-car-conatiner">
      <AddNewCar />
    </div>
  );
};

export default Cars;
