const express = require('express');
const userRouter = require('./user');
const bannerRouter = require('./banner');
const courseRouter = require('./course');
const categoryRouter = require('./category');
const homeController = require('~/controllers/HomeController');
const courseController = require('~/controllers/CourseController');

const router = express.Router();

router.use('/users', userRouter);
router.use('/banners', bannerRouter);
router.use('/courses', courseRouter);
router.use('/categories', categoryRouter);
router.get('/combined-courses', homeController.getCourses);
router.get('/search', courseController.search);

module.exports = router;
