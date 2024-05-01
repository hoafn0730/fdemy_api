const { Op, fn, col, where } = require('sequelize');
const db = require('~/models');
const categoryService = require('~/services/categoryService');
const courseService = require('~/services/courseService');
const generateSlug = require('~/utils/generateSlug');

class CourseController {
    constructor() {
        this.model = 'course';
        this.route = '/courses';
    }

    // WEB
    // [GET] /courses
    index = async (req, res) => {
        const courses = await courseService.find({
            include: [{ model: db.Category, as: 'category', attributes: ['id', 'title'] }],
            raw: true,
        });

        const categories = await categoryService.find({});
        res.render('pages/' + this.model + '/show', {
            courses: courses.data,
            categories: categories.data,
            route: this.route,
            message: req.flash('info'),
            error: req.flash('error'),
        });
    };
    // [POST] /courses
    store = async (req, res) => {
        const data = await courseService.create({ ...req.body, slug: generateSlug(req.body.title) });
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
        const categories = await categoryService.find({});
        res.render('pages/' + this.model + '/edit', {
            [this.model]: data,
            categories: categories.data,
            route: this.route,
            error: req.flash('error'),
        });
    };

    // [PUT] /courses/:id
    update = async (req, res) => {
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
        if (data.data[0]?.error) {
            req.flash('error', data.message);
            return res.redirect('back');
        } else {
            req.flash('info', 'Delete success!');
        }
        res.redirect('back');
    };

    // [GET] /courses/:slug
    getCourseBySlug = async (req, res) => {
        const slug = req.params.slug;
        const data = await courseService.find({
            findOne: true,
            where: {
                slug: slug,
            },
        });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        return res.status(200).json(data);
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
                    // title: {
                    //     [Op.like]: `%${query}%`,
                    // },
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
