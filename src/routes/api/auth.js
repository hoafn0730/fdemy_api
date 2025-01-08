const router = require('express').Router();
const multer = require('multer');
const authController = require('~/controllers/AuthController');
const { storage } = require('~/helpers/upload');
const { authMiddleware } = require('~/middlewares/authMiddleware');

const upload = multer({
    storage: storage,
});

router.get('/current-user', authMiddleware, authController.getCurrentUser);
router.patch('/update-profile', authMiddleware, upload.single('avatar'), authController.updateProfile);

module.exports = router;
