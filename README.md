<div align="center">

  # ♻️ eRevive
  ### AI-Powered Circular E-Waste Management & Recycling Platform

  [![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-4.18-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
  [![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![Gemini AI](https://img.shields.io/badge/Google_Gemini-Vision_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
  [![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
  [![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://render.com/)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

  <p align="center">
    <b>Transforming Electronic Waste into Sustainable Circular Value through Multimodal AI Recognition & Real-Time Impact Incentives.</b>
  </p>

  <p align="center">
    <a href="https://erevive.vercel.app"><b>🌐 Live Application Demo</b></a> •
    <a href="https://erevive-backend.onrender.com/health"><b>⚡ Backend Health API</b></a> •
    <a href="https://github.com/shaheem3475/eRevive"><b>📦 GitHub Repository</b></a> •
    <a href="docs/API.md"><b>📖 API Documentation</b></a>
  </p>

</div>

---

## 📌 Project Overview

**eRevive** is an enterprise-grade circular e-waste management platform engineered to resolve global electronic waste accumulation. Powered by **Google Gemini Vision AI**, eRevive automates hardware classification, assesses condition defects, estimates market resale values in INR, and recommends optimal circular actions—whether to **SELL**, **DONATE**, **RECYCLE**, or **STORE**.

By combining multimodal computer vision, transparent valuation algorithms, dynamic eco-points rewards, and logistics booking, eRevive empowers consumers and enterprise organizations to extend hardware lifecycles while isolating environmental toxins.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Layer (Vercel)"]
        UI["Glassmorphism Web Console"]
        Config["config.js (API Base URL Resolver)"]
        AuthClient["Firebase Auth Client (Web SDK)"]
    end

    subgraph API["Backend Service (Render Node.js / Express)"]
        Server["Express.js Server Engine"]
        SecMiddleware["Security Middleware (Helmet, CORS, Rate Limiter)"]
        AuthMiddleware["Firebase Token Verifier"]
        Controllers["Controller Handlers (Sell, Donate, Recycle, Admin)"]
        DecisionEngine["AI Decision & Business Rules Engine"]
    end

    subgraph External["Cloud Infrastructure & Services"]
        MongoDB[("MongoDB Atlas Database")]
        FirebaseAdmin["Firebase Admin Auth SDK"]
        Cloudinary["Cloudinary CDN Image Store"]
        GeminiAI["Google Gemini Multimodal Vision API"]
    end

    UI --> Config
    Config --> Server
    AuthClient --> FirebaseAdmin
    Server --> SecMiddleware
    SecMiddleware --> AuthMiddleware
    AuthMiddleware --> Controllers
    Controllers --> DecisionEngine
    DecisionEngine --> GeminiAI
    Controllers --> Cloudinary
    Controllers --> MongoDB
```

---

## ✨ Key Features

### 🔍 1. AI Vision & Decision Engine
- **Multimodal Scanning**: Upload hardware photos or capture live device images for instant analysis.
- **Automated Identification**: Identifies brand, model name, category, hardware condition, and confidence rating.
- **Smart Recommendations**: Evaluates market value, reuse potential, and eco-impact to output tailored action strategies:
  - 💵 **SELL**: Direct cash offer calculation for high resale-value devices.
  - 🎁 **DONATE**: Refurbishing stream for schools and community centers (+150 Eco Points).
  - ♻️ **RECYCLE**: Certified zero-landfill disposal with free logistics pickup or drop-off.
  - 📦 **STORE**: Safe long-term battery & component storage guidelines.

### 💰 2. Dynamic Pricing Engine
- Algorithmic valuation considering base category prices, condition multipliers (*Like New*, *Good*, *Fair*, *Poor*), and defect deductions (cracked screen, battery wear, dents).

### 🗺️ 3. Pickup Logistics & Maps Integration
- Interactive **OpenStreetMap** pin positioning to calculate real-time distance from eRevive HQ (Delhi) and estimate pickup fees (₹5/km).

### 🎁 4. Gamified Eco-Rewards & Leaderboards
- Earn **Eco Points** on every recycling and donation action.
- Tier progression (*Silver*, *Gold*, *Platinum*) with instant voucher redemptions (Amazon, Zomato, BookMyShow).

### 📊 5. Comprehensive Admin & Analytics Console
- Real-time administrative dashboard for request moderation, user activity logging, aggregate environmental impact tracking (CO₂ saved, e-waste diverted, trees equivalent), and PDF/CSV data exports.

---

## 🤖 AI Capabilities

```json
{
  "deviceName": "Apple iPhone 13 Pro",
  "brand": "Apple",
  "category": "Smartphone",
  "condition": "Like New",
  "confidence": 96,
  "estimatedValue": {
      "min": 65000,
      "max": 72000,
      "currency": "INR"
  },
  "recommendation": "SELL",
  "reason": "Device retains high resale demand. Selling recovers maximum value.",
  "ecoImpact": {
      "carbonSavedKg": 18,
      "ewastePreventedKg": 0.4,
      "treesEquivalent": 3
  }
}
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | HTML5, Vanilla JavaScript (ES6+), Vanilla CSS3, Tailwind CSS CDN, FontAwesome, Leaflet.js Maps, Chart.js, jsPDF |
| **Backend Core** | Node.js (v18+), Express.js framework, CORS, Helmet, Express-Rate-Limit, Express-Validator |
| **Artificial Intelligence** | Google Gemini Multimodal Vision API (`@google/generative-ai`) |
| **Database & ORM** | MongoDB Atlas, Mongoose ODM |
| **Authentication** | Firebase Authentication (Client Web SDK + Server Firebase Admin SDK) |
| **Cloud Storage** | Cloudinary Image CDN |
| **Deployment Platform** | Vercel (Frontend Static SPA), Render (Backend Node.js API Service) |

---

## 📁 Folder Structure

```
eRevive/
├── index.html                  # Landing Page & Auth Modals
├── dashboard.html              # User Dashboard Console
├── admin.html                  # Administrative Management & Analytics
├── config.js                   # Centralized API Base URL Resolver
├── styles.css                  # Custom Design System & Glassmorphism Styles
├── vercel.json                 # Vercel Deployment SPA Routing Rules
├── backend/
│   ├── server.js               # Main Express Application Entry Point
│   ├── config/
│   │   ├── db.js               # MongoDB Atlas Mongoose Connection
│   │   └── firebase.js         # Firebase Admin SDK Initialization
│   ├── controllers/            # API Route Controllers (Auth, Sell, Donate, Recycle, Admin, Vision)
│   ├── middleware/             # Security, Auth Guard, Sanitization & Error Middleware
│   ├── models/                 # Mongoose Schemas (User, SellDevice, DonationRequest, etc.)
│   ├── routes/                 # Express Router Endpoints
│   ├── services/               # Gemini AI Vision, Cloudinary, Business Rules
│   └── package.json            # Node.js Dependencies & Engine Scripts
└── docs/
    └── API.md                  # Comprehensive Backend API Specification
```

---

## 🚀 Installation & Local Development

<details>
<summary><b>Click to expand local setup instructions</b></summary>

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local instance or MongoDB Atlas URI
- **Firebase Project**: Firebase Auth enabled (Email/Password & Google)

### Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/shaheem3475/eRevive.git
   cd eRevive
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   Copy `.env.example` to `.env` inside the `backend/` directory:
   ```bash
   cp .env.example .env
   ```
   Fill in your credentials in `backend/.env`.

4. **Start Local Development Server**
   ```bash
   npm run dev
   ```
   The backend API server will start on `http://localhost:5000`.

5. **Access Application Frontend**
   Open `index.html` directly in your browser or run via Live Server. `config.js` automatically routes local frontend requests to `http://localhost:5000`.

</details>

---

## 🔐 Environment Variables (.env.example)

<details>
<summary><b>Click to expand backend environment variable schema</b></summary>

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/erevive

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Firebase Admin SDK Config
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"

# Firebase Web Config
FIREBASE_WEB_API_KEY=your_firebase_web_api_key
FIREBASE_WEB_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_WEB_STORAGE_BUCKET=your_project.firebasestorage.app
FIREBASE_WEB_MESSAGING_SENDER_ID=123456789
FIREBASE_WEB_APP_ID=1:123456789:web:abcdef

# Frontend Security
FRONTEND_ORIGINS=http://localhost:5000,http://127.0.0.1:5500,https://erevive.vercel.app

# Google Gemini AI Config
GEMINI_API_KEY=your_google_gemini_api_key
```

</details>

---

## ☁️ Deployment Guide

### Backend Deployment (Render)
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository and set Root Directory to `backend`.
3. Set Build Command: `npm install`
4. Set Start Command: `node server.js`
5. Add environment variables under Render Service Settings.
6. Use `/health` for Render Health Check endpoint.

### Frontend Deployment (Vercel)
1. Import repository to [Vercel](https://vercel.com).
2. Select Root Directory as `./` (Project Root).
3. Framework Preset: **Other / Static HTML**.
4. Deploy! `vercel.json` automatically manages routing for `/dashboard` and `/admin`.

---

## 🖼️ Application Preview

| User Dashboard Console | AI Recommendation Engine |
| :---: | :---: |
| ![User Dashboard Placeholder](eRevive.png) | ![AI Vision Card Placeholder](1000_F_471605919_A9olxL3r0Iky3LDiEO8qgRf5yvHNawoR.jpg) |

| Admin Management Console | Analytics & Leaderboards |
| :---: | :---: |
| ![Admin Console Placeholder](background.jpg) | ![Analytics Visuals Placeholder](WhatsApp%20Image%202025-02-27%20at%2021.25.54_d5959db5.jpg) |

---

## 🔒 Security & Performance

- **Token-Based Guarding**: Server-side Firebase ID Token verification via `authMiddleware.js`.
- **API Secret Isolation**: Gemini API Key, Cloudinary secrets, and Firebase Private Keys are restricted to backend environment variables.
- **Request Sanitization & Helmet**: Express inputs are sanitized against injection attacks with HTTP security headers.
- **Rate Limiting**: Configured `express-rate-limit` prevents brute-force abuse.
- **Zero Localhost Hardcoding**: Single-source `config.js` handles cross-origin environment switching seamlessly.

---

## 🚀 Future Enhancements

- [ ] Automated CO₂ Offsetting Certificates via Blockchain Ledger.
- [ ] Integration with India Post & Courier APIs for automated shipping label generation.
- [ ] Mobile Application (React Native / Flutter).
- [ ] B2B Enterprise E-Waste Disposal Procurement Portal.

---

## 👨‍💻 Author & Developer Info

**Developed by Shaheem Puzhakkal**  
*Full-Stack Engineer & AI Solution Developer*

- 🌐 GitHub: [@shaheem3475](https://github.com/shaheem3475)
- 📧 Project Contact: `shaheem3475@gmail.com`
- 🏫 Platform: **eRevive Circular E-Waste Management**

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<div align="center">

  **🌱 Built with passion for a cleaner, greener, circular tech future.**  
  *© 2026 eRevive. All Rights Reserved.*

</div>
