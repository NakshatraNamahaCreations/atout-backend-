const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category: { type: String, required: true }, // Renamed 'name' to 'category' 
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Category', categorySchema);
