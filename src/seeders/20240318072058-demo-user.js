'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Accounts', [
            {
                username: 'hoafn0730',
                email: 'hoafn0730@example.com',
                password: '123456',
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
        ssss;
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
