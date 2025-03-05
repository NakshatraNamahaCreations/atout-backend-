const mongoose = require('mongoose');
const Category = require('../models/Category');


exports.addCategory = async (req, res) => {
    try {
        const { category, status } = req.body;  

        if (!category || !status) {
            return res.status(400).json({ message: 'Category and Status are required' });
        }

        const newCategory = new Category({
            category,  // Use 'category' instead of 'name'
            status,
        });

        await newCategory.save();
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get All Categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Update Category
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("Received ID for update:", id); // Debug log

        // Validate ID format before database interaction
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("Invalid ID format");
            return res.status(400).json({ message: "Invalid category ID format" });
        }

        // Update the category
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedCategory) {
            console.log("Category not found");
            return res.status(404).json({ message: "Category not found" });
        }

        console.log("Category updated successfully:", updatedCategory);
        res.status(200).json(updatedCategory);
    } catch (err) {
        console.error("Error updating category:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};




// Delete Category
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid category ID format" });
        }

        const category = await Category.findById(id);

        // Check if the category exists
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Use deleteOne instead of remove to delete the category
        await category.deleteOne(); 
        res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (err) {
        console.error("Error deleting category:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


