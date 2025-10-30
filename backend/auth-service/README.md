
# 🧩 User Authentication Service

A simple **Node.js + Express + MongoDB** service for user registration and login using **JWT authentication**.

---

## 🚀 Base URL

```
http://localhost:3001/api/v1/users
```

---

## 📘 Endpoints

### **1️⃣ Register User**

**POST** `/register`

**Request:**

```json
{
  "fullname": "John Doe",
  "email": "johndoe@example.com",
  "password": "SecurePass123",
  "role": "customer"
}
```

**Success Response:**

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "publicId": "e4c2fbe6-2f0e-4a8f-b49b-32e43c1dc943"
  }
}
```

---

### **2️⃣ Login User**

**POST** `/login`

**Request:**

```json
{
  "email": "johndoe@example.com",
  "password": "SecurePass123"
}
```

**Success Response:**

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
}
```

---

## ⚙️ Quick Start

```bash
npm install
npm run dev
```

Visit:
`http://localhost:3001`

---

## 🧠 Tech Stack

* Node.js + Express
* MongoDB + Mongoose
* JWT for authentication
* bcrypt for password hashing

---

✅ **Health Check:**
`GET /` → `"Hello World! from Auth Service"`

---

