const router = require('express').Router();
const categoryController = require('~/controllers/CategoryController');
const { upload } = require('~/middlewares/uploadMiddleware');
const { authMiddleware } = require('~/middlewares/authMiddleware');

router.get('/', categoryController.get);
router.post('/', authMiddleware, upload('image'), categoryController.create);
router.put('/:id', authMiddleware, upload('image'), categoryController.update);
router.delete('/:id', authMiddleware, categoryController.delete);

module.exports = router;
