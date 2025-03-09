const router = require('express').Router();
const blogController = require('~/controllers/BlogController');
const { authMiddleware } = require('~/middlewares/authMiddleware');
const blogValidation = require('~/validations/blogValidation');

router.get('/', blogController.get);
router.get('/:slug', blogController.getBySlug);
router.post('/', authMiddleware, blogValidation.create, blogController.create);

module.exports = router;
