const categoryService = require('../services/categoryService');
const generateSlug = require('../utils/generateSlug');

class CategoryController {
    constructor() {
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
    update = async (req, res) => {
        const id = req.params.id;
        const data = await categoryService.update({ data: req.body, where: { id } });
        if (data.data[0]?.error) {
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

    // API
    getCategories = async (req, res) => {
        const data = await categoryService.find({});

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        return res.status(200).json(data);
    };
}

module.exports = new CategoryController();
