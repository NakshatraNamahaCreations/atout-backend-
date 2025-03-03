const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

// User Routes
router.post("/register", customerController.register);
router.post("/login", customerController.login);
router.post("/customers/loginWithMobileNumber", customerController.loginWithMobileNumber);
router.get("/customers/:id", customerController.getProfile);
router.get("/all", customerController.getAllUser);
router.post("/customers/addAddress/:id", customerController.addAddress);
router.put("/update/:id", customerController.updateProfile);

router.delete("/delete/:id", customerController.deleteUser);

module.exports = router;
