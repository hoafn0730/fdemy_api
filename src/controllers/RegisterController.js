const moment = require('moment');
const { Op } = require('sequelize');
const db = require('~/models');
const userService = require('~/services/userService');
const courseService = require('~/services/courseService');
const registerService = require('~/services/registerService');
const BaseController = require('./BaseController');
const invoiceService = require('~/services/invoiceService');
const { Course } = require('~/models');

class RegisterController extends BaseController {
    constructor() {
        super('register');
    }

    // [GET] /models
    get = async (req, res) => {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const data = await registerService.find({
            page: page,
            pageSize,
            include: [
                { model: db.Course, as: 'course', attributes: ['id', 'title'] },
                { model: db.User, as: 'user', attributes: ['id', 'username'] },
            ],
            raw: false,
        });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        return res.status(200).json(data);
    };

    analysis = async (req, res, next) => {
        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();
        const [users, registers, { data }] = await Promise.all([
            userService.find({}),
            registerService.find({
                include: [{ model: Course, as: 'course' }],
            }),
            invoiceService.find({
                where: {
                    createdAt: {
                        [Op.between]: [startOfMonth, endOfMonth],
                    },
                },
            }),
        ]);
        const numberUser = users.data.length;
        const numberCourseRegistered = registers.data.length;
        const revenue = data.reduce((prev, cur) => prev + cur.total, 0);
        const featuredCourses = registers.data.map((item) => item.course);

        res.json({
            data: {
                numberUser,
                numberCourseRegistered,
                revenue,
                featuredCourses,
            },
        });
    };
}

module.exports = new RegisterController();
