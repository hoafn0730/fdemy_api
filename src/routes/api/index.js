const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        status: 200,
        message: 'ok',
        data: { id: 1, name: 'hoafn0730' },
    });
});

module.exports = router;
