const userService = require('../services/userService');

class UserController {
    constructor() {
        this.page = 'user';
        this.route = '/users';
    }

    // WEB
    index = async (req, res) => {
        const users = await userService.find({});
        res.render('pages/' + this.page + '/show', {
            users: users.data,
            route: this.route,
            message: req.flash('info'),
            error: req.flash('error'),
        });
    };

    store = async (req, res) => {
        const data = await userService.create(req.body);

        if (data.data[0]?.error) {
            req.flash('error', data.message);
        } else {
            req.flash('info', 'Create success!');
        }
        res.redirect('back');
    };

    edit = async (req, res) => {
        const id = req.params.id;
        const { data } = await userService.find({ where: { id } });
        res.render('pages/' + this.page + '/edit', {
            user: data,
            route: this.route,
            error: req.flash('error'),
        });
    };

    update = async (req, res) => {
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

    destroy = async (req, res) => {
        const id = req.params.id;
        const data = await userService.delete({ where: { id } });
        console.log('🚀 ~ UserController ~ destroy= ~ data:', data);
        if (data.data[0]?.error) {
            req.flash('error', data.message);
        } else {
            req.flash('info', 'Delete success!');
        }
        res.redirect('back');
    };

    // API
    // [GET] /users
    getUser = async (req, res) => {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const data = await userService.find({
            page: page,
            pageSize,
        });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        return res.status(200).json(data);
    };

    // [POST] /users
    createUser = async (req, res) => {
        const data = await userService.create(req.body);

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        res.json(data);
    };

    // [PATCH] /users/:id
    updateUser = async (req, res) => {
        const id = req.params.id;
        const data = await userService.update({
            data: {
                ...req.body,
            },
            where: {
                id,
            },
        });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        res.json(data);
    };

    // [DELETE] /users/:id
    deleteUser = async (req, res) => {
        const id = req.params.id;

        const data = await userService.delete({
            where: {
                id,
            },
        });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        res.json(data);
    };
}

module.exports = new UserController();
