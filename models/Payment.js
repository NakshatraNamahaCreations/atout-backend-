const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  merchantOrderId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  transactionId: { type: String },
  status: { type: String, default: 'CREATED' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
