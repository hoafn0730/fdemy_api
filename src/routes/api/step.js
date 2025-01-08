const router = require('express').Router();
const stepController = require('~/controllers/StepController');
const { authMiddleware } = require('~/middlewares/authMiddleware');

router.get('/:uuid', authMiddleware, stepController.getStepByUuid);

module.exports = router;
