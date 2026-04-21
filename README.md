# 🌐 Government Service Assistance Portal

A full-stack **MERN web application** designed to simplify access to government services by connecting citizens with verified agents. Users can apply for services, upload documents, track request status, and receive digitally generated certificates with QR-based verification.

---

## 🚀 Live Demo

🔗 **Frontend (Vercel):** https://govt-service-assistance-portal.vercel.app
🔗 **Backend (Render):** https://govt-service-assistance-portal.onrender.com

---

## ✨ Key Features

### 🔐 Authentication System

* OTP-based Registration & Login (Email + Password + OTP)
* Phone OTP Login
* Forgot Password with OTP Verification
* Secure JWT-based session management

### 👥 Role-Based Access

* **Citizen:** Apply for services & track requests
* **Agent:** Accept and process requests
* **Admin:** Approve/reject requests & manage users

### 📝 Service Management

* Request submission with document upload
* Real-time status tracking
* Timeline-based request flow

### 📄 Certificate System

* Auto-generated certificates (PDF)
* Integrated QR code verification
* Unique tracking ID for each request

### 🔔 Notifications

* Real-time notification system
* Read/unread status tracking

### 👤 User Features

* Profile management
* Change password (with last 3 password restriction)

---

## 🛠 Tech Stack

### Frontend

* React (Vite)
* Bootstrap

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Tools & Libraries

* JWT (Authentication)
* Multer (File Upload)
* PDFKit (Certificate Generation)
* QRCode (Verification System)
* Fast2SMS (OTP System)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/H99ik/govt-service-assistance-portal
cd govt-service-assistance-portal
```

---

### 2️⃣ Setup Backend

```bash
cd server
npm install
npm start
```

---

### 3️⃣ Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔄 System Workflow

1. User registers → OTP verification
2. User logs in → OTP authentication
3. User submits service request
4. Agent processes request
5. Admin approves/rejects
6. Certificate generated with QR code
7. User downloads and verifies certificate

---

## 🔐 Security Features

* JWT Authentication
* OTP-based Verification
* Role-Based Access Control
* Password History Restriction (last 3 passwords cannot be reused)
* Secure API handling

---

## 📸 Screenshots

*(Add UI screenshots after final polish)*

---

## ⚠️ Challenges Faced

* OTP integration and debugging across multiple flows
* CORS and deployment issues (Vercel + Render)
* API endpoint synchronization
* Real-time testing and error handling

---

## 🚀 Future Enhancements

* Multi-language support
* Improved CSC-style UI/UX
* Advanced analytics dashboard
* Mobile responsiveness improvements

---

## 👨‍💻 Author

**Hardikgiri Goswami**

---

## 📌 Project Status

✔ Core functionality completed
✔ OTP authentication system implemented
✔ Live deployment completed

---
