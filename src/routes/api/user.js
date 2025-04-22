const router = require('express').Router();

const userController = require('~/controllers/UserController');
const { authMiddleware } = require('~/middlewares/authMiddleware');

router.all('*', authMiddleware);

// [GET] /users
router.get('/', userController.get);

// [POST] /users
router.post('/', userController.create);

// [PUT] /users/:id
router.put('/:id', userController.update);

// [DELETE] /users/:id
router.delete('/:id', userController.delete);

module.exports = router;
