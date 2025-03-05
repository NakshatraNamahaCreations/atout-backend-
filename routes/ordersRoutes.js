const express = require("express");
const router = express.Router();
const { getOrders, createOrder, updateOrder, deleteOrder, getOrdersByUserId } = require("../Controllers/orderController");

router.get("/", getOrders); 
router.get("/user/:userId", getOrdersByUserId); 
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
