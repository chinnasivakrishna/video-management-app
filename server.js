const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes'); // Import video routes
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: 'http://localhost:3000', // Allow only this origin
  credentials: true, // Allow credentials (cookies, authorization headers)
};
app.use(cors(corsOptions));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes); // Add video routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
