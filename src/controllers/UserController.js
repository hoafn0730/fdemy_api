const userService = require('../services/userService');
const BaseController = require('./BaseController');

class UserController extends BaseController {
    constructor() {
        super('user');
    }

    getByUsername = async (req, res) => {
        const data = await userService.find({ findOne: true, where: { username: req.params.username } });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        res.json(data);
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
