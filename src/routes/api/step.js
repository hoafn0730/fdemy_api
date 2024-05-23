const express = require('express');
const router = express.Router();
const stepController = require('~/controllers/StepController');
const { authenticateUser } = require('~/middlewares/authMiddleware');

router.all('*', authenticateUser);

router.get('/:uuid', stepController.getStepByUuid);

module.exports = router;
