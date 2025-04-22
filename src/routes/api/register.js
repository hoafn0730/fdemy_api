const router = require('express').Router();

const registerController = require('~/controllers/RegisterController');

const { authMiddleware } = require('~/middlewares/authMiddleware');

router.all('*', authMiddleware);

router.get('/', registerController.get);
router.post('/', registerController.create);
router.put('/:id', registerController.update);
router.delete('/:id', registerController.delete);

module.exports = router;
