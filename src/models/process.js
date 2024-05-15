'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Process extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Process.init(
        {
            trackId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            stepId: DataTypes.INTEGER,
            dateCompleted: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Process',
        },
    );
    return Process;
};
