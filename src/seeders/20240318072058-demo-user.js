'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Users', [
            {
                username: 'hoafn0730',
                email: 'hoafn0730@gmail.com',
                password: '$2a$10$9kpb1QCdiFLIq18Hjablze63ttFKc8sxK7hT8NbM94mgqIX3NF2rK',
                fullName: 'Hoàn Trần',
                avatar: 'http://localhost:5000/images/avatar-1718555918638.jpg',
                role: 'admin',
                type: 'LOCAL',
                code: '1ce5a11c-4327-4f0c-8695-352bdf8de50c',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
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
