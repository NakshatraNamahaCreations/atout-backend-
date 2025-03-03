const express = require("express");
const router = express.Router();
const ProductController = require("../Controllers/productController");

// Create product
router.post("/products", ProductController.createProduct);

// Get all products
router.get("/products", ProductController.getProducts);

router.get("/products/check-sku", ProductController.checkSKUExists);

router.get("/last-four-maheshwari", ProductController.getLastFourMaheshwariSarees);
// Update a product
router.put('/products/:productId', ProductController.updateProduct);

router.get("/sold-products", ProductController.getSoldProducts);

// Delete a product
router.delete("/products/:productId", ProductController.deleteProduct);  // Fixed the route

module.exports = router;
