const router = require('express').Router();

const lessonController = require('~/controllers/LessonController');
const { uploads } = require('~/middlewares/uploadMiddleware');
const { authenticateUser } = require('~/middlewares/authMiddleware');

router.all('*', authenticateUser);

// [GET] /lessons
router.get('/', lessonController.get);

// [POST] /lessons
router.post('/', uploads.fields([{ name: 'image' }, { name: 'video' }]), lessonController.create);

// [PUT] /lessons/:id
router.put('/:id', uploads.fields([{ name: 'image' }, { name: 'video' }]), lessonController.update);

// [DELETE] /lessons/:id
router.delete('/:id', lessonController.delete);

// User

module.exports = router;
