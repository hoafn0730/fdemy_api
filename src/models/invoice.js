'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Invoice extends Model {
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
    Invoice.init(
        {
            userId: DataTypes.INTEGER,
            courseId: DataTypes.INTEGER,
            total: DataTypes.INTEGER,
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Invoice',
        },
    );
    return Invoice;
};
