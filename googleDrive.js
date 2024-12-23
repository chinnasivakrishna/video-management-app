const { google } = require('googleapis');
const multer = require('multer');
const path = require('path');

// Configure multer for video file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Google Drive upload logic
const uploadToGoogleDrive = async (filePath) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'path/to/your-service-account.json',
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({ version: 'v3', auth });
  const fileMetadata = {
    name: path.basename(filePath),
  };
  const media = {
    mimeType: 'video/mp4',
    body: fs.createReadStream(filePath),
  };

  const file = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });

  return file.data.id;
};

module.exports = { upload, uploadToGoogleDrive };
