const express = require('express');
const userController = require('../../../controllers/UserController');

const router = express.Router();

// [GET] /user
router.get('/', userController.index);

// [POST] /user
router.post('/', userController.store);

// [GET] /user/:id/edit
router.get('/:id/edit', userController.edit);

// [PATCH] /user/:id
router.patch('/:id', userController.update);

// [DELETE] /user/:id
router.delete('/:id', userController.destroy);

module.exports = router;
