const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  downloadResume,
  searchStudents
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/search', searchStudents);
router.get('/profile', protect, getProfile);
router.get('/profile/resume', protect, downloadResume);
router.get('/profile/:id', getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
