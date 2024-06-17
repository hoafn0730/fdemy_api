const db = require('~/models');
const processService = require('~/services/processService');
const registerService = require('~/services/registerService');
const stepService = require('~/services/stepService');
const trackService = require('~/services/trackService');

class StepController {
    getStepByUuid = async (req, res) => {
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

        // //: Check xem đã có trong process chưa

        // lấy nextStep
        const nextStep = await stepService.find({
            findOne: true,
            where: { priority: data.priority + 1 }, // Tìm bước có số thứ tự lớn hơn bước hiện tại
        });
        const prevStep = await stepService.find({
            findOne: true,
            where: { priority: data.priority - 1 }, // Tìm bước có số thứ tự lớn hơn bước hiện tại
        });

        res.json({ data: { step: data, nextStep: nextStep.data.uuid, prevStep: prevStep.data.uuid ?? null } });
    };

    saveUserProcess = async (req, res, next) => {
        const stepUuid = req.body.stepUuid;
        const { data: step } = await stepService.find({ findOne: true, where: { uuid: stepUuid } });

        // tao tien trinh
        const data = await processService
            .create({
                trackId: step.trackId,
                stepId: step.id,
                userId: req?.user?.id,
                dateCompleted: new Date(),
            })
            .catch(next);

        // cap nhat tien trinh
        const [steps, track, processes] = await Promise.all([
            stepService.find({
                where: {
                    trackId: step.trackId,
                },
            }),
            trackService.find({ where: { id: step.trackId } }),
            processService.find({ where: { trackId: step.trackId, userId: 1 } }),
        ]).catch(next);

        const userProcess = (processes.data.length / steps.data.length) * 100;
        registerService
            .update({
                data: {
                    process: userProcess,
                },
                where: {
                    courseId: track.data.courseId,
                    userId: 1,
                },
            })
            .catch(next);

        if (data.code === -1) {
            res.status(500).json(data.message);
        }

        res.json({
            data: {
                saved: true,
            },
        });
    };
}

module.exports = new StepController();
