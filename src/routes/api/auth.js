const router = require('express').Router();
const multer = require('multer');
const authController = require('~/controllers/AuthController');
const { storage } = require('~/helpers/upload');
const { authenticateUser, authenticate } = require('~/middlewares/authMiddleware');

let upload = multer({
    storage: storage,
});

router.get('/current-user', authenticate, authController.getCurrentUser);
router.patch('/update-profile', authenticateUser, upload.single('avatar'), authController.updateProfile);

module.exports = router;
