const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Banner = require("../models/bannerModel");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); 
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage }).single("banner");



exports.createBanner = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }

    console.log("Uploaded file:", req.file); // Debugging
    console.log("Request body:", req.body);

    if (!req.file) {
      return res.status(400).json({ success: false, message: "File upload failed. Please select a valid banner image." });
    }

    const bannerPath = req.file.filename;
    const { category, status } = req.body;

    if (!category) {
      return res.status(400).json({ success: false, message: "Please select a category." });
    }

    const newBanner = new Banner({
      banner: bannerPath,
      category,
      status: status || "Active",
    });

    const savedBanner = await newBanner.save();
    return res.status(201).json({ success: true, message: "Banner added successfully", banner: savedBanner });
  });
};






// Controller to get all banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to update a banner's status
exports.updateBanner = async (req, res) => {
  try {
    const { bannerId } = req.params; // Access the bannerId from the URL params

    const banner = await Banner.findById(bannerId); // Find the banner by ID
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    // Update the banner with the new data (status only in this case)
    const updatedBanner = await Banner.findByIdAndUpdate(
      bannerId,
      { status: req.body.status }, // Update only the status
      { new: true } // This returns the updated banner
    );

    res.status(200).json({ success: true, data: updatedBanner });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Controller to delete a banner
// Controller to delete a banner
exports.deleteBanner = async (req, res) => {
  try {
    const { bannerId } = req.params; // Access the banner ID from the route parameter

    const banner = await Banner.findByIdAndDelete(bannerId); // Find and delete the banner by ID

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    // Delete the banner image file from the server
    if (fs.existsSync(banner.banner)) {
      fs.unlinkSync(banner.banner); // Remove the file
    }

    res.status(200).json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

