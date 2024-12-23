const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Register a user
const registerUser = async (req, res) => {
  const { username, password } = req.body;
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const user = new User({ username, password: hashedPassword });
  
  try {
    await user.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).send("Error creating user");
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  
  const user = await User.findOne({ username });
  if (!user) return res.status(404).send("User not found");
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send("Invalid credentials");
  
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

// Middleware to protect routes
const authenticate = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied");
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

module.exports = { registerUser, loginUser, authenticate };
