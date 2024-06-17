const { v4: uuidv4 } = require('uuid');

const db = require('~/models');
const BaseController = require('./BaseController');
const courseService = require('~/services/courseService');
const lessonService = require('~/services/lessonService');
const stepService = require('~/services/stepService');
const trackService = require('~/services/trackService');
const upload = require('~/middlewares/uploadMiddleware');

class LessonController extends BaseController {
    constructor() {
        super('lesson');
        this.model = 'lesson';
        this.route = '/lessons';
    }

    // WEB
    // [GET] /lessons
    index = async (req, res) => {
        let courseId = req.query.c;
        const page = req.query.page;
        const courses = await courseService.find({ raw: true });

        if (!courseId) {
            courseId = courses.data[0].id;
            return res.redirect(`${this.route}?c=${courseId}&page=${1}`);
        }
        if (!page) {
            return res.redirect(`${this.route}?c=${courseId}&page=${1}`);
        }

        const resData = await lessonService.find({
            page,
            search: { courseId },
            include: [
                {
                    model: db.Course,
                    as: 'course',
                    attributes: ['id', 'title'],
                },
            ],
        });

        res.render('pages/' + this.model + '/show', {
            lessons: resData.data.data,
            course: courses.data.find((x) => x.id === +courseId),
            courses: courses.data,
            pageNumber: resData.data.meta.pageNumber,
            route: this.route,
            message: req.flash('info'),
            error: req.flash('error'),
        });
    };

    // [POST] /lessons
    store = async (req, res) => {
        const data = await lessonService.create({ ...req.body });
        const track = await trackService
            .find({
                findOne: true,
                where: {
                    courseId: req.body.courseId,
                },
                raw: true,
            })
            .catch((err) => console.log(err));

        // tạo step
        await stepService.create({
            uuid: uuidv4(),
            trackId: track.data.id,
            lessonId: data.data.id,
            title: data.data.title,
            content: data.data.content,
        });

        if (data.data[0]?.error) {
            req.flash('error', data.message);
        } else {
            req.flash('info', 'Create success!');
        }
        res.redirect('back');
    };

    // [GET] /lessons/:id/edit
    edit = async (req, res) => {
        const id = req.params.id;
        const { data } = await lessonService.find({ where: { id } });
        const courses = await courseService.find({});
        res.render('pages/' + this.model + '/edit', {
            [this.model]: data,
            courses: courses.data,
            route: this.route,
            error: req.flash('error'),
        });
    };

    // [PUT] /lessons/:id
    updateWeb = async (req, res) => {
        const id = req.params.id;
        const data = await lessonService.update({ data: req.body, where: { id } });
        if (data.data[0]?.error) {
            req.flash('error', data.message);
            return res.redirect('back');
        } else {
            req.flash('info', 'Update success!');
        }
        res.redirect(this.route);
    };

    // [DELETE] /lessons/:id
    destroy = async (req, res) => {
        const id = req.params.id;
        const data = await lessonService.delete({ where: { id } });
        if (data.data[0]?.error) {
            req.flash('error', data.message);
        } else {
            req.flash('info', 'Delete success!');
        }
        res.redirect('back');
    };

    // [GET] /lessons
    get = async (req, res) => {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const courseId = req.query.courseId;
        const data = await lessonService.find({
            page: page,
            pageSize,
            search: { courseId: courseId },
        });

        if (data.code === -1) {
            return res.status(500).json(data);
        }

        return res.status(200).json(data);
    };

    // [POST] /lessons
    create = async (req, res) => {
        delete req.body.id;
        const [data, track] = await Promise.all([
            lessonService.create({
                ...req.body,
                image: 'http://localhost:5000/uploads/' + req.files.image[0].filename,
                video: req.files?.video
                    ? 'http://localhost:5000/uploads/' + req.files.video[0].filename
                    : req.body.video,
            }),
            trackService.find({
                findOne: true,
                where: {
                    courseId: req.body.courseId,
                },
                raw: true,
            }),
        ]).catch((err) => console.log(err));

        const steps = await stepService.find({ where: { trackId: track.data.id }, raw: true });
        const maxPriority =
            steps.data.length > 0 ? steps.data.map((step) => step.priority).reduce((a, b) => Math.max(a, b)) : 0;

        // tạo step
        const resStep = await stepService.create({
            uuid: uuidv4(),
            trackId: track.data.id,
            lessonId: data.data.id,
            title: data.data.title,
            content: data.data.content,
            priority: maxPriority + 1,
        });

        if (resStep.code === -1 && data.code === -1) {
            return res.status(500).json(data);
        }

        res.json(data);
    };

    // [DELETE] /lessons/:id
    delete = async (req, res) => {
        const id = req.params.id;

        const data = await lessonService.delete({
            where: {
                id,
            },
        });

        const { code } = await stepService.delete({
            where: {
                lessonId: id,
            },
        });

        if (data.code === -1 && code === -1) {
            return res.status(500).json(data);
        }

        res.json(data);
    };
}

module.exports = new LessonController();
