const router = require('express').Router();
const couponController = require('~/controllers/CouponController');
const { authenticateUser } = require('~/middlewares/authMiddleware');

router.get('/', couponController.get);
router.get('/:code', couponController.getByCode);
router.post('/', authenticateUser, couponController.create);
router.put('/:id', authenticateUser, couponController.update);
router.delete('/:id', authenticateUser, couponController.delete);

module.exports = router;
