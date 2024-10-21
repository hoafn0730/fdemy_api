const router = require('express').Router();
const blogController = require('~/controllers/BlogController');
const { authenticateUser } = require('~/middlewares/authMiddleware');

router.get('/', blogController.get);
router.get('/:slug', blogController.getBySlug);
router.post('/', authenticateUser, blogController.create);

module.exports = router;
