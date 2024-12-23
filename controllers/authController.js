const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Create new user
        const user = await User.create({ name, email, password });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { Email, Password } = req.body;

    try {
        const user = await User.findOne({ email: Email });

        if (user && (await user.matchPassword(Password))) {
            const token = generateToken(user.id);

            // Send token in the response body
            res.status(200).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { registerUser, loginUser, logoutUser };
