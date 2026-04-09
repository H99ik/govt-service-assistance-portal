# 🌐 Government Service Assistance Portal

A full-stack MERN web application that helps citizens apply for government services, upload documents, track request status, and receive digitally generated certificates with QR verification.

---

## 🚀 Features

* 🔐 Authentication (JWT + OTP based login & registration)
* 👥 Role-Based Access (Citizen / Agent / Admin)
* 📝 Service Request System
* 📂 Document Upload (Multer)
* 📊 Agent Dashboard (Accept & Process Requests)
* 🛠 Admin Dashboard (Approve / Reject Requests)
* 📄 Certificate Generation (PDF with QR Code)
* 🔍 QR-Based Certificate Verification
* 🔔 Notification System
* 👤 User Profile Management
* 🔐 Secure Password System (last 3 password restriction)

---

## 🛠 Tech Stack

**Frontend:**

* React (Vite)
* Bootstrap

**Backend:**

* Node.js
* Express.js

**Database:**

* MongoDB

**Other Tools:**

* JWT (Authentication)
* Multer (File Upload)
* PDFKit (Certificate Generation)
* QRCode (Verification System)
* Fast2SMS (OTP System)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

git clone https://github.com/H99ik/govt-service-assistance-portal
cd govt-service-assistance-portal

---

### 2️⃣ Setup Backend

cd server
npm install
npm start

---

### 3️⃣ Setup Frontend

cd client
npm install
npm run dev

---

## 📄 Certificate System

* Certificates are generated automatically after admin approval
* Each certificate contains a unique ID and QR code
* Users can verify certificates via QR scan or verification page

---

## 🔐 Security Features

* JWT Authentication
* OTP Verification
* Role-Based Access Control
* Password History Restriction (last 3 passwords cannot be reused)

---

## 📸 Screenshots

(Add after UI polish)

---

## 👨‍💻 Author

Hardik Goswami

---

## 💡 Project Status

✔ Core functionality completed
🚀 UI polish and deployment in progress

---

## ⭐ Future Enhancements

* Multi-language support
* Improved UI/UX (CSC-style design)
* Analytics dashboard

---
