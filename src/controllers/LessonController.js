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
    }

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
