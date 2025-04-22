const router = require('express').Router();

const authRouter = require('./auth');
const bannerRouter = require('./banner');
const blogRouter = require('./blog');
const categoryRouter = require('./category');
const courseRouter = require('./course');
const invoiceRouter = require('./invoice');
const lessonRouter = require('./lesson');
const registerRouter = require('./register');
const couponRouter = require('./coupon');
const stepRouter = require('./step');
const trackRouter = require('./track');
const userRouter = require('./user');
const commentRouter = require('./comment');
const chatRouter = require('./chat');
const courseController = require('~/controllers/CourseController');
const homeController = require('~/controllers/HomeController');
const stepController = require('~/controllers/StepController');
const registerController = require('~/controllers/RegisterController');
const { authMiddleware } = require('~/middlewares/authMiddleware');
const db = require('~/models');

// Endpoint nhận Webhook
router.post('/webhook/seapay', async (req, res) => {
    try {
        // Xử lý dữ liệu
        const data = req.body;
        console.log('Webhook received:', data);

        const description = data?.content || '';

        const userId = description.match(/UID(\d+)/)?.[1] || null;
        const courseId = description.match(/CID(\d+)/)?.[1] || null;

        await db.Register.create({
            courseId: +courseId,
            userId: +userId,
        });

        await db.Invoice.create({
            userId: +userId,
            courseId: +courseId,
            total: data?.transferAmount,
            status: 'success',
        });

        if (data) {
            res.io.emit('transaction-update', { success: true, data });
        }

        // Phản hồi lại Seapay
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.log('🚀 ~ router.post ~ error:', error);
        res.status(500).json({ success: false });
    }
});

router.use('/auth', authRouter);
router.use('/banners', bannerRouter);
router.use('/blogs', blogRouter);
router.use('/categories', categoryRouter);
router.use('/courses', courseRouter);
router.use('/invoices', invoiceRouter);
router.use('/lessons', lessonRouter);
router.use('/registers', registerRouter);
router.use('/coupons', couponRouter);
router.use('/steps', stepRouter);
router.use('/tracks', trackRouter);
router.use('/users', userRouter);
router.use('/comments', commentRouter);
router.use('/chat', authMiddleware, chatRouter);

router.get('/combined-courses', homeController.getCourses);
router.get('/search', courseController.search);
// router.get('/user-process', authMiddleware, stepController.saveUserProcess);
router.post('/user-process', authMiddleware, stepController.saveUserProcess);
router.get('/analysis', registerController.analysis);

module.exports = router;
