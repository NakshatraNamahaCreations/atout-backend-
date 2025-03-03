const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

// Create a Review
exports.createReview = async (req, res) => {
  try {
    const { productId, customerName, rating, comment } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Check if product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Create new review
    const newReview = new Review({ productId, customerName, rating, comment });
    const savedReview = await newReview.save();

    return res.status(201).json({ success: true, message: "Review added successfully", review: savedReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// Get Reviews for a Product
exports.getReviews = async (req, res) => {
    try {
      const { productId } = req.params;
  
      // 🔍 Check if the product exists
      const productExists = await Product.findById(productId);
      if (!productExists) {
        console.error(`Product with ID ${productId} not found`);
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      const reviews = await Review.find({ productId }).sort({ createdDate: -1 });
      res.status(200).json({ success: true, reviews });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  
// Delete a Review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
