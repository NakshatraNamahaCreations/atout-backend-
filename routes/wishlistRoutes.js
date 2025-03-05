const express = require("express");
const { toggleWishlist, getWishlist } = require("../Controllers/wishlistController");

const router = express.Router();

router.post("/wishlist", toggleWishlist);
router.get("/wishlist/:userId", getWishlist); // Make sure getWishlist is correctly imported

module.exports = router;
