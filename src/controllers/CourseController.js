const { Op } = require('sequelize');
const multer = require('multer');

const db = require('~/models');
const categoryService = require('~/services/categoryService');
const courseService = require('~/services/courseService');
const stepService = require('~/services/stepService');
const trackService = require('~/services/trackService');
const BaseController = require('./BaseController');
const registerService = require('~/services/registerService');
const upload = require('~/middlewares/uploadMiddleware');
const userService = require('~/services/userService');

class CourseController extends BaseController {
    constructor() {
        super('course');
    }

    // API
    // [GET] /courses
    get = async (req, res) => {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const data = await courseService.find({
            page: page,
            pageSize,
            include: { model: db.Category, as: 'category', attributes: ['id', 'title'] },
            raw: false,
        });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        return res.status(200).json(data);
    };

    // [POST] /courses
    create = async (req, res) => {
        const data = await courseService.create({
            ...req.body,
        });
        await trackService.create({ courseId: data.data.id });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        res.json(data);
    };

    // [DELETE] /courses/:id
    delete = async (req, res) => {
        const id = req.params.id;
        const data = await courseService.delete({
            where: {
                id,
            },
        });

        const { code } = await trackService.delete({
            where: {
                courseId: id,
            },
        });

        if (data.code === -1 && code === -1) {
            return res.status(500).json(data);
        }

        res.json(data);
    };

    // [GET] /courses/:slug
    getCourseBySlug = async (req, res) => {
        const slug = req.params.slug;
        const data = await courseService.find({
            findOne: true,
            where: {
                slug: slug,
            },
            raw: true,
        });
        const { data: track } = await trackService.find({ findOne: true, where: { courseId: data.data.id } });
        const steps = await stepService.find({ where: { trackId: track.id } });
        track.steps = steps.data;
        data.data.track = track;

        const user = await userService.find({
            findOne: true,
            where: {
                uid: req?.user?.id + '',
            },
            raw: true,
        });

        let register;
        if (user) {
            // check dk
            register = await registerService.find({
                findOne: true,
                where: { courseId: data.data.id, userId: user.data?.id },
            });
        }

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        return res
            .status(200)
            .json({ data: { course: data.data, isRegistered: register?.code === 0 && !!register.data } });
    };

    // [GET] /courses/registered
    getRegisteredCourses = async (req, res) => {
        const data = await courseService.find({
            include: [{ model: db.Register, as: 'register', attributes: [], where: { userId: 1 } }],
            attributes: [
                'id',
                'title',
                'slug',
                'image',
                'icon',
                'oldPrice',
                'price',
                'studentsCount',
                'publishedAt',
                'priority',
                'createdAt',
                [db.Sequelize.col('register.process'), 'userProcess'],
            ],
        });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        return res.status(200).json(data);
    };

    // [GET] /search
    search = async (req, res) => {
        const query = req.query.q;
        const type = req.query.type;
        const page = req.query.page;
        let data;

        if (type === 'less') {
            data = await courseService.find({
                where: {
                    title: {
                        [Op.iLike]: `%${query}%`,
                    },
                },
                limit: 5,
            });
        } else if (type === 'more') {
            data = await courseService.find({
                page: page ?? 1,
                search: {
                    title: {
                        [Op.iLike]: `%${query}%`,
                    },
                },
            });
        }

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        return res.status(200).json(data);
    };
}

module.exports = new CourseController();
