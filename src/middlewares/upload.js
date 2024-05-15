const multer = require('multer');
const { storage, imageFilter } = require('~/helpers/upload');

let uploadMd = multer({ storage: storage, fileFilter: imageFilter }).single('image');

const upload = (req, res, next) => {
    uploadMd(req, res, async (err) => {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return json({ code: 1, message: req.fileValidationError });
        } else if (!req.file) {
            return res.json({ code: 1, message: 'Please select an image to upload' });
        } else if (err instanceof multer.MulterError) {
            return res.status(500).json(err);
        } else if (err) {
            return res.status(500).json(err);
        }

        req.body.id = '';

        req.body.image = 'http://localhost:5000/images/' + req.file.filename;
        next();
    });
};

module.exports = upload;
