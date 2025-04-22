const router = require('express').Router();
const couponController = require('~/controllers/CouponController');
const { authMiddleware } = require('~/middlewares/authMiddleware');

router.get('/', couponController.get);
router.get('/:code', couponController.getByCode);
router.post('/', authMiddleware, couponController.create);
router.put('/:id', authMiddleware, couponController.update);
router.delete('/:id', authMiddleware, couponController.delete);

module.exports = router;
