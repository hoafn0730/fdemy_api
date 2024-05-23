const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const bannerRouter = require('./banner');
const blogRouter = require('./blog');
const categoryRouter = require('./category');
const courseRouter = require('./course');
const invoiceRouter = require('./invoice');
const lessonRouter = require('./lesson');
const registerRouter = require('./register');
const stepRouter = require('./step');
const trackRouter = require('./track');
const userRouter = require('./user');
const courseController = require('~/controllers/CourseController');
const homeController = require('~/controllers/HomeController');
const stepController = require('~/controllers/StepController');

router.use('/auth', authRouter);
router.use('/banners', bannerRouter);
router.use('/blogs', blogRouter);
router.use('/categories', categoryRouter);
router.use('/courses', courseRouter);
router.use('/invoices', invoiceRouter);
router.use('/lessons', lessonRouter);
router.use('/registers', registerRouter);
router.use('/steps', stepRouter);
router.use('/tracks', trackRouter);
router.use('/users', userRouter);
router.get('/combined-courses', homeController.getCourses);
router.get('/search', courseController.search);
router.get('/user-process', stepController.saveUserProcess);
router.post('/user-process', stepController.saveUserProcess);

module.exports = router;
