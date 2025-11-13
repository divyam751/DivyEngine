import React, { useState } from "react";
import { useDispatch } from "react-redux";

import "./AddNewCar.css";
import { createCar } from "../../../../../redux/features/carSlice";

const AddNewCar = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    type: "",
    transmission: "",
    fuelType: "",
    seatingCapacity: "",
    pricePerDay: "",
    pricePerHour: "",
    registrationNumber: "",
    year: "",
    mileage: "",
    color: "",
    condition: "Good",
    city: "",
    state: "",
    country: "India",
    startDate: "",
    endDate: "",
    features: "",
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("brand", formData.brand);
    data.append("type", formData.type);
    data.append("transmission", formData.transmission);
    data.append("fuelType", formData.fuelType);
    data.append("seatingCapacity", formData.seatingCapacity);
    data.append("pricePerDay", formData.pricePerDay);
    data.append("pricePerHour", formData.pricePerHour);
    data.append("registrationNumber", formData.registrationNumber);
    data.append("year", formData.year);
    data.append("mileage", formData.mileage);
    data.append("color", formData.color);
    data.append("condition", formData.condition);
    data.append(
      "location",
      JSON.stringify({
        city: formData.city,
        state: formData.state,
        country: formData.country,
      })
    );
    data.append(
      "availability",
      JSON.stringify({
        startDate: formData.startDate,
        endDate: formData.endDate,
      })
    );
    data.append(
      "features",
      JSON.stringify(
        formData.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean)
      )
    );

    if (image) data.append("image", image);

    dispatch(createCar(data));
  };

  return (
    <div className="dashboard-addNewCar-container">
      <h1>Add New Car</h1>
      <form className="addNewCar-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Name *
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Brand *
            <input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Type *
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option>Hatchback</option>
              <option>Sedan</option>
              <option>SUV</option>
              <option>Luxury</option>
              <option>Electric</option>
            </select>
          </label>
          <label>
            Transmission *
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              required
            >
              <option value="">Select Transmission</option>
              <option>Manual</option>
              <option>Automatic</option>
            </select>
          </label>
          <label>
            Fuel Type *
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              required
            >
              <option value="">Select Fuel</option>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>CNG</option>
              <option>Electric</option>
            </select>
          </label>
          <label>
            Seating Capacity *
            <input
              type="number"
              name="seatingCapacity"
              value={formData.seatingCapacity}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Price Per Day *
            <input
              type="number"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Price Per Hour
            <input
              type="number"
              name="pricePerHour"
              value={formData.pricePerHour}
              onChange={handleChange}
            />
          </label>
          <label>
            Registration Number *
            <input
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Year *
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Mileage{" "}
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
            />
          </label>
          <label>
            Color{" "}
            <input
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
          </label>
          <label>
            Condition
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
            >
              <option>Excellent</option>
              <option>Good</option>
              <option>Fair</option>
            </select>
          </label>
          <label>
            Features (comma separated)
            <input
              name="features"
              value={formData.features}
              onChange={handleChange}
            />
          </label>

          {/* Location */}
          <label>
            City *
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            State{" "}
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </label>
          <label>
            Country{" "}
            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </label>

          {/* Availability */}
          <label>
            Available From
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </label>
          <label>
            Available To
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </label>

          {/* Image */}
          <label>
            Upload Image *
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </label>
        </div>

        <button type="submit" className="submit-btn">
          Submit Car
        </button>
      </form>
    </div>
  );
};

export default AddNewCar;
