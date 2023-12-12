import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [user, setUser] = useState({}); // Assuming you store user details after login

  useEffect(() => {
    // Fetch inventory on component mount
    const fetchInventory = async () => {
      try {
        const response = await axios.get('/api/inventory');
        setInventory(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>

      <h3>Available Inventory</h3>
      <ul>
        {inventory.map((item) => (
          <li key={item._id}>
            <img src={item.image} alt={item.name} />
            <p>{item.description}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Weight: {item.weight}</p>
            <p>Price: ${item.price}</p>
            <button>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerDashboard;
