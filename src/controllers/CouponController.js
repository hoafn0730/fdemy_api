const BaseController = require('./BaseController');
const couponService = require('~/services/couponService');

class CouponController extends BaseController {
    constructor() {
        super('coupon');
    }

    getByCode = async (req, res) => {
        const code = req.params.code;

        const data = await couponService.find({
            findOne: true,
            where: {
                code: code,
            },
        });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        return res.status(200).json(data);
    };
}

module.exports = new CouponController();
