const express = require('express');
const router = express.Router();
const {
  applyForGig,
  getGigApplications,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication
} = require('../controllers/applicationController');
const { protect, restrictTo } = require('../middleware/auth');

router.post('/apply', protect, restrictTo('student'), applyForGig);
router.get('/my-applications', protect, restrictTo('student'), getMyApplications);
router.get('/gig/:gigId', protect, restrictTo('client'), getGigApplications);
router.put('/status', protect, restrictTo('client'), updateApplicationStatus);
router.delete('/:id', protect, restrictTo('student'), withdrawApplication);

module.exports = router;
