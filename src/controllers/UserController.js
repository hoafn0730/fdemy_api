const userService = require('../services/userService');
const BaseController = require('./BaseController');

class UserController extends BaseController {
    constructor() {
        super('user');
    }

    // WEB
    // [GET] /users
    index = async (req, res) => {
        const users = await userService.find({ raw: true });
        res.render('pages/' + this.model + '/show', {
            users: users.data,
            route: this.route,
            message: req.flash('info'),
            error: req.flash('error'),
        });
    };

    // [POST] /users
    store = async (req, res) => {
        const data = await userService.create(req.body);

        if (data.data[0]?.error) {
            req.flash('error', data.message);
        } else {
            req.flash('info', 'Create success!');
        }
        res.redirect('back');
    };

    // [GET] /users/:id/edit
    edit = async (req, res) => {
        const id = req.params.id;
        const { data } = await userService.find({ where: { id } });
        res.render('pages/' + this.model + '/edit', {
            [this.model]: data,
            route: this.route,
            error: req.flash('error'),
        });
    };

    // [PUT] /users/:id
    updateWeb = async (req, res) => {
        const id = req.params.id;
        const data = await userService.update({ data: req.body, where: { id } });
        if (data.data[0]?.error) {
            req.flash('error', data.message);
            return res.redirect('back');
        } else {
            req.flash('info', 'Update success!');
        }
        res.redirect(this.route);
    };

    // [DELETE] /users/:id
    destroy = async (req, res) => {
        const id = req.params.id;
        const data = await userService.delete({ where: { id } });
        if (data.data[0]?.error) {
            req.flash('error', data.message);
        } else {
            req.flash('info', 'Delete success!');
        }
        res.redirect('back');
    };

    // API

    // [POST] /users
    create = async (req, res) => {
        const data = await userService.create({ ...req.body, password: userService.hashPassword(req.body.password) });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        res.json(data);
    };
}

module.exports = new UserController();
