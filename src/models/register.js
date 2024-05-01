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
            this.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
            this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        }
    }
    Register.init(
        {
            courseId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            registeredAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            process: DataTypes.INTEGER,
            endOfCourse: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Register',
        },
    );
    return Register;
};
