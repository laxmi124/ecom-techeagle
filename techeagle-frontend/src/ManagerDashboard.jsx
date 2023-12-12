import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagerDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch inventory and orders on component mount
    const fetchInventoryAndOrders = async () => {
      try {
        const inventoryResponse = await axios.get("/api/inventory");
        setInventory(inventoryResponse.data);

        const ordersResponse = await axios.get("/api/orders/all");
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInventoryAndOrders();
  }, []);

  return (
    <div>
      <h2>Manager Dashboard</h2>

      <h3>Available Inventory</h3>
      <ul>
        {inventory.map((item) => (
          <li key={item._id}>
            <img src={item.image} alt={item.name} />
            <p>{item.description}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Weight: {item.weight}</p>
            <p>Price: ${item.price}</p>
            <button /* Implement logic to edit item */>Edit</button>
            <button /* Implement logic to delete item */>Delete</button>
          </li>
        ))}
      </ul>

      <h3>All Orders</h3>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <p>Order ID: {order._id}</p>
            <p>Status: {order.status}</p>
            {/* Add more details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagerDashboard;
