const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobilenumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  saved_address: [{ address: { type: String, required: true } }],

  image: { type: String } // Storing image URL
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
