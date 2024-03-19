const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('./config.json')[env];

const sequelize = new Sequelize(
    process.env.DB_DATABASE || config.database,
    process.env.DB_USERNAME || config.username,
    process.env.DB_PASSWORD || config.password,
    {
        host: process.env.DB_HOST || config.host,
        dialect: process.env.DB_CONNECTION || config.dialect,
        logging: config.logging,
    },
);

module.exports = sequelize;
