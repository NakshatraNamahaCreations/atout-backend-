const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customerController");

// User Routes
router.post("/register", CustomerController.register);
router.post("/login", CustomerController.login);
router.post("/customers/loginWithMobileNumber", CustomerController.loginWithMobileNumber);
router.get("/customers/:id", CustomerController.getProfile);
router.get("/all", CustomerController.getAllUser);
router.post("/customers/addAddress/:id", CustomerController.addAddress);
router.put("/update/:id", CustomerController.updateProfile);

router.delete("/delete/:id", CustomerController.deleteUser);

module.exports = router;
