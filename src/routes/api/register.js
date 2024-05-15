const express = require('express');
const router = express.Router();
const registerController = require('~/controllers/RegisterController');

router.get('/', registerController.get);
router.post('/', registerController.create);
router.put('/:id', registerController.update);
router.delete('/:id', registerController.delete);

module.exports = router;
