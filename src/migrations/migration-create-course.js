'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface
            .createTable('Courses', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                categoryId: {
                    type: Sequelize.INTEGER,
                },
                title: {
                    type: Sequelize.STRING,
                },
                description: {
                    type: Sequelize.STRING,
                },
                slug: {
                    type: Sequelize.STRING,
                },
                image: {
                    type: Sequelize.STRING,
                },
                icon: {
                    type: Sequelize.STRING,
                },
                content: {
                    type: Sequelize.TEXT,
                },
                oldPrice: {
                    type: Sequelize.INTEGER,
                },
                price: {
                    type: Sequelize.INTEGER,
                },
                video: {
                    type: Sequelize.STRING,
                },
                studentsCount: {
                    type: Sequelize.INTEGER,
                },
                publishedAt: {
                    type: Sequelize.DATE,
                },
                priority: {
                    type: Sequelize.INTEGER,
                },
                deletedAt: {
                    type: Sequelize.DATE,
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
            })
            .then(() => {
                queryInterface.addConstraint('Courses', {
                    fields: ['categoryId'],
                    type: 'foreign key',
                    name: 'course_category_id_fkey',
                    references: {
                        table: 'Categories',
                        field: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                });
            });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Courses');
    },
};
