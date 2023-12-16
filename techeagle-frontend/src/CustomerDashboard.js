import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [user, setUser] = useState({}); // Assuming you store user details after login

  useEffect(() => {
    // Fetch inventory on component mount
    getInventoryDetails();
  }, []);

  const getInventoryDetails = async () => {
    try {
      const response = await axios.get(
        "https://ecom-techeagle.onrender.com/api/inventory"
      );
      setInventory(response?.data || []);
      // Handle successful login, e.g., store token in cookies and redirect to dashboard
    } catch (error) {
      console.error(error.response?.data);
    }
  };


   const addToCart = () => {
    //  try {
    //    const response = await axios.post(
    //      "http://localhost:8000/api/login",
    //      formData
    //    );
    //    navigate("/customer/dashboard");
    //    console.log(response.data);
    //    // Handle successful login, e.g., store token in cookies and redirect to dashboard
    //  } catch (error) {
    //    console.error(error.response.data);
    //  }
   };
  return (
    <div>
      {/* <h2>Welcome, {user.name}!</h2> */}

      <h3>Available Inventory</h3>
      <div>
        {inventory?.map((item) => (
          <div
            key={item._id}
            style={{
              justifyContent: "center",
              border: "1px solid black",
              padding: "2px",
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{ width: "200px", height: "300px", objectFit: "cover" }}
            />
            <p>{item.description}</p>
            <p>Quantity: {item.quantity}</p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p>Weight: {item.weight}</p>
              <p>Price: ${item.price}</p>
              <button onClick={() => addToCart()}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;
