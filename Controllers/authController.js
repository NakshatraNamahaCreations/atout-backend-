const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc Register new user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { username, email, mobilenumber, password } = req.body;

    // Validate input
    if (!username || !email || !mobilenumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    let user = await User.create({ username, email, mobilenumber, password });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      mobilenumber: user.mobilenumber,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc Login user
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      mobilenumber: user.mobilenumber,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc Update user details
// @route PUT /api/auth/update/:id
const updateUser = async (req, res) => {
  try {
    const { username, email, mobilenumber, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.email = email || user.email;
    user.mobilenumber = mobilenumber || user.mobilenumber;
    if (password) user.password = password;

    await user.save();
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = { registerUser, loginUser, updateUser };
