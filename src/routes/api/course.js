const express = require('express');
const router = express.Router();
const courseController = require('~/controllers/CourseController');
const upload = require('~/middlewares/upload');

// [GET] /courses
router.get('/', courseController.get);

// [POST] /courses
router.post('/', upload, courseController.create);

// [PUT] /courses/:id
router.put('/:id', upload, courseController.update);

// [DELETE] /courses/:id
router.delete('/:id', courseController.delete);

// [GET] /courses/registered
router.get('/registered', courseController.getRegisteredCourses);

// [GET] /courses/:slug
router.get('/:slug', courseController.getCourseBySlug);

module.exports = router;
