const router = require('express').Router();

const courseController = require('~/controllers/CourseController');
const { upload } = require('~/middlewares/uploadMiddleware');
const { authMiddleware } = require('~/middlewares/authMiddleware');

// [GET] /courses
router.get('/', courseController.get);

// [POST] /courses
router.post('/', authMiddleware, upload('image'), courseController.create);

// [PUT] /courses/:id
router.put('/:id', authMiddleware, upload('image'), courseController.update);

// [DELETE] /courses/:id
router.delete('/:id', authMiddleware, courseController.delete);

// [GET] /courses/registered
router.get('/registered', authMiddleware, courseController.getRegisteredCourses);

// [GET] /courses/:slug
router.get('/:slug', courseController.getCourseBySlug);

module.exports = router;
