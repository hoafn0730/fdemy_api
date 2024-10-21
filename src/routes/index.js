const apiRouter = require('./api');

const routes = (app) => {
    app.get('/', (req, res) => {
        res.send('<h1>Hello world!</h1>');
    });
    app.use('/api/v1', apiRouter);
};

module.exports = routes;
