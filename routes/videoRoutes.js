const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { uploadVideo, getVideosByUser, getVideoById } = require('../controllers/videoController');

const router = express.Router();

// Upload a video
router.post('/', protect, uploadVideo);

// Get all videos uploaded by the logged-in user
router.get('/', protect, getVideosByUser);

// Get a single video by ID
router.get('/:id', getVideoById);

module.exports = router;
