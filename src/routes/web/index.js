const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const userRouter = require('./user');
const categoryRouter = require('./category');
const courseRouter = require('./course');

router.get('/', (req, res) => {
    res.render('pages/dashboard');
});

router.use(authRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/courses', courseRouter);

module.exports = router;
