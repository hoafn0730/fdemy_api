const db = require('~/models');
const userService = require('~/services/userService');
const courseService = require('~/services/courseService');
const registerService = require('~/services/registerService');
const BaseController = require('./BaseController');

class RegisterController extends BaseController {
    constructor() {
        super('register');
        this.model = 'register';
        this.route = '/registers';
    }

    // WEB
    // [GET] /registers
    index = async (req, res) => {
        const [registers, courses, users] = await Promise.all([
            registerService.find({
                raw: true,
                include: [
                    { model: db.Course, as: 'course', attributes: ['id', 'title'] },
                    { model: db.User, as: 'user', attributes: ['id', 'username'] },
                ],
            }),
            courseService.find({ raw: true }),
            userService.find({ raw: true }),
        ]);

        res.render('pages/' + this.model + '/show', {
            registers: registers.data,
            users: users.data,
            courses: courses.data,
            route: this.route,
            message: req.flash('info'),
            error: req.flash('error'),
        });
    };

    // [POST] /registers
    store = async (req, res) => {
        const data = await registerService.create({ ...req.body });

        if (data.data[0]?.error) {
            req.flash('error', data.message);
        } else {
            req.flash('info', 'Create success!');
        }
        res.redirect('back');
    };

    // [GET] /registers/:id/edit
    edit = async (req, res) => {
        const id = req.params.id;
        const { data } = await registerService.find({ where: { id } });
        const courses = await courseService.find({});
        const users = await userService.find({});
        res.render('pages/' + this.model + '/edit', {
            [this.model]: data,
            users: users.data,
            courses: courses.data,
            route: this.route,
            error: req.flash('error'),
        });
    };

    // [PUT] /registers/:id
    updateWeb = async (req, res) => {
        const id = req.params.id;
        const data = await registerService.update({ data: req.body, where: { id } });
        if (data.data[0]?.error) {
            req.flash('error', data.message);
            return res.redirect('back');
        } else {
            req.flash('info', 'Update success!');
        }
        res.redirect(this.route);
    };

    // [DELETE] /registers/:id
    destroy = async (req, res) => {
        const id = req.params.id;
        const data = await registerService.delete({ where: { id } });
        if (data.data[0]?.error) {
            req.flash('error', data.message);
        } else {
            req.flash('info', 'Delete success!');
        }
        res.redirect('back');
    };

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
}

module.exports = new RegisterController();
