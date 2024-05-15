require('module-alias/register');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
// const helmet = require('helmet');

const routes = require('./routes');
const { sequelize, connect } = require('./config/connection');
const helpers = require('./helpers/handlebars');

const app = express();
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

app.use(morgan('dev'));
// app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(
    session({
        secret: 'flashblog',
        saveUninitialized: true,
        resave: true,
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
routes(app);

app.listen(port, () => {
    console.log(`Backend CodeLearn listening on http://localhost:${port}`);
});
