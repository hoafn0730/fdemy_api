const router = require('express').Router();
const multer = require('multer');
const authController = require('~/controllers/AuthController');
const { storage } = require('~/helpers/upload');
const { authenticateUser } = require('~/middlewares/authMiddleware');

let upload = multer({
    storage: storage,
});

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);
router.get('/refresh-token', authController.refreshToken);
router.get('/current-user', authenticateUser, authController.getCurrentUser);
router.patch('/update-profile', authenticateUser, upload.single('avatar'), authController.updateProfile);

module.exports = router;
