const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/CategoryController');

// [GET] /categories
router.get('/', categoryController.index);

// [POST] /categories
router.post('/', categoryController.store);

// [GET] /categories/:id/edit
router.get('/:id/edit', categoryController.edit);

// [PATCH] /categories/:id
router.patch('/:id', categoryController.update);

// [DELETE] /categories/:id
router.delete('/:id', categoryController.destroy);

module.exports = router;
