'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Register extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Register.init(
        {
            courseId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            registeredAt: DataTypes.STRING,
            process: DataTypes.STRING,
            endOfCourse: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Register',
        },
    );
    return Register;
};
