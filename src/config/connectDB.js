const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('codelearn_db', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

class Connection {
    async connect() {
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
}

module.exports = new Connection();
