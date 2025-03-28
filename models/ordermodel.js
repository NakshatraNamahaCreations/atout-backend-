const mongoose = require("mongoose");
const moment = require("moment");

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: "Pending" },
});

const addressSchema = new mongoose.Schema({
  customerId: { type: String, default: "" },
  address: { type: String, required: true },
  number: { type: String, required: true },
  city: { type: String, required: true },
});

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: {
    type: {
      address: { type: String, required: true },
      number: { type: String, required: true },
      city: { type: String, required: true },
    },
    required: true,
  },
  phoneNumber: { type: String, required: true },
  cartItems: [
    {
      images: [{ type: String, required: true }], 
      category: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      status: { type: String, default: "Pending" },
      sku: { type: String, required: true },
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    },
  ],
  paymentMethod: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  coupon: { type: String, default: "No Coupon Applied" },

  userId:{type: String}
  
},
{ timestamps: true }

);


orderSchema.virtual("formattedDate").get(function () {
  return moment(this.date).format("D/M/YYYY"); // Formats as 3/2/2025
});

// Ensure virtuals are included when converting to JSON
orderSchema.set("toJSON", { virtuals: true });


module.exports = mongoose.model("Order", orderSchema);

