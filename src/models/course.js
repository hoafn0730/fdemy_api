'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Course extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Category, {
                foreignKey: 'categoryId',
                as: 'category',
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            });
            this.hasOne(models.Register, { foreignKey: 'courseId', as: 'register' });
        }
    }
    Course.init(
        {
            categoryId: DataTypes.INTEGER,
            title: DataTypes.STRING,
            description: DataTypes.STRING,
            slug: DataTypes.STRING,
            image: DataTypes.STRING,
            icon: DataTypes.STRING,
            content: DataTypes.TEXT,
            oldPrice: DataTypes.INTEGER,
            price: DataTypes.INTEGER,
            video: DataTypes.STRING,
            studentsCount: DataTypes.INTEGER,
            publishedAt: DataTypes.DATE,
            priority: DataTypes.INTEGER,
            deletedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Course',
        },
    );
    return Course;
};
