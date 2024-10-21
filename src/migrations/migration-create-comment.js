'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Comments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            commentableId: {
                type: Sequelize.STRING,
            },
            comment: {
                type: Sequelize.STRING,
            },
            reactionsCount: {
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
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Comments');
    },
};
