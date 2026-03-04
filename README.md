# Payout Management System

A full-stack application for managing vendor payouts, featuring role-based access control (RBAC), vendor management, and a structured payout lifecycle.

## 🚀 Features

- **Authentication**: Secure login with JWT and HTTP-only cookies.
- **Role-Based Access Control**:
  - **OPS (Operations)**: Can manage vendors, create payouts, and edit pending payouts.
  - **FINANCE**: Can view payouts and take actions (Approve/Reject).
- **Vendor Management**: Create and view vendor profiles.
- **Payout Lifecycle**:
  - Create payouts in `Pending` state.
  - Approve or Reject payouts.
  - Full audit trail for payout actions.
- **Responsive UI**: Built with React and Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Tailwind CSS, Axios, Lucide React.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt.
- **Deployment**: Configured for Vercel.

---

## 📂 Project Structure

```text
payout-management/
├── Backend/           # Express Server
│   ├── config/        # Database configuration
│   ├── models/        # Mongoose schemas (User, Vendor, Payout, Audit)
│   ├── routes/        # API Endpoints
│   ├── server.js      # Main entry point
│   └── vercel.json    # Backend Vercel config
└── frontend/          # React App
    ├── src/
    │   ├── components/# Reusable UI components
    │   ├── context/   # Auth state management
    │   ├── pages/     # Dashboard, Vendors, Payouts
    │   └── config/    # API axios instance
    └── vercel.json    # Frontend Vercel config
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites

- Node.js installed
- MongoDB (Local or Atlas)

### 2. Backend Setup

1. Navigate to the `Backend` folder:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup

1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```
4. Start the app:
   ```bash
   npm start
   ```

---

## 📦 Deployment to Vercel

### Backend Deployment

1. Import the repository to Vercel.
2. Set the **Root Directory** to `Backend`.
3. Add the environment variables (`MONGO_URI`, `JWT_SECRET`, etc.).
4. Deploy.

### Frontend Deployment

1. Import the repository to Vercel.
2. Set the **Root Directory** to `frontend`.
3. Add `REACT_APP_API_URL` (pointing to your deployed backend URL).
4. Deploy.

_See the full [Deployment Guide](./.gemini/antigravity/brain/61cc9ed6-4ff4-48b2-8ad8-8955c47cb357/deployment_guide.md) for more details._

---

## 🔐 Demo Credentials

_Note: Run `demouser.js` in the Backend to seed these users if needed._

- **OPS User**: (As configured in your database)
- **Finance User**: (As configured in your database)
