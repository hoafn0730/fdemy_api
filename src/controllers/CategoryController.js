const categoryService = require('../services/categoryService');
const generateSlug = require('../utils/generateSlug');

class CategoryController {
    constructor() {
        this.page = 'category';
        this.route = '/categories';
    }

    // WEB
    index = async (req, res) => {
        const categories = await categoryService.find({});
        res.render('pages/' + this.page + '/show', {
            categories: categories.data,
            route: this.route,
            message: req.flash('info'),
            error: req.flash('error'),
        });
    };

    store = async (req, res) => {
        console.log(generateSlug(req.body.title));
        const data = await categoryService.create({ ...req.body, slug: generateSlug(req.body.title) });
        if (data.data[0]?.error) {
            req.flash('error', data.message);
        } else {
            req.flash('info', 'Create success!');
        }
        res.redirect('back');
    };

    edit = async (req, res) => {
        const id = req.params.id;
        const { data } = await categoryService.find({ where: { id } });
        res.render('pages/' + this.page + '/edit', {
            category: data,
            route: this.route,
            error: req.flash('error'),
        });
    };

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
