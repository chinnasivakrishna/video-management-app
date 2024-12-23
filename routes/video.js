const express = require('express');
const Video = require('../models/Video');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.post('/upload', authenticate, async (req, res) => {
  try {
    const { title, description, tags, fileSize, driveFileId } = req.body;
    const video = new Video({
      userId: req.user.id,
      title,
      description,
      tags,
      fileSize,
      driveFileId,
    });
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const { title, tags, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user.id };

    if (title) query.title = new RegExp(title, 'i');
    if (tags) query.tags = { $in: tags.split(',') };

    const videos = await Video.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;