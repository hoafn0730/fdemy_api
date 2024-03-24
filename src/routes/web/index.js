const express = require('express');
const authRouter = require('./auth');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('home');
});

router.use(authRouter);

module.exports = router;
