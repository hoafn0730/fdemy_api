const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/CourseController');

// [GET] /courses
router.get('/', courseController.index);

// [POST] /courses
router.post('/', courseController.store);

// [GET] /courses/:id/edit
router.get('/:id/edit', courseController.edit);

// [PATCH] /courses/:id
router.patch('/:id', courseController.update);

// [DELETE] /courses/:id
router.delete('/:id', courseController.destroy);

module.exports = router;
