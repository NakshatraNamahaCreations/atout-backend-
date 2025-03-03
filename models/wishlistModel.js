const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    userId:{type: String},
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
    
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
