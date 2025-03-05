const express = require("express");
const router = express.Router();
const { createReview, getReviews } = require("../Controllers/reviewController");

// ✅ Route to create a review
router.post("/reviews", createReview);

// ✅ Route to get reviews for a product
router.get("/reviews/:productId", getReviews);

module.exports = router;
