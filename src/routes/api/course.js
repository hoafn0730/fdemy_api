const express = require('express');
const router = express.Router();
const courseController = require('~/controllers/CourseController');

router.get('/registered', courseController.getRegisteredCourses);
router.get('/:slug', courseController.getCourseBySlug);

module.exports = router;
