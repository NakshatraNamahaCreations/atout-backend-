const express = require("express");
const router = express.Router();
const { getOrders, createOrder, updateOrder, deleteOrder, getOrdersByUserId } = require("../Controllers/orderController");

router.get("/", getOrders); // Fetch all orders
router.get("/user/:userId", getOrdersByUserId); // Fetch orders for a specific user
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
