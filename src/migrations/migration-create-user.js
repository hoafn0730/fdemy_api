'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface
            .createTable('Users', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },

                username: {
                    type: Sequelize.STRING,
                    unique: true,
                },
                email: {
                    type: Sequelize.STRING,
                    unique: true,
                },
                password: {
                    type: Sequelize.STRING,
                },
                fullName: {
                    type: Sequelize.STRING,
                },
                avatar: {
                    type: Sequelize.STRING,
                },
                banner: {
                    type: Sequelize.STRING,
                },
                bio: {
                    type: Sequelize.STRING,
                },
                role: {
                    type: Sequelize.STRING,
                },
                type: {
                    type: Sequelize.STRING,
                    defaultValue: 'LOCAL',
                },
                code: {
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
                queryInterface.addConstraint('Blogs', {
                    fields: ['userId'],
                    type: 'foreign key',
                    name: 'blog_user_id_fkey',
                    references: {
                        table: 'Users',
                        field: 'id',
                    },
                });
            })
            .then(() => {
                queryInterface.addConstraint('Comments', {
                    fields: ['userId'],
                    type: 'foreign key',
                    name: 'comment_user_id_fkey',
                    references: {
                        table: 'Users',
                        field: 'id',
                    },
                });
            })
            .then(() => {
                queryInterface.addConstraint('Invoices', {
                    fields: ['userId'],
                    type: 'foreign key',
                    name: 'invoice_user_id_fkey',
                    references: {
                        table: 'Users',
                        field: 'id',
                    },
                });
            })
            .then(() => {
                queryInterface.addConstraint('Notifications', {
                    fields: ['userId'],
                    type: 'foreign key',
                    name: 'notification_user_id_fkey',
                    references: {
                        table: 'Users',
                        field: 'id',
                    },
                });
            })
            .then(() => {
                queryInterface.addConstraint('Registers', {
                    fields: ['userId'],
                    type: 'foreign key',
                    name: 'register_user_id_fkey',
                    references: {
                        table: 'Users',
                        field: 'id',
                    },
                });
            });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
    },
};
