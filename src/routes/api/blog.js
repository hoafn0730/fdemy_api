const express = require('express');
const router = express.Router();
const blogController = require('~/controllers/BlogController');
const { authenticateUser } = require('~/middlewares/authMiddleware');

router.get('/:slug', blogController.getBySlug);
router.get('/', blogController.get);
router.post('/', authenticateUser, blogController.create);

module.exports = router;
