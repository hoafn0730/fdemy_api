const router = require('express').Router();

const stepController = require('~/controllers/StepController');
const { authenticateUser, authenticate } = require('~/middlewares/authMiddleware');

router.all('*', authenticate);

router.get('/:uuid', stepController.getStepByUuid);

module.exports = router;
