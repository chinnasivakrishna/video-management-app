const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Video = require('../models/Video');
const auth = require('../middleware/auth');
const fs = require('fs');

// Configure multer for video upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'));
    }
  }
});

// Upload video route with auth middleware
router.post('/upload', auth, upload.single('video'), async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    
    if (!req.file && !req.body.driveUrl) {
      return res.status(400).json({ message: 'Please provide a video file or Drive URL' });
    }

    const videoData = {
      title,
      description,
      tags: JSON.parse(tags || '[]'),
      userId: req.user.id // From auth middleware
    };

    if (req.file) {
      videoData.fileUrl = `/uploads/${req.file.filename}`;
      videoData.fileSize = req.file.size;
    }

    if (req.body.driveUrl) {
      videoData.driveUrl = req.body.driveUrl;
    }

    const video = new Video(videoData);
    await video.save();

    res.status(201).json({
      message: 'Video uploaded successfully',
      video: {
        id: video._id,
        title: video.title,
        description: video.description,
        tags: video.tags,
        fileUrl: video.fileUrl,
        driveUrl: video.driveUrl
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading video', error: error.message });
  }
});

// Get user's videos
router.get('/', auth, async (req, res) => {
  try {
    const videos = await Video.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos', error: error.message });
  }
});

// Get single video
router.get('/:id', auth, async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching video', error: error.message });
  }
});

module.exports = router;