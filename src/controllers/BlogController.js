const blogService = require('~/services/blogService');
const BaseController = require('./BaseController');

class BlogController extends BaseController {
    constructor() {
        super('blog');
    }

    getBySlug = async (req, res) => {
        const slug = req.params.slug;
        const data = await blogService.find({
            findOne: true,
            where: {
                slug: slug,
            },
        });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        return res.status(200).json(data);
    };
}

module.exports = new BlogController();
