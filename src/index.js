const express = require('express');
const path = require('path');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');

const routes = require('./routes');
const { sequelize, connect } = require('./config/connectDB');

const app = express();
const port = process.env.PORT || 5000;

connect();

app.use(methodOverride('_method'));
app.engine(
    'hbs',
    handlebars.engine({
        extname: 'hbs',
        helpers: {
            json: function (context) {
                return JSON.stringify(context);
            },
        },
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// app.use(morgan('dev'));
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
