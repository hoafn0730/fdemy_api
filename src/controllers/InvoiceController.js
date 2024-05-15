const db = require('../models');
const userService = require('../services/userService');
const courseService = require('../services/courseService');
const invoiceService = require('../services/invoiceService');
const BaseController = require('./BaseController');

class InvoiceController extends BaseController {
    constructor() {
        super('invoice');
        this.model = 'invoice';
        this.route = '/invoices';
    }

    // WEB
    // [GET] /invoices
    index = async (req, res) => {
        const invoices = await invoiceService.find({
            include: [
                { model: db.Course, as: 'course', attributes: ['id', 'title'] },
                { model: db.User, as: 'user', attributes: ['id', 'username'] },
            ],
            raw: true,
        });
        const courses = await courseService.find({ raw: true });
        const users = await userService.find({ raw: true });

        res.render('pages/' + this.model + '/show', {
            invoices: invoices.data,
            users: users.data,
            courses: courses.data,
            route: this.route,
            message: req.flash('info'),
            error: req.flash('error'),
        });
    };

    // [POST] /invoices
    store = async (req, res) => {
        const data = await invoiceService.create({ ...req.body });

        if (data.data[0]?.error) {
            req.flash('error', data.message);
        } else {
            req.flash('info', 'Create success!');
        }
        res.redirect('back');
    };

    // [GET] /invoices/:id/edit
    edit = async (req, res) => {
        const id = req.params.id;
        const { data } = await invoiceService.find({ where: { id } });
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

    // [PUT] /invoices/:id
    updateWeb = async (req, res) => {
        const id = req.params.id;
        const data = await invoiceService.update({ data: req.body, where: { id } });
        if (data.data[0]?.error) {
            req.flash('error', data.message);
            return res.redirect('back');
        } else {
            req.flash('info', 'Update success!');
        }
        res.redirect(this.route);
    };

    // [DELETE] /invoices/:id
    destroy = async (req, res) => {
        const id = req.params.id;
        const data = await invoiceService.delete({ where: { id } });
        if (data.data[0]?.error) {
            req.flash('error', data.message);
        } else {
            req.flash('info', 'Delete success!');
        }
        res.redirect('back');
    };

    // [GET] /invoices
    get = async (req, res) => {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const data = await invoiceService.find({
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

module.exports = new InvoiceController();
