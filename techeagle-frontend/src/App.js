import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
import CustomerDashboard from "./CustomerDashboard";
import ManagerDashboard from "./ManagerDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
