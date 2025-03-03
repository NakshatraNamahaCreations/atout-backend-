const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    banner: { type: String, required: true },  // Banner image file path
    category: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }, // Banner status
    createdAt: { type: Date, default: Date.now }, // Timestamp for the banner creation
});

module.exports = mongoose.model('Banner', bannerSchema);
