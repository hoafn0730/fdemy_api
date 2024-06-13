const webRouter = require('./web');
const apiRouter = require('./api');

const routes = (app) => {
    app.use('/', webRouter);
    app.use('/api/v1', apiRouter);

    app.use((err, rep, res, next) => {
        res.status(500).json({ code: -1, message: 'Something wrong ...', data: { err } });
    });
};

module.exports = routes;
