const categoryService = require('../services/categoryService');
const generateSlug = require('../utils/generateSlug');
const BaseController = require('./BaseController');

class CategoryController extends BaseController {
    constructor() {
        super('category');
        this.model = 'category';
        this.route = '/categories';
    }

    // WEB
    // [GET] /categories
    index = async (req, res) => {
        const categories = await categoryService.find({ raw: true });
        res.render('pages/' + this.model + '/show', {
            categories: categories.data,
            route: this.route,
            message: req.flash('info'),
            error: req.flash('error'),
        });
    };

    // [POST] /categories
    store = async (req, res) => {
        const data = await categoryService.create({ ...req.body, slug: generateSlug(req.body.title) });
        if (data.data[0]?.error) {
            req.flash('error', data.message);
        } else {
            req.flash('info', 'Create success!');
        }
        res.redirect('back');
    };

    // [GET] /categories/:id/edit
    edit = async (req, res) => {
        const id = req.params.id;
        const { data } = await categoryService.find({ where: { id } });
        res.render('pages/' + this.model + '/edit', {
            [this.model]: data,
            route: this.route,
            error: req.flash('error'),
        });
    };

    // [PUT] /categories/:id
    updateWeb = async (req, res) => {
        const id = req.params.id;
        const data = await categoryService.update({ data: req.body, where: { id } });

        if (data.code != 0) {
            req.flash('error', data.message);
            return res.redirect('back');
        } else {
            req.flash('info', 'Update success!');
        }
        res.redirect(this.route);
    };

    // [DELETE] /categories/:id
    destroy = async (req, res) => {
        const id = req.params.id;
        const data = await categoryService.delete({ where: { id } });
        if (data.data[0]?.error) {
            req.flash('error', data.message);
        } else {
            req.flash('info', 'Delete success!');
        }
        res.redirect('back');
    };
}

module.exports = new CategoryController();
