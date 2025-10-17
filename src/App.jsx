import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/authPage/AuthPage";
import Dashboard from "./pages/mainPage/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
