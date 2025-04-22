// Import các thư viện và module cần thiết
const { Op } = require('sequelize'); // Toán tử Sequelize để thực hiện các truy vấn phức tạp
const db = require('~/models'); // Import các model từ thư mục models
const courseService = require('~/services/courseService'); // Dịch vụ để lấy thông tin khóa học
const { genai } = require('~/utils/genai'); // Module để gọi API AI (Gemini)

// Tạo một router mới từ Express
const router = require('express').Router();

// GET /api/history - Lấy lịch sử tin nhắn của người dùng
router.get('/history', async (req, res) => {
    try {
        // Truy vấn tất cả tin nhắn của người dùng hiện tại, sắp xếp theo thời gian tạo (tăng dần)
        const messages = await db.Message.findAll({
            where: { userId: req.user.id }, // Lọc theo userId
            order: [['createdAt', 'ASC']], // Sắp xếp theo thời gian tạo (tăng dần)
        });

        // Trả về danh sách tin nhắn dưới dạng JSON
        res.json({ messages });
    } catch (error) {
        console.error(error); // Ghi log lỗi
        res.status(500).json({ error: 'Không thể lấy lịch sử chat' }); // Trả về lỗi 500
    }
});

// POST /api/chat - Gửi tin nhắn và nhận phản hồi từ AI
router.post('/', async (req, res) => {
    const { message } = req.body; // Lấy nội dung tin nhắn từ body của request

    // Kiểm tra nếu không có tin nhắn thì trả về lỗi 400
    if (!message) {
        return res.status(400).json({ error: 'Thiếu message' });
    }

    try {
        // Lưu tin nhắn của người dùng vào cơ sở dữ liệu
        await db.Message.create({
            userId: req.user.id, // ID của người dùng hiện tại
            sender: 'user', // Người gửi là user
            text: message, // Nội dung tin nhắn
        });

        // Lấy 20 tin nhắn gần nhất của người dùng, sắp xếp theo thời gian tạo (giảm dần)
        const messages = await db.Message.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 20, // Giới hạn 20 tin nhắn
        });

        // Đảo ngược thứ tự tin nhắn để hiển thị từ cũ đến mới
        messages.reverse();

        // Lấy danh sách các khóa học miễn phí
        const freeCourses = await courseService.find({
            limit: 8, // Giới hạn 8 khóa học
            where: { price: 0 }, // Lọc các khóa học có giá bằng 0
            order: [['priority', 'ASC']], // Sắp xếp theo độ ưu tiên
            include: { model: db.Category, as: 'category' }, // Bao gồm thông tin danh mục
        });

        // Lấy danh sách các khóa học trả phí
        const proCourses = await courseService.find({
            limit: 8, // Giới hạn 8 khóa học
            where: { price: { [Op.gt]: 0 } }, // Lọc các khóa học có giá lớn hơn 0
            order: [['priority', 'ASC']], // Sắp xếp theo độ ưu tiên
            include: { model: db.Category, as: 'category' }, // Bao gồm thông tin danh mục
        });

        // Tạo ngữ cảnh (context) từ danh sách khóa học miễn phí và trả phí
        const context = JSON.stringify(
            [...freeCourses.data, ...proCourses.data].map((course) => ({
                ...course,
                link: 'http://localhost:3000/courses/' + course.slug,
            })),
        );

        // Gọi API Gemini để nhận phản hồi từ AI
        const geminiRes = await genai.genContent(message, messages, context);

        // Lưu phản hồi từ bot vào cơ sở dữ liệu
        const reply = await db.Message.create({
            userId: req.user.id, // ID của người dùng hiện tại
            sender: 'bot', // Người gửi là bot
            text: geminiRes || 'Không có phản hồi từ AI.', // Nội dung phản hồi
        });

        // Trả về phản hồi từ bot dưới dạng JSON
        res.json({ reply });
    } catch (error) {
        console.error(error); // Ghi log lỗi
        res.status(500).json({ error: 'Lỗi khi chat với AI' }); // Trả về lỗi 500
    }
});

// DELETE /api/chat - Xóa toàn bộ lịch sử tin nhắn của người dùng
router.delete('/', async (req, res) => {
    try {
        // Xóa tất cả tin nhắn của người dùng hiện tại
        const deleted = await db.Message.destroy({
            where: { userId: req.user.id }, // Lọc theo userId
        });

        // Trả về số lượng tin nhắn đã xóa
        res.json({ message: `Đã xóa ${deleted} tin nhắn của userId ${req.user.id}` });
    } catch (err) {
        console.error(err); // Ghi log lỗi
        res.status(500).json({ error: 'Lỗi khi xóa lịch sử' }); // Trả về lỗi 500
    }
});

// Xuất router để sử dụng trong ứng dụng
module.exports = router;
