'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface
            .createTable('Invoices', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                userId: {
                    type: Sequelize.INTEGER,
                },
                courseId: {
                    type: Sequelize.INTEGER,
                },
                nameOnCard: {
                    type: Sequelize.STRING,
                },
                cardNumber: {
                    type: Sequelize.STRING,
                },
                expiryDate: {
                    type: Sequelize.DATE,
                },
                cvv: {
                    type: Sequelize.STRING,
                },
                couponCode: {
                    type: Sequelize.STRING,
                },
                total: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0,
                },
                status: {
                    type: Sequelize.STRING,
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
                queryInterface.addConstraint('Invoices', {
                    fields: ['courseId'],
                    type: 'foreign key',
                    name: 'invoice_course_id_fkey',
                    references: {
                        table: 'Courses',
                        field: 'id',
                    },
                });
            });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Invoices');
    },
};
