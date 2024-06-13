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
            nameOnCard: DataTypes.STRING,
            cardNumber: DataTypes.STRING,
            expiryDate: DataTypes.DATE,
            cvv: DataTypes.STRING,
            couponCode: DataTypes.STRING,
            total: DataTypes.INTEGER,
            status: { type: DataTypes.STRING, defaultValue: 'pending' },
        },
        {
            sequelize,
            modelName: 'Invoice',
        },
    );
    return Invoice;
};
