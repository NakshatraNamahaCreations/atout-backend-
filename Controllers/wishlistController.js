const Wishlist = require("../models/wishlistModel");

const toggleWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: "Missing userId or productId" });
        }

        let existingItem = await Wishlist.findOne({ userId, productId });

        if (existingItem) {
            existingItem.status = existingItem.status === "active" ? "inactive" : "active";
            await existingItem.save();
        } else {
            existingItem = new Wishlist({ userId, productId, status: "active" });
            await existingItem.save();
        }

        return res.status(200).json({
            message: existingItem.status === "active" ? "Product added to wishlist" : "Product removed from wishlist",
            status: existingItem.status
        });

    } catch (error) {
        console.error("Error updating wishlist:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.status(400).json({ message: "User ID is required" });

        // Fetch active wishlist items and populate product details
        const wishlistItems = await Wishlist.find({ userId, status: "active" }).populate("productId");

        res.status(200).json(wishlistItems); // Send back the wishlist items
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = { toggleWishlist, getWishlist };
