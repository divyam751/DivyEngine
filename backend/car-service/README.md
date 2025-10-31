# 🚗 Car Service API

RESTful API built with **Node.js + Express + MongoDB** for managing car listings.
Supports roles: **Lister**, **Admin**, and **Customer**.

---

## 🌐 Base URL

```
http://localhost:3002/api/v1/car
```

---

## 🧍‍♂️ LISTER ROUTES

### **1️⃣ Create Car Listing**

**POST** `/`
**Headers:** `Authorization: Bearer <token>`
**Role:** lister

**Form-Data Example:**

| Key                | Value      | Type   |
| ------------------ | ---------- | ------ |
| image              | car.jpg    | File   |
| name               | Swift      | Text   |
| brand              | Maruti     | Text   |
| type               | Hatchback  | Text   |
| transmission       | Manual     | Text   |
| fuelType           | Petrol     | Text   |
| seatingCapacity    | 5          | Number |
| pricePerDay        | 2000       | Number |
| location.city      | Mumbai     | Text   |
| registrationNumber | MH12AB1234 | Text   |
| year               | 2021       | Number |

**Response:**

```json
{
  "status": "success",
  "message": "Car listed successfully",
  "data": {
    "publicId": "c2b9d8e4-22b7-4cbb-a8e2",
    "status": "Pending"
  }
}
```

---

### **2️⃣ Get My Listed Cars**

**GET** `/my-listed-cars`
**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "status": "success",
  "message": "Listed cars retrieved successfully",
  "data": {
    "totalCars": 3,
    "listedCars": [ ... ]
  }
}
```

---

### **3️⃣ Update Car Details**

**PUT** `/:carId`
**Headers:** `Authorization: Bearer <token>`
(Form-Data — same fields as create)

**Response:**

```json
{
  "status": "success",
  "message": "Car updated successfully. Pending admin approval.",
  "data": { ... }
}
```

---

## 🛠️ ADMIN ROUTES

### **4️⃣ Get Pending Cars**

**GET** `/admin/pending`
**Role:** admin

**Response:**

```json
{
  "status": "success",
  "message": "Pending car requests retrieved successfully",
  "data": [ ... ]
}
```

---

### **5️⃣ Approve / Reject Car**

**PATCH** `/admin/:carId/status`
**Body:**

```json
{
  "status": "Approved",
  "message": "Verified and approved."
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Car approved successfully",
  "data": { ... }
}
```

---

### **6️⃣ Get All Cars**

**GET** `/admin/all-cars`
**Query:** `page`, `limit`, `status`, `search`

**Response:**

```json
{
  "status": "success",
  "message": "Cars retrieved successfully",
  "data": {
    "totalCars": 50,
    "cars": [ ... ]
  }
}
```

---

## 👥 CUSTOMER ROUTES

### **7️⃣ Get Available Cars**

**GET** `/available-cars`
**Headers:** `Authorization: Bearer <token>`
**Query Example:**
`?city=Mumbai&brand=Maruti&minPrice=1000&maxPrice=3000`

**Response:**

```json
{
  "status": "success",
  "message": "Available cars retrieved successfully",
  "data": {
    "totalCars": 10,
    "cars": [ ... ]
  }
}
```

---

## 🔒 INTERNAL ROUTE

### **8️⃣ Get Car Details (Internal)**

**GET** `/internal/:carId`
(Protected by internal service token)

**Response:**

```json
{
  "status": "success",
  "message": "Car details fetched successfully",
  "data": {
    "publicId": "car-uuid",
    "listerId": "user-uuid",
    "status": "Approved",
    "available": true
  }
}
```

---

## ⚙️ Quick Start

```bash
npm install
npm run dev
```

Visit →
`http://localhost:3002`

---

✅ **Health Check:**
`GET /` → `"Hello World! Car Service is running."`

---
