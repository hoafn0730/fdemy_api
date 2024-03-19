const express = require('express');
const path = require('path');
const morgan = require('morgan');
const handlebars = require('express-handlebars');

const routes = require('./routes');
const sequelize = require('./config/connectDB');

const app = express();
const port = process.env.PORT || 5000;

async function connect() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
connect();

app.engine(
    'hbs',
    handlebars.engine({
        extname: 'hbs',
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// app.use(morgan('dev'));
app.use('/static', express.static(path.join(__dirname, 'public')));

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
