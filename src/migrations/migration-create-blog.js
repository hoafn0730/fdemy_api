'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface
            .createTable('Blogs', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                userId: {
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
                thumbnail: {
                    type: Sequelize.STRING,
                },
                isApproved: {
                    type: Sequelize.STRING,
                },
                isPublished: {
                    type: Sequelize.STRING,
                },
                publishedAt: {
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
            });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Blogs');
    },
};
