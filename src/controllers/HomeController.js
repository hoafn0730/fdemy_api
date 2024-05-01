const courseService = require('~/services/courseService');
const bannerService = require('../services/bannerService');
const { Op } = require('sequelize');

class HomeController {
    // [GET] /banners
    getBanners = async (req, res) => {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const data = await bannerService.find({
            page: page,
            pageSize,
            order: [['priority', 'ASC']],
        });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        return res.status(200).json(data);
    };

    // [GET] /combined-courses
    getCourses = async (req, res) => {
        const freeCourses = await courseService.find({ limit: 8, where: { price: 0 }, order: [['priority', 'ASC']] });
        const proCourses = await courseService.find({
            limit: 8,
            where: { price: { [Op.gt]: 0 } },
            order: [['priority', 'ASC']],
        });

        if (freeCourses.code === -1 || proCourses.code === -1) {
            return res.status(500).json({ code: -1, message: 'Something wrong!' });
        }

        return res.status(200).json({ data: { freeCourses: freeCourses.data, proCourses: proCourses.data } });
    };
}

module.exports = new HomeController();
