const express = require('express');
const userRouter = require('./user');
const bannerRouter = require('./banner');
const courseRouter = require('./course');
const lessonRouter = require('./lesson');
const categoryRouter = require('./category');
const registerRouter = require('./register');
const invoiceRouter = require('./invoice');
const trackRouter = require('./track');
const stepRouter = require('./step');
const homeController = require('~/controllers/HomeController');
const courseController = require('~/controllers/CourseController');
const stepController = require('~/controllers/StepController');

const router = express.Router();

router.use('/users', userRouter);
router.use('/banners', bannerRouter);
router.use('/courses', courseRouter);
router.use('/lessons', lessonRouter);
router.use('/categories', categoryRouter);
router.use('/registers', registerRouter);
router.use('/invoices', invoiceRouter);
router.use('/tracks', trackRouter);
router.use('/steps', stepRouter);
router.get('/user-process', stepController.saveUserProcess);
router.post('/user-process', stepController.saveUserProcess);
router.get('/combined-courses', homeController.getCourses);
router.get('/search', courseController.search);

module.exports = router;
