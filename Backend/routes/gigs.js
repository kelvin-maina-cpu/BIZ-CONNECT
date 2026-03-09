const express = require('express');
const router = express.Router();
const {
  createGig,
  getGigs,
  getGigById,
  updateGig,
  deleteGig,
  getMyGigs,
  hireStudent
} = require('../controllers/gigController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/', getGigs);
router.get('/my-gigs', protect, restrictTo('client'), getMyGigs);
router.post('/', protect, restrictTo('client'), createGig);
router.get('/:id', getGigById);
router.put('/:id', protect, restrictTo('client'), updateGig);
router.delete('/:id', protect, restrictTo('client'), deleteGig);
router.post('/hire', protect, restrictTo('client'), hireStudent);

module.exports = router;
