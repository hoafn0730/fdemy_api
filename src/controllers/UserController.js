const userService = require('../services/userService');

// [GET] /users
const getUser = async (req, res) => {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const data = await userService.find({
        page: page,
        pageSize,
    });

    if (data.code === -1) {
        return res.status(500).json(data);
    }

    return res.status(200).json(data);
};

// [POST] /users
const createUser = async (req, res) => {
    const data = await userService.create(req.body);

    if (data.code === -1) {
        return res.status(500).json(data);
    }

    res.json(data);
};

// [PATCH] /users/:id
const updateUser = async (req, res) => {
    const id = req.params.id;
    const data = await userService.update({
        data: {
            ...req.body,
        },
        where: {
            id,
        },
    });

    if (data.code === -1) {
        return res.status(500).json(data);
    }

    res.json(data);
};

// [DELETE] /users/:id
const deleteUser = async (req, res) => {
    const id = req.params.id;

    const data = await userService.delete({
        where: {
            id,
        },
    });

    if (data.code === -1) {
        return res.status(500).json(data);
    }

    res.json(data);
};

module.exports = {
    getUser,
    createUser,
    updateUser,
    deleteUser,
};
