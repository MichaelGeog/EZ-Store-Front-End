import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/authPage/AuthPage";
import Dashboard from "./pages/mainPage/Dashboard";
import RegisterSale from "./pages/registerSalePage/registerSale";
import MyStore from "./pages/myStore/MyStore";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register-sale" element={<RegisterSale />} />
      <Route path="/my-store" element={<MyStore />} />
    </Routes>
  );
}

export default App;
