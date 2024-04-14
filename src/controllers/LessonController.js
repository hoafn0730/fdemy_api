const lessonService = require('../services/lessonService');
const courseService = require('../services/courseService');
const db = require('../models');

class LessonController {
    constructor() {
        this.model = 'lesson';
        this.route = '/lessons';
    }

    // WEB
    // [GET] /lessons
    index = async (req, res) => {
        let courseId = req.query.c;
        const page = req.query.page;
        const courses = await courseService.find({});
        if (!courseId) {
            courseId = courses.data[0].id;
            return res.redirect(`${this.route}?c=${courseId}&page=${1}`);
        }
        if (!page) {
            return res.redirect(`${this.route}?c=${courseId}&page=${1}`);
        }

        const data = await lessonService.find({
            page,
            search: { courseId },
            include: [
                {
                    model: db.Course,
                    as: 'course',
                    attributes: ['id', 'title'],
                },
            ],
        });

        res.render('pages/' + this.model + '/show', {
            lessons: data.data,
            course: courses.data.find((x) => x.id === +courseId),
            courses: courses.data,
            pageNumber: data.data.pageNumber,
            route: this.route,
            message: req.flash('info'),
            error: req.flash('error'),
        });
    };

    // [POST] /lessons
    store = async (req, res) => {
        const data = await lessonService.create({ ...req.body });
        if (data.data[0]?.error) {
            req.flash('error', data.message);
        } else {
            req.flash('info', 'Create success!');
        }
        res.redirect('back');
    };

    // [GET] /lessons/:id/edit
    edit = async (req, res) => {
        const id = req.params.id;
        const { data } = await lessonService.find({ where: { id } });
        const courses = await courseService.find({});
        res.render('pages/' + this.model + '/edit', {
            [this.model]: data,
            courses: courses.data,
            route: this.route,
            error: req.flash('error'),
        });
    };

    // [PATCH] /lessons/:id
    update = async (req, res) => {
        const id = req.params.id;
        console.log(req.body);
        const data = await lessonService.update({ data: req.body, where: { id } });
        if (data.data[0]?.error) {
            req.flash('error', data.message);
            return res.redirect('back');
        } else {
            req.flash('info', 'Update success!');
        }
        res.redirect(this.route);
    };

    // [DELETE] /lessons/:id
    destroy = async (req, res) => {
        const id = req.params.id;
        const data = await lessonService.delete({ where: { id } });
        if (data.data[0]?.error) {
            req.flash('error', data.message);
        } else {
            req.flash('info', 'Delete success!');
        }
        res.redirect('back');
    };
}

module.exports = new LessonController();
