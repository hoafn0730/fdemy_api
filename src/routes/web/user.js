const express = require('express');
const router = express.Router();
const userController = require('~/controllers/UserController');

router.get('/', userController.index);
router.post('/', userController.store);
router.get('/:id/edit', userController.edit);
router.put('/:id', userController.updateWeb);
router.delete('/:id', userController.destroy);

module.exports = router;
