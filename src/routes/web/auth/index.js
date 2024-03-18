const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('home');
});

router.post('/', (req, res) => {
    console.log(req.body);
    res.render('home', { data: req.body });
});

module.exports = router;
