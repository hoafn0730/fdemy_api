const db = require('~/models');
const courseService = require('~/services/courseService');
const processService = require('~/services/processService');
const stepService = require('~/services/stepService');
const trackService = require('~/services/trackService');

class TrackController {
    getTrack = async (req, res) => {
        const slug = req.query.course;
        const course = await courseService.find({ findOne: true, where: { slug } });
        const track = await trackService.find({ findOne: true, where: { courseId: course.data.id } });
        const steps = await stepService.find({
            where: { trackId: track.data.id },
            include: [{ model: db.Lesson, as: 'lesson' }],
            raw: false,
            order: [['priority', 'ASC']],
        });

        const userProcess = await processService.find({ where: { trackId: track.data.id, userId: req.user.id } });
        track.data.steps = steps.data;

        res.json({
            data: {
                track: track.data,
                userProcess: userProcess.data.map((process) => process.stepId),
            },
        });
    };
}

module.exports = new TrackController();
