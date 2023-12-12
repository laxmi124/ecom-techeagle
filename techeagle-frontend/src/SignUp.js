import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    //email, phone, name, address, password, role
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    role: "",
  });

  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/register",
        formData
      );
      navigate("/login");
      // Handle successful signup, e.g., redirect to login page
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <label>Name:</label>
      <input type="text" name="name" onChange={handleChange} />

      <label>Email:</label>
      <input type="text" name="email" onChange={handleChange} />

      <label>Phone:</label>
      <input type="text" name="phone" onChange={handleChange} />

      <label>Address:</label>
      <input type="text" name="address" onChange={handleChange} />

      <label>Role:</label>
      <input type="text" name="role" onChange={handleChange} />

      <label>Password:</label>
      <input type="password" name="password" onChange={handleChange} />

      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default SignUp;
