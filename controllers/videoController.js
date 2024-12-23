const Video = require('../models/Video');

// @desc Upload a video
// @route POST /api/videos
// @access Private
const uploadVideo = async (req, res) => {
  try {
    const { title, description, tags, videoLink } = req.body;

    if (!title || !description || !tags || !videoLink) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const video = await Video.create({
      user: req.user._id,
      title,
      description,
      tags,
      videoLink,
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading video.', error });
  }
};

// @desc Get all videos uploaded by the logged-in user
// @route GET /api/videos
// @access Private
const getVideosByUser = async (req, res) => {
  try {
    const videos = await Video.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos.', error });
  }
};

// @desc Get a single video by ID
// @route GET /api/videos/:id
// @access Private
const getVideoById = async (req, res) => {
    try {
      const video = await Video.findById(req.params.id);
  
      if (!video ) {
        return res.status(404).json({ message: 'Video not found or unauthorized.' });
      }
  
      res.status(200).json({
        id: video._id,
        title: video.title,
        description: video.description,
        tags: video.tags,
        videoLink: video.videoLink,
        createdAt: video.createdAt,
      });
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ message: 'Error fetching video.', error: error.message });
    }
  };
  

module.exports = { uploadVideo, getVideosByUser, getVideoById };
