const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { authenticateJWT } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

router.get('/', authenticateJWT, profileController.getProfileStats);
router.put('/', authenticateJWT, upload.single('avatar'), profileController.updateProfile);

module.exports = router;
