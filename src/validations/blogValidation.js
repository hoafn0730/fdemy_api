const Joi = require('joi');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');

const create = async (req, res, next) => {
    const correctCondition = Joi.object({
        userId: Joi.number().required(),
        title: Joi.string().min(3).max(100).required(),
        description: Joi.string().required(),
        content: Joi.string().required(),
        image: Joi.string().min(6).max(255).optional(),
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });

        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
};
module.exports = {
    create,
};
