const db = require('../models');
const userService = require('../services/userService');
const courseService = require('../services/courseService');
const invoiceService = require('../services/invoiceService');
const BaseController = require('./BaseController');

class InvoiceController extends BaseController {
    constructor() {
        super('invoice');
    }

    // [GET] /invoices
    get = async (req, res) => {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const data = await invoiceService.find({
            page: page,
            pageSize,
            include: [
                { model: db.Course, as: 'course', attributes: ['id', 'title', 'price'] },
                { model: db.User, as: 'user', attributes: ['id', 'username'] },
            ],
            raw: false,
        });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        return res.status(200).json(data);
    };

    getById = async (req, res) => {
        const id = req.params.id;

        const data = await invoiceService.find({
            findOne: true,
            where: { id },
            include: [
                {
                    model: db.Course,
                    as: 'course',
                },
                {
                    model: db.User,
                    as: 'user',
                    attributes: { exclude: ['password', 'role', 'type', 'code', 'createdAt', 'updatedAt'] },
                },
            ],
            raw: false,
        });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        return res.status(200).json(data);
    };
}

module.exports = new InvoiceController();
