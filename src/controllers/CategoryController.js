const categoryService = require('../services/categoryService');

const BaseController = require('./BaseController');

class CategoryController extends BaseController {
    constructor() {
        super('category');
    }
}

module.exports = new CategoryController();
