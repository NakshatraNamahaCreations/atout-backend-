const multer = require("multer");
const path = require("path");
const UserSchema = require("../models/Customer");
const bcrypt = require("bcrypt");

// Multer Storage Config for Image Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Make sure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage }).single("image"); // Accept single file upload

exports.register = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Image upload failed", error: err.message });
        }

        try {
            const { username, email, mobilenumber, password, saved_address } = req.body;

            // Check for existing user
            const existingUser = await UserSchema.findOne({ $or: [{ email }, { mobilenumber }] });
            if (existingUser) {
                return res.status(400).json({ message: "Email or mobile number already exists" });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Save Image Path if uploaded
            const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

            // Create new user
            const newUser = new UserSchema({
                username,
                email,
                mobilenumber,
                password: hashedPassword,
                saved_address: saved_address ? [{ address: saved_address }] : [],
                image: imagePath
            });

            await newUser.save();

            res.status(201).json({
                message: "Account created successfully",
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    mobilenumber: newUser.mobilenumber,
                    saved_address: newUser.saved_address,
                    image: newUser.image
                },
            });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });
};


  

// Login Controller
exports.login = async (req, res) => {
    try {
      const { email, mobilenumber, password } = req.body;
  
      // Check if either email or mobile number is provided
      if (!email && !mobilenumber) {
        return res.status(400).json({ message: "Email or Mobile Number is required" });
      }
  
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }
  
      // Find user by email or mobile number
      const user = await UserSchema.findOne({
        $or: [{ email }, { mobilenumber }],
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      // Successful login
      res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          mobilenumber: user.mobilenumber,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

// Login with Mobile Number
exports.loginWithMobileNumber = async (req, res) => {
  try {
    const { mobilenumber } = req.body;

    if (!mobilenumber) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const user = await UserSchema.findOne({ mobilenumber });
    if (!user) {
      return res.status(400).json({ message: "Mobile number not found" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await UserSchema.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getAllUser = async (req, res) => {
    try {
      // Fetch all users from the database excluding the password
      const users = await UserSchema.find().select("-password");
  
      // If no users are found, return a 404 error
      if (users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }
  
      // If users are found, return them with a 200 status code
      res.status(200).json(users);
    } catch (error) {
      // If there's any error, return a 500 status code with the error message
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  


  exports.addAddress = async (req, res) => {
    try {
        const { saved_address } = req.body; // Address from request body
        const user = await UserSchema.findById(req.params.id); // Find user by ID

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Push new address to saved_address array
        user.saved_address.push({ address: saved_address });
        await user.save();

        res.status(200).json({ message: "Address added successfully", user });
    } catch (error) {
        console.error("Error in addAddress:", error);
        res.status(500).json({ message: "Error adding address", error: error.message });
    }
};




exports.updateProfile = async (req, res) => {
  upload(req, res, async (err) => {
      if (err) {
          return res.status(400).json({ message: "Image upload failed", error: err.message });
      }

      try {
          const { username, email, mobilenumber, saved_address } = req.body;
          const user = await UserSchema.findById(req.params.id);

          if (!user) {
              return res.status(404).json({ message: "User not found" });
          }

          // ✅ Corrected: Replace saved_address instead of pushing
          if (username) user.username = username;
          if (email) user.email = email;
          if (mobilenumber) user.mobilenumber = mobilenumber;

          if (saved_address) {
            try {
                user.saved_address = Array.isArray(saved_address) ? saved_address : JSON.parse(saved_address);
            } catch (error) {
                return res.status(400).json({ message: "Invalid saved_address format" });
            }
        }
        
          if (req.file) {
              user.image = `/uploads/${req.file.filename}`;
          }

          await user.save();

          res.status(200).json({
              message: "Profile updated successfully",
              user: {
                  id: user._id,
                  username: user.username,
                  email: user.email,
                  mobilenumber: user.mobilenumber,
                  saved_address: user.saved_address, // ✅ Now correctly updated
                  image: user.image
              }
          });
      } catch (error) {
          res.status(500).json({ message: "Server error", error: error.message });
      }
  });
};


  
  


exports.deleteUser = async (req, res) => {
    try {
      // Find and delete the user by their ID
      const user = await UserSchema.findByIdAndDelete(req.params.id);
  
      // If the user is not found, return a 404 error
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // If the user is found and deleted, return a success message
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      // If there's any error, return a 500 status code with the error message
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
