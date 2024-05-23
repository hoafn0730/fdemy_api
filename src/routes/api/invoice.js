const express = require('express');
const router = express.Router();
const invoiceController = require('~/controllers/InvoiceController');
const { authenticateUser } = require('~/middlewares/authMiddleware');

router.all('*', authenticateUser);

router.get('/', invoiceController.get);
router.post('/', invoiceController.create);
router.put('/:id', invoiceController.update);
router.delete('/:id', invoiceController.delete);

module.exports = router;
