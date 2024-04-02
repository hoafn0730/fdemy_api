const userService = require('../services/userService');

// WEB
const index = async (req, res) => {
    const users = await userService.find({});
    res.render('user/show', { users: users.data });
};

const store = async (req, res) => {
    const data = await userService.create(req.body);
    res.redirect('/user');
};

const edit = async (req, res) => {
    const id = req.params.id;
    const { data } = await userService.find({ where: { id } });
    res.render('user/edit', { user: data });
};

const update = async (req, res) => {
    const id = req.params.id;
    await userService.update({ data: req.body, where: { id } });
    res.redirect('/user');
};

const destroy = async (req, res) => {
    const id = req.params.id;
    const data = await userService.delete({ where: { id } });
    res.redirect('back');
};

// API
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
    index,
    store,
    edit,
    update,
    destroy,
    getUser,
    createUser,
    updateUser,
    deleteUser,
};
