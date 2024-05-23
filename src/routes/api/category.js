const express = require('express');
const router = express.Router();
const categoryController = require('~/controllers/CategoryController');
const upload = require('~/middlewares/uploadMiddleware');
const { authenticateUser } = require('~/middlewares/authMiddleware');

router.all('*', authenticateUser);

router.get('/', categoryController.get);
router.post('/', upload, categoryController.create);
router.put('/:id', upload, categoryController.update);
router.delete('/:id', categoryController.delete);

module.exports = router;
