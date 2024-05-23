const express = require('express');
const router = express.Router();
const lessonController = require('~/controllers/LessonController');
const upload = require('~/middlewares/uploadMiddleware');
const { authenticateUser } = require('~/middlewares/authMiddleware');

router.all('*', authenticateUser);

// [GET] /lessons
router.get('/', lessonController.get);

// [POST] /lessons
router.post('/', upload, lessonController.create);

// [PUT] /lessons/:id
router.put('/:id', upload, lessonController.update);

// [DELETE] /lessons/:id
router.delete('/:id', lessonController.delete);

// User

module.exports = router;
