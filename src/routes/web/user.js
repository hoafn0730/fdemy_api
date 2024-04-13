const express = require('express');
const router = express.Router();
const userController = require('../../controllers/UserController');

// [GET] /users
router.get('/', userController.index);

// [POST] /users
router.post('/', userController.store);

// [GET] /users/:id/edit
router.get('/:id/edit', userController.edit);

// [PATCH] /users/:id
router.patch('/:id', userController.update);

// [DELETE] /users/:id
router.delete('/:id', userController.destroy);

module.exports = router;
