const express = require('express');
const router = express.Router();
const trackController = require('~/controllers/TrackController');

router.get('/', trackController.getTrack);

module.exports = router;
