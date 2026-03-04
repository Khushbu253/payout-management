import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import AddVendor from "./pages/AddVendor";
import Payouts from "./pages/Payouts";
import CreatePayout from "./pages/CreatePayout";
import PayoutDetail from "./pages/PayoutDetail";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />

              {/* Vendors - Accessible by both roles */}
              <Route path="/vendors" element={<Vendors />} />

              {/* Add Vendor - Restricted to OPS */}
              <Route element={<PrivateRoute requiredRole="OPS" />}>
                <Route path="/vendors/new" element={<AddVendor />} />
              </Route>

              {/* Payouts Base List */}
              <Route path="/payouts" element={<Payouts />} />

              {/* Create Payout - OPS only */}
              <Route element={<PrivateRoute requiredRole="OPS" />}>
                <Route path="/payouts/new" element={<CreatePayout />} />
              </Route>

              {/* Payout Details (has its own internal action protection buttons) */}
              <Route path="/payouts/:id" element={<PayoutDetail />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
