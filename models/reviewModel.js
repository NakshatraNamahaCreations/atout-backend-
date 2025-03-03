const mongoose = require("mongoose");
const moment = require("moment");

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }, // 1-5 star rating
  comment: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
});

// Virtual for formatted date
reviewSchema.virtual("formattedCreatedDate").get(function () {
  return moment(this.createdDate).format("DD/MM/YYYY");
});

module.exports = mongoose.model("Review", reviewSchema);
