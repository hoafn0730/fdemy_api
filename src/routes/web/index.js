const express = require('express');
const authRouter = require('./auth');
const userRouter = require('./user');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('dashboard');
});

router.use(authRouter);
router.use('/user', userRouter);

module.exports = router;
