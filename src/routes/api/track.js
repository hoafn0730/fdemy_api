const router = require('express').Router();

const trackController = require('~/controllers/TrackController');
const { authenticateUser } = require('~/middlewares/authMiddleware');

router.all('*', authenticateUser);

router.get('/', trackController.getTrack);

module.exports = router;
