const db = require('~/models');
const processService = require('~/services/processService');
const registerService = require('~/services/registerService');
const stepService = require('~/services/stepService');
const trackService = require('~/services/trackService');

class StepController {
    getStepByUuid = async (req, res) => {
        try {
            const uuid = req.params.uuid;
            const { data } = await stepService.find({
                findOne: true,
                where: { uuid },
                include: [
                    {
                        model: db.Lesson,
                        as: 'lesson',
                        include: {
                            model: db.Quiz,
                            as: 'quizzes',
                            include: {
                                model: db.Answer,
                                as: 'answers',
                            },
                        },
                    },
                ],
                raw: false,
            });

            // // todo: Check xem đã có trong process chưa

            // lấy nextStep
            const nextStep = await stepService.find({
                findOne: true,
                where: { trackId: data.trackId, priority: data.priority + 1 },
            });
            const prevStep = await stepService.find({
                findOne: true,
                where: { trackId: data.trackId, priority: data.priority - 1 },
            });

            res.json({ data: { step: data, nextStep: nextStep.data.uuid, prevStep: prevStep.data.uuid ?? null } });
        } catch (error) {
            next(error);
        }
    };

    saveUserProcess = async (req, res, next) => {
        try {
            const stepUuid = req.body.stepUuid;
            const { data: step } = await stepService.find({ findOne: true, where: { uuid: stepUuid } });

            // tao tien trinh
            const data = await processService.create({
                trackId: step.trackId,
                stepId: step.id,
                userId: req?.user?.id,
                dateCompleted: new Date(),
            });

            // cap nhat tien trinh
            const [{ data: steps }, { data: track }, { data: processes }] = await Promise.all([
                stepService.find({
                    where: {
                        trackId: step.trackId,
                    },
                }),
                trackService.find({ where: { id: step.trackId } }),
                processService.find({ where: { trackId: step.trackId, userId: req.user.id } }),
            ]);

            const userProcess = (processes.length / steps.length) * 100;

            registerService.update({
                data: {
                    process: userProcess,
                },
                where: {
                    courseId: track.courseId,
                    userId: req.user.id,
                },
            });

            if (data.code === -1) {
                res.status(500).json(data.message);
            }

            res.json({
                data: {
                    saved: true,
                },
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new StepController();
