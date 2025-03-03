const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/productModel");

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads"); // Path to save images
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Create folder if it doesn't exist
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage }).array("images", 5); 

// Create Product API
exports.createProduct = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }

    try {
      console.log("✅ Request Body:", req.body);
      console.log("✅ Uploaded Files:", req.files);

      const imageUrls = req.files ? req.files.map((file) => file.filename) : [];

      let { name, category, category_id, price, sku, material, color, description, length, width, details, stock } = req.body;

      // Convert data types properly
      price = parseFloat(price);
      length = parseFloat(length) || 0;
      width = parseFloat(width) || 0;
      stock = parseInt(stock, 10);

      // 🛑 Check if SKU already exists
      const existingProduct = await Product.findOne({ sku });
      if (existingProduct) {
        return res.status(400).json({ success: false, message: `A product with SKU '${sku}' already exists. Please use a different SKU.` });
      }

      // Create new product
      const newProduct = new Product({
        name, category, category_id, price, sku, material, color, description, length, width, details, stock, images: imageUrls,
      });

      const savedProduct = await newProduct.save();
      return res.status(201).json({ success: true, message: "Product added successfully", product: savedProduct });

    } catch (error) {
      console.error("❌ Error saving product:", error);
      res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
  });
};

// Check if SKU Exists API
exports.checkSKUExists = async (req, res) => {
  try {
    const { sku } = req.query;
    const existingProduct = await Product.findOne({ sku });
    res.json({ exists: !!existingProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error checking SKU", error: error.message });
  }
};


// Get Products API
exports.getProducts = async (req, res) => {
  try {
    let { minPrice, maxPrice, color, material } = req.query;
    let filter = {};

    // Price range filter
    if (minPrice && maxPrice) {
      filter.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
    } else if (minPrice) {
      filter.price = { $gte: parseFloat(minPrice) };
    } else if (maxPrice) {
      filter.price = { $lte: parseFloat(maxPrice) };
    }

    // Color filter (only if provided)
    if (color) {
      filter.color = { $regex: new RegExp(color, "i") }; // Case-insensitive regex match
    }

    // Material filter (only if provided)
    if (material) {
      filter.material = { $regex: new RegExp(material, "i") }; // Case-insensitive regex match
    }

    console.log("🔍 Applied Filters:", filter);

    const products = await Product.find(filter).sort({ createdDate: -1 });

    const productsWithUrls = products.map((product) => ({
      ...product.toObject(),
      images: product.images.map(
        (image) => `https://api.atoutfashion.com/uploads/${image}`
      ),
      formattedCreatedDate: product.formattedCreatedDate,
    }));

    res.status(200).json({ success: true, data: productsWithUrls });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};






exports.sellProduct = async (req, res) => {
  const { productId, quantitySold } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if there is enough stock
    if (product.stock < quantitySold) {
      return res.status(400).json({ success: false, message: "Not enough stock available" });
    }

    // Reduce the stock
    product.stock -= quantitySold;

    // Save the updated product
    const updatedProduct = await product.save();

    res.status(200).json({ success: true, message: "Product sold successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error selling product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



exports.updateProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err); // Log multer errors
      return res.status(500).json({ success: false, message: err.message });
    }

    try {
      const { productId } = req.params;
      console.log("Received product ID for update:", productId); 

      const product = await Product.findById(productId); 
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      
      const imageUrls = req.files.length
        ? req.files.map((file) => file.filename)
        : product.images; 

 
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { ...req.body, images: imageUrls },
        { new: true }
      );

      res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
      console.error("Error updating product:", error); 
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
};


exports.getLastFourMaheshwariSarees = async (req, res) => {
  try {
    const category = "Maheshwari Cotton Sarees"; 

  
    const products = await Product.find({ category })
      .sort({ createdDate: -1 }) // Sort by latest createdDate
      .limit(4); // Fetch only the last 4 products

    const productsWithUrls = products.map((product) => ({
      ...product.toObject(),
      images: product.images.map((image) => `https://api.atoutfashion.com/uploads/${image}`),
      formattedCreatedDate: product.formattedCreatedDate,
    }));

    res.status(200).json({ success: true, data: productsWithUrls });
  } catch (error) {
    console.error("Error fetching last 4 Maheshwari Sarees:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



exports.getSoldProducts = async (req, res) => {
  try {
    // Fetch products where sold count is greater than 1
    const products = await Product.find({ sold: { $gt: 1 } })
      .sort({ sold: -1 }) // Sort by highest sold count
      .limit(10); // Limit to last 10 sold products (you can change this if needed)

    const productsWithUrls = products.map((product) => ({
      ...product.toObject(),
      images: product.images.map((image) => `https://api.atoutfashion.com/uploads/${image}`),
      formattedCreatedDate: product.formattedCreatedDate,
    }));

    res.status(200).json({ success: true, data: productsWithUrls });
  } catch (error) {
    console.error("Error fetching sold products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params; 

    
    const product = await Product.findByIdAndDelete(productId);
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
