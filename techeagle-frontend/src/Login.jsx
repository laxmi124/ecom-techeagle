import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
  });

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://ecom-techeagle.onrender.com/api/login",
        formData
      );
      navigate("/customer/dashboard");
      console.log(response.data);
      // Handle successful login, e.g., store token in cookies and redirect to dashboard
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Login</h2>
      <label>Email:</label>
      <input type="text" name="email" onChange={handleChange} />
      <label>Phone:</label>
      <input type="text" name="phone" onChange={handleChange} />
      <label>Password:</label>
      <input type="password" name="password" onChange={handleChange} />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
