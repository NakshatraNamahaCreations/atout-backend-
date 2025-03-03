const express = require("express");
const router = express.Router();
const productController = require("../Controllers/productController");

// Create product
router.post("/products", productController.createProduct);

// Get all products
router.get("/products", productController.getProducts);

router.get("/products/check-sku", productController.checkSKUExists);

router.get("/last-four-maheshwari", productController.getLastFourMaheshwariSarees);
// Update a product
router.put('/products/:productId', productController.updateProduct);

router.get("/sold-products", productController.getSoldProducts);

// Delete a product
router.delete("/products/:productId", productController.deleteProduct);  // Fixed the route

module.exports = router;
