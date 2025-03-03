const Order = require("../models/ordermodel");
const mongoose = require("mongoose");
const Product = require("../models/productModel");
// Fetch all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1, _id: -1 }).exec(); // Double-check sorting
    console.log("Sorted Orders:", orders);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Create a new order
const createOrder = async (req, res) => {
  console.log("Received Order Data:", req.body); 

  const orderData = req.body;

  if (
    !orderData.email ||
    !orderData.firstName ||
    !orderData.lastName ||
    !orderData.address ||
    !orderData.cartItems ||
    !Array.isArray(orderData.cartItems) ||
    orderData.cartItems.length === 0 ||
    !orderData.paymentMethod ||
    !orderData.totalAmount ||
    !orderData.userId
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check stock availability before proceeding
    for (const item of orderData.cartItems) {
      const product = await Product.findById(item._id).session(session);
      if (!product) {
        throw new Error(`Product not found: ${item.name}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Not enough stock for: ${item.name}`);
      }
    }

    // Reduce stock after stock check passes
    for (const item of orderData.cartItems) {
      await Product.findByIdAndUpdate(
        item._id,
        { 
          $inc: { stock: -item.quantity, sold: item.quantity } // Decrease stock, increase sold count
        },
        { new: true, session }
      );
    }

    // Save the order
    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save({ session });

    await session.commitTransaction();
    session.endSession();

    console.log("Order saved successfully:", savedOrder);
    res.status(201).json({ 
      success: true, 
      order: {
        ...savedOrder.toObject(), 
        coupon: savedOrder.coupon || "No Coupon Applied" 
      } 
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL parameter

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).exec();

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const updateOrder = async (req, res) => {
  const { status, cartItems } = req.body;
  const { id } = req.params;

  console.log("Received orderId:", id); // Log orderId
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status, cartItems },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: error.message });
  }
};








// Delete an order
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOrders, createOrder, updateOrder, deleteOrder, getOrdersByUserId };
