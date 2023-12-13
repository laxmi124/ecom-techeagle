const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
// mongoose.connect(
//   "mongodb+srv://duttasuravi225:nX6QEuhYrigcURzy@techeagledb.cbsntze.mongodb.net/?retryWrites=true&w=majority",
//   {
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// );
const DB_URL =
  "mongodb+srv://duttasuravi225:nX6QEuhYrigcURzy@techeagledb.cbsntze.mongodb.net/?retryWrites=true&w=majority";
app.use(express.json());

const connect = () => {
  return mongoose.connect(DB_URL);
};

// Define MongoDB Schemas
const userSchema = new mongoose.Schema({
  email: String,
  phone: String,
  name: String,
  address: String,
  password: String,
  role: String, // "Customer" or "Manager"
});

const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  weight: Number,
  quantity: Number,
  price: Number,
});

const orderSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  products: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      quantity: Number,
    },
  ],
  status: String, // "Pending", "Processing", "Shipped", "Delivered"
});

// Define MongoDB Models
const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);
const Order = mongoose.model("Order", orderSchema);

// Define APIs

// User Management APIs
app.post("/api/register", async (req, res) => {
  try {
    const { email, phone, name, address, password, role } = req.body;

    // Check if user with the provided email or phone already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Check if the provided role is valid
    if (!["Customer", "Manager"].includes(role)) {
      return res.status(400).json({ error: "Invalid user role" });
    }

    // If the user doesn't exist and the role is valid, proceed with registration
    const user = new User({ email, phone, name, address, password, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/api/login", async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { phone }] });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "secret-key",
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Customer APIs
app.get("/api/inventory", async (req, res) => {
  try {
    const inventory = await Product.find();
    res.json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/api/cart/add", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Implement logic to add item to user's cart
    // You may want to create a cart schema and link it to the user
    // For simplicity, let's assume a basic structure here
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.cart.push({ productId, quantity });
    await user.save();

    res.json({ message: "Item added to cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "cart.productId",
      "name price"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/cart", async (req, res) => {
  try {
    const { userId } = req.query;
    // Implement logic to get user's cart
    res.json(userCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/cart/update", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Implement logic to update cart item quantities
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cartItem = user.cart.find((item) => item.productId.equals(productId));
    if (!cartItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.json({ message: "Cart item quantity updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/orders/place", async (req, res) => {
  try {
    const { userId } = req.body;

    // Implement logic to place orders
    const user = await User.findById(userId).populate(
      "cart.productId",
      "name price"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.cart.length === 0) {
      return res
        .status(400)
        .json({ error: "Cart is empty. Add items to the cart first." });
    }

    // Create an order
    const order = new Order({
      customerId: user._id,
      products: user.cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      status: "Pending",
    });

    // Clear the user's cart
    user.cart = [];
    await Promise.all([order.save(), user.save()]);

    res.json({ message: "Order placed successfully", orderId: order._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/orders/track/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    // Implement logic to track order status
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ status: order.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Manager APIs
app.post("/api/inventory/add", async (req, res) => {
  try {
    const { name, image, description, weight, quantity, price } = req.body;
    const product = new Product({
      name,
      image,
      description,
      weight,
      quantity,
      price,
    });
    await product.save();
    res
      .status(201)
      .json({ message: "Product added to inventory successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/inventory/update/:productId", async (req, res) => {
  // Implement logic to update quantity of a product in inventory
});

app.delete("/api/inventory/delete/:productId", async (req, res) => {
  // Implement logic to delete a product from inventory
});

app.post("/api/orders/update-status/:orderId", async (req, res) => {
  // Implement logic to update order status
});

app.listen(PORT, async () => {
  try {
    await connect();
    console.log("app is running on port", PORT);
  } catch (error) {
    console.log("error is ", error.message);
  }
});
