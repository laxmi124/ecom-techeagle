import React, { useEffect, useState } from "react";
import axios from "axios";

function inventory() {
  const [inventoryDetails, setInventoryDetails] = useState([]);

  useEffect(() => {
    console.log("laxmi");
    // getInventoryDetails();
  }, []);

  const getInventoryDetails = async () => {
    try {
      const response = await axios.get(
        "https://ecom-techeagle.onrender.com/api/inventory"
      );
      navigate("/customer/dashboard");
      console.log(response.data);
      // Handle successful login, e.g., store token in cookies and redirect to dashboard
    } catch (error) {
      console.error(error.response.data);
    }
  };
  return <div></div>;
}

export default inventory;
