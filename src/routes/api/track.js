const router = require('express').Router();

const trackController = require('~/controllers/TrackController');
const { authMiddleware } = require('~/middlewares/authMiddleware');

router.all('*', authMiddleware);

router.get('/', trackController.getTrack);

module.exports = router;
