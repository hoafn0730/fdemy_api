const router = require('express').Router();
const categoryController = require('~/controllers/CategoryController');
const { upload } = require('~/middlewares/uploadMiddleware');
const { authenticateUser } = require('~/middlewares/authMiddleware');

router.get('/', categoryController.get);
router.post('/', authenticateUser, upload('image'), categoryController.create);
router.put('/:id', authenticateUser, upload('image'), categoryController.update);
router.delete('/:id', authenticateUser, categoryController.delete);

module.exports = router;
