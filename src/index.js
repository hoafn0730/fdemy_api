require('module-alias/register');
require('dotenv').config();

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
// const helmet = require('helmet');

const routes = require('./routes');
const { sequelize, connect } = require('./config/connection');
const helpers = require('./helpers/handlebars');
const socketService = require('./services/socketService');
const errorHandlingMiddleware = require('./middlewares/errorHandlingMiddleware');
const { corsOptions } = require('./config/cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        // allowedHeaders: ['my-custom-header'],
        // credentials: true,
    },
});

const port = process.env.PORT || 5000;
connect();

app.engine(
    'hbs',
    handlebars.engine({
        extname: 'hbs',
        helpers: helpers,
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(
    session({
        secret: 'flashblog',
        saveUninitialized: true,
        resave: true,
        proxy: true, // if you do SSL outside of node.
        cookie: { expires: 300 * 1000, domain: '.fdemy.id.vn' },
        expiration: 300 * 1000, //
    }),
);
app.use(flash());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
app.use(errorHandlingMiddleware);
app.use((req, res, next) => {
    res.io = io;
    next();
});
routes(app);
io.on('connection', socketService.connection);

server.listen(port, () => {
    console.log(`Backend CodeLearn listening on http://localhost:${port}`);
});
