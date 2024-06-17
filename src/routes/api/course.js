const router = require('express').Router();

const courseController = require('~/controllers/CourseController');
const { upload } = require('~/middlewares/uploadMiddleware');
const { authenticateUser, checkUserLogin } = require('~/middlewares/authMiddleware');

// [GET] /courses
router.get('/', courseController.get);

// [POST] /courses
router.post('/', authenticateUser, upload('image'), courseController.create);

// [PUT] /courses/:id
router.put('/:id', authenticateUser, upload('image'), courseController.update);

// [DELETE] /courses/:id
router.delete('/:id', authenticateUser, courseController.delete);

// [GET] /courses/registered
router.get('/registered', authenticateUser, courseController.getRegisteredCourses);

// [GET] /courses/:slug
router.get('/:slug', checkUserLogin, courseController.getCourseBySlug);

module.exports = router;
