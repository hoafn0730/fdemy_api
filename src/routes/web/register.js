const express = require('express');
const router = express.Router();
const registerController = require('../../controllers/RegisterController');

// [GET] /registers
router.get('/', registerController.index);

// [POST] /registers
router.post('/', registerController.store);

// [GET] /registers/:id/edit
router.get('/:id/edit', registerController.edit);

// [PATCH] /registers/:id
router.patch('/:id', registerController.update);

// [DELETE] /registers/:id
router.delete('/:id', registerController.destroy);

module.exports = router;
