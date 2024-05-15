const { Op } = require('sequelize');
const multer = require('multer');

const db = require('~/models');
const categoryService = require('~/services/categoryService');
const courseService = require('~/services/courseService');
const stepService = require('~/services/stepService');
const trackService = require('~/services/trackService');
const generateSlug = require('~/utils/generateSlug');
const BaseController = require('./BaseController');
const registerService = require('~/services/registerService');
const upload = require('~/middlewares/upload');

class CourseController extends BaseController {
    constructor() {
        super('course');
        this.model = 'course';
        this.route = '/courses';
    }

    // WEB
    // [GET] /courses
    index = async (req, res) => {
        const [{ data: courses }, { data: categories }] = await Promise.all([
            courseService.find({
                include: [{ model: db.Category, as: 'category', attributes: ['id', 'title'] }],
                raw: true,
            }),
            categoryService.find({ raw: true }),
        ]).catch((err) => console.log('err', err));

        res.render('pages/' + this.model + '/show', {
            courses: courses,
            categories: categories,
            route: this.route,
            message: req.flash('info'),
            error: req.flash('error'),
        });
    };
    // [POST] /courses
    store = async (req, res) => {
        const data = await courseService.create({ ...req.body, slug: generateSlug(req.body.title) });
        trackService.create({ courseId: data.data.id });

        if (data.data[0]?.error) {
            req.flash('error', data.message);
        } else {
            req.flash('info', 'Create success!');
        }
        res.redirect('back');
    };
    // [GET] /courses/:id/edit
    edit = async (req, res) => {
        const id = req.params.id;
        const { data } = await courseService.find({ where: { id } });
        const { data: categories } = await categoryService.find({ raw: true });

        res.render('pages/' + this.model + '/edit', {
            [this.model]: data,
            categories: categories,
            route: this.route,
            error: req.flash('error'),
        });
    };
    // [PUT] /courses/:id
    updateWeb = async (req, res) => {
        const id = req.params.id;
        const data = await courseService.update({
            data: { ...req.body, slug: generateSlug(req.body.title) },
            where: { id },
        });
        if (data.data[0]?.error) {
            req.flash('error', data.message);
            return res.redirect('back');
        } else {
            req.flash('info', 'Update success!');
        }
        res.redirect(this.route);
    };
    // [DELETE] /courses/:id
    destroy = async (req, res) => {
        const id = req.params.id;
        const data = await courseService.delete({ where: { id } });

        if (data?.code === -1) {
            req.flash('error', data.message);
            return res.redirect('back');
        } else {
            req.flash('info', 'Delete success!');
        }
        res.redirect('back');
    };

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
        upload(req, res, async () => {
            req.body.image = 'http://localhost:5000/images/' + req.file.filename;
            req.body.id = '';
            const data = await courseService.create({
                ...req.body,
            });
            trackService.create({ courseId: data.data.id });

            if (data.code === -1) {
                return res.status(500).json(data);
            }

            res.json(data);
        });
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

        // check dk
        const register = await registerService.find({ findOne: true, where: { courseId: data.data.id, userId: 1 } });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        return res
            .status(200)
            .json({ data: { course: data.data, isRegistered: register.code === 0 && !!register.data } });
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
        const keywords = decodeURIComponent(query)
            .split(' ')
            .map((keyword) => `%${keyword}%`);

        if (type === 'less') {
            data = await courseService.find({
                where: {
                    title: {
                        [Op.or]: keywords.map((keyword) => ({
                            [Op.like]: keyword,
                        })),
                    },
                },
                limit: 5,
            });
        } else if (type === 'more') {
            data = await courseService.find({
                page: page ?? 1,
                search: {
                    title: {
                        [Op.or]: keywords.map((keyword) => ({
                            [Op.like]: keyword,
                        })),
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
