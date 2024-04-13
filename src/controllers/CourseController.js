const courseService = require('../services/courseService');
const categoryService = require('../services/categoryService');
const db = require('../models');
const generateSlug = require('../utils/generateSlug');

class CourseController {
    constructor() {
        this.page = 'course';
        this.route = '/courses';
    }

    // WEB
    index = async (req, res) => {
        const courses = await courseService.find({ include: [{ model: db.Category, as: 'category' }] });
        const categories = await categoryService.find({});
        res.render('pages/' + this.page + '/show', {
            courses: courses.data,
            categories: categories.data,
            route: this.route,
            message: req.flash('info'),
            error: req.flash('error'),
        });
    };

    store = async (req, res) => {
        const data = await courseService.create({ ...req.body, slug: generateSlug(req.body.title) });
        if (data.data[0]?.error) {
            req.flash('error', data.message);
        } else {
            req.flash('info', 'Create success!');
        }
        res.redirect('back');
    };

    edit = async (req, res) => {
        const id = req.params.id;
        const { data } = await courseService.find({ where: { id } });
        const categories = await categoryService.find({});
        res.render('pages/' + this.page + '/edit', {
            course: data,
            categories: categories.data,
            route: this.route,
            error: req.flash('error'),
        });
    };

    update = async (req, res) => {
        const id = req.params.id;
        const data = await courseService.update({ data: req.body, where: { id } });
        if (data.data[0]?.error) {
            req.flash('error', data.message);
            return res.redirect('back');
        } else {
            req.flash('info', 'Update success!');
        }
        res.redirect(this.route);
    };

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
}

module.exports = new CourseController();
