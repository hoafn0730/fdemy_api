const router = require('express').Router();
const blogController = require('~/controllers/BlogController');
const { authMiddleware } = require('~/middlewares/authMiddleware');

router.get('/', blogController.get);
router.get('/:slug', blogController.getBySlug);
router.post('/', authMiddleware, blogController.create);

module.exports = router;
