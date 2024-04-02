const express = require('express');
const courseController = require('../../../controllers/CourseController');

const router = express.Router();

// [GET] /course
router.get('/', courseController.index);

// [POST] /course
router.post('/', courseController.store);

// [GET] /course/:id/edit
router.get('/:id/edit', courseController.edit);

// [PATCH] /course/:id
router.patch('/:id', courseController.update);

// [DELETE] /course/:id
router.delete('/:id', courseController.destroy);

module.exports = router;
