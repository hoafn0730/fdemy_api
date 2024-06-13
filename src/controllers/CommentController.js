class CommentController {
    getComments = async (req, res) => {
        res.json({ message: 'ok' });
    };
}

module.exports = new CommentController();
