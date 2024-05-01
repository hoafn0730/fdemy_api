'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Banners', [
            {
                title: 'Học ReactJS Miễn Phí!',
                description:
                    'Khóa học ReactJS từ cơ bản tới nâng cao. Kết quả của khóa học này là bạn có thể làm hầu hết các dự án thường gặp với ReactJS.',
                image: 'https://files.fullstack.edu.vn/f8-prod/banners/Banner_web_ReactJS.png',
                alt: 'Học ReactJS Miễn Phí!',
                ctaTitle: 'ĐĂNG KÝ NGAY',
                linkTo: 'https://www.youtube.com/channel/UCNSCWwgW-rwmoE3Yc4WmJhw',
                priority: 1,
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
