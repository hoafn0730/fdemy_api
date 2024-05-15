const express = require('express');
const router = express.Router();
const stepController = require('~/controllers/StepController');

router.get('/:uuid', stepController.getStepByUuid);

module.exports = router;
